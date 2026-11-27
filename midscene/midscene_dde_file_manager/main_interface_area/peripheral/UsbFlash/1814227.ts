/**
 * 用例 PMSID: 1814227
 * 用例标题: 【U盘】删除文件后，原路径父目录不存在，还原
 * 生成时间: 2026-10-22 19:30:00
 * 用例编写人: UT000159（游伟）
 */


describe('1814227-【U盘】删除文件后，原路径父目录不存在，还原', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;
  const USB_FLASH = process.env.USB_FLASH;

  // USB 挂载路径 (需要根据实际 USB 设备调整)
  const usb_base_path = `/media/${USERNAME}/${USB_FLASH}`;
  const test_dir_a = 'A-1814227';
  const test_dir_b = 'B-1814227';
  const test_file = 'b1.txt';
  const test_file_path = `${usb_base_path}/${test_dir_a}/${test_dir_b}/${test_file}`;
  const test_dir_a_path = `${usb_base_path}/${test_dir_a}`;
  const test_dir_b_path = `${usb_base_path}/${test_dir_a}/${test_dir_b}`;

  let status = "false";

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    await system.exec('killall -15 dde-file-manager');
    await uos.showDesktop();

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 检查 USB 是否已挂载
    console.log('准备步骤：检查 USB 是否已挂载');
    const usbMounted = await system.exec(`mount -l | grep "${usb_base_path}"`);
    assertTrue(usbMounted.success, 'USB 未挂载，请先插入 USB 设备');

    // 准备步骤: 清理回收站
    console.log('准备步骤：清理回收站');
    await system.exec('gio trash --empty');

    // 准备步骤: 开启组策略 (dfm.trash.allfiletotrash)
    console.log('准备步骤：开启组策略 dfm.trash.allfiletotrash');
    let result = await system.exec(`dde-dconfig --get -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.trash.allfiletotrash`);
    assertTrue(result.success, '获取 dfm.trash.allfiletotrash 状态失败');
    status = result.stdout.trim();
    if (status !== 'true') {
      await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.trash.allfiletotrash -v true`);
    }

    // 准备步骤: 重新创建测试文件和目录 (确保环境干净)
    console.log('准备步骤：重新创建测试文件和目录');
    await system.exec(`test -d ${usb_base_path}/${test_dir_a} && rm -rf ${usb_base_path}/${test_dir_a} || true`);
    await system.exec(`mkdir -p ${test_dir_b_path}`);
    await system.exec(`yes "Test content" | head -n 10 > ${test_file_path}`);

    // 准备步骤: 打开目录${test_dir_b_path}
    console.log(`准备步骤：打开目录 ${test_dir_b_path}`);
    await uos.showDesktop();
    await system.exec(`dde-file-manager "${test_dir_b_path}"`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹 ${test_dir_b_path} 被打开`);
  });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 恢复组策略
    console.log('清理步骤：恢复组策略');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.trash.allfiletotrash -v ${status}`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 恢复目录权限
    console.log('清理步骤：恢复目录权限');
    await system.exec(`chmod 755 ${test_dir_b_path} || true`);
    await system.exec(`chmod 755 ${usb_base_path}/${test_dir_a} || true`);

    // 清理步骤: 清理测试文件和目录
    console.log('清理步骤: 清理测试文件和目录');
    await system.exec(`test -d ${usb_base_path}/${test_dir_a} && rm -rf ${usb_base_path}/${test_dir_a} || true`);

    // 清理步骤: 清理回收站
    console.log('清理步骤: 清理回收站');
    await system.exec('gio trash --empty');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 清理测试目录
    console.log('清理步骤：清理测试目录');
    await system.exec(`rm -rf ${usb_base_path}/${test_dir_a} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1814227-【U盘】删除文件后，原路径父目录不存在，还原_文件进入回收站', async ({ device, agent, uos, system }) => {

    // 步骤 1: 选中文件 b1.txt
    console.log('步骤 1：选中文件 b1.txt');
    await agent.aiTap('文件管理器右侧内容窗口任意空白处');
    await agent.aiTap(`文件管理器右侧内容窗口的 ${test_file} 文件图标`);
    await agent.aiWaitFor(`文件 ${test_file}被选中`);

    // 步骤 2: 删除文件 b1.txt (按 Delete 键)
    console.log('步骤 2：删除文件 b1.txt');
    await device.pressKey('Delete');

    // 预期 2-1: 没有弹出删除确认对话框
    console.log('预期 2-1：没有弹出删除确认对话框');
    await agent.aiAssert('没有弹出删除确认对话框');

    // 预期 2-2: 验证文件已从原位置删除
    console.log('预期 2-2：验证文件已从原位置删除');
    const isExist = await system.exec(`test -f ${usb_base_path}/${test_dir_a}${test_file}`);
    assertFalse(isExist.success, '文件不存在');

    // 步骤 5: 打开回收站
    console.log('步骤 5：打开回收站');
    await system.exec('dde-file-manager "trash:///"');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('回收站打开成功');

    // 预期 5: 回收站中存在文件 ${test_file}
    console.log(`预期 5：回收站中存在文件 ${test_file}`);
    await agent.aiAssert(`回收站中存在文件 ${test_file}`);

    // 步骤 6: 删除文件夹 ${test_dir_a}
    console.log(`步骤 6：删除文件夹 ${test_dir_a}`);
    await system.exec(`rm -rf ${test_dir_a_path}`);

    // 预期 6: 删除${test_dir_a}成功
    console.log(`预期 6：删除${test_dir_a}成功`);
    const isExist2 = await system.exec(`test -d ${test_dir_a_path}`);
    assertFalse(isExist2.success, `文件夹${test_dir_a}删除失败`);

    // 步骤 7: 还原文件
    console.log('步骤 7：还原文件');
    await agent.aiTap('回收站右侧内容窗口任意空白处');
    await agent.aiRightClick(`回收站右侧内容窗口的 ${test_file} 文件图标`);
    await agent.aiWaitFor('弹出右击菜单');
    await agent.aiTap('右击菜单中的还原按钮');

    // 预期 7: 还原失败，无法找到原路径
    console.log('预期 7：还原失败，无法找到原路径');
    await agent.aiAssert('弹出提示框, 显示: 还原失败，无法找到原路径');

  }, { timeout: 600000, tags: ['1814227', 'level3', 'DITT', 'youwei', 'USB', 'trash', 'restore', 'missing parent directory'] });

});
