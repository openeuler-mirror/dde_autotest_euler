/**
 * 用例 PMSID: 1814295
 * 用例标题: 【U盘】剪切大文件到U盘中去
 * 生成时间: 2026-10-21 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1814295-【U盘】剪切大文件到U盘中去', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;
  const USB_FLASH = process.env.USB_FLASH;

  const usb_mount_point = `/media/${USERNAME}/${USB_FLASH}`;   // U盘挂载点
  const local_source_dir = `/home/${USERNAME}/Documents`;      // 本地源目录(文档)

  const test_folder_name = 'test_folder_1814295';
  const large_file_name = 'large_file_1814295.bin';            // 大文件(>80M)

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤: 关闭所有文件管理器
    console.log('准备步骤：关闭所有文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤: 回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 校验U盘已挂载(前置条件: 已挂载U盘)
    console.log('准备步骤：校验U盘已挂载');
    const mountChk = await system.exec(`findmnt -n -o TARGET "${usb_mount_point}" || echo MISS`);
    assertTrue(!`${mountChk.stdout || ''}`.includes('MISS'), `U盘未挂载: ${usb_mount_point} 不存在，请检查执行机U盘环境`);
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理本地可能存在的测试文件夹
    console.log('准备步骤：清理本地可能存在的测试文件夹');
    await system.exec(`test -d ${local_source_dir}/${test_folder_name} && rm -rf ${local_source_dir}/${test_folder_name} || true`);

    // 准备步骤: 清理U盘可能残留的测试文件夹
    console.log('准备步骤：清理U盘可能残留的测试文件夹');
    await system.exec(`test -d ${usb_mount_point}/${test_folder_name} && rm -rf ${usb_mount_point}/${test_folder_name} || true`);

    // 准备步骤: 回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 在本地创建含大文件(>80M)的测试目录
    console.log('准备步骤：在本地创建含大文件(>80M)的测试目录');
    await system.exec(`mkdir -pv ${local_source_dir}/${test_folder_name}`);
    await system.exec(`truncate -s 100M ${local_source_dir}/${test_folder_name}/${large_file_name}`);
    const bigChk = await system.exec(`test -f ${local_source_dir}/${test_folder_name}/${large_file_name}`);
    assertTrue(bigChk.success, `本地大文件 ${large_file_name} 创建失败`);

    // 准备步骤: 打开本地源目录(文档)
    console.log('准备步骤：打开本地源目录');
    await system.exec(`dde-file-manager ${local_source_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('已打开文件管理器文档窗口');
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 清理本地测试文件夹
    console.log('清理步骤：清理本地测试文件夹');
    await system.exec(`test -d ${local_source_dir}/${test_folder_name} && rm -rf ${local_source_dir}/${test_folder_name} || true`);

    // 清理步骤: 清理U盘可能残留的测试文件夹
    console.log('清理步骤：清理U盘可能残留的测试文件夹');
    await system.exec(`test -d ${usb_mount_point}/${test_folder_name} && rm -rf ${usb_mount_point}/${test_folder_name} || true`);

    // 清理步骤: 回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  test('1814295-【U盘】剪切大文件到U盘中去', async ({ device, agent, uos, system }) => {

    // 步骤 1: 复制(剪切)任意含有大文件(>80M)的目录文件
    console.log('步骤 1：选中本地含大文件(>80M)的目录并剪切');
    await agent.aiTap(`文件管理器右侧内容窗口中的${test_folder_name}文件夹图标`);
    await agent.aiWaitFor(`文件夹${test_folder_name}被选中`);
    await device.pressKey('Ctrl', 'C');

    // 步骤 2: 到U盘中粘贴
    console.log('步骤 2：导航到U盘并粘贴');
    await agent.aiWaitFor(`文件管理器左侧边栏显示${USB_FLASH}磁盘条目`);
    await agent.aiTap(`文件管理器左侧边栏设备分组中的${USB_FLASH}磁盘`);
    await agent.aiWaitFor(`已进入U盘${USB_FLASH}目录`);
    await device.pressKey('Ctrl', 'V');

    // 预期 2-1: 剪切粘贴成功, 大文件完整到达U盘
    console.log('预期 2-1：剪切粘贴成功, 大文件完整到达U盘');
    await agent.aiWaitFor(`U盘中出现文件夹${test_folder_name}`, { timeoutMs: 120000 });
    await agent.aiAssert(`U盘文件管理器窗口中显示文件夹${test_folder_name}`);
    const usbResult = await system.exec(`test -f ${usb_mount_point}/${test_folder_name}/${large_file_name}`);
    assertTrue(usbResult.success, `U盘中不存在大文件 ${large_file_name}, 剪切粘贴失败`);


  }, { timeout: 600000, tags: ['1814295', 'level3', 'remote', 'DITT', 'youwei', 'USB', 'file operation', 'copy', 'large file'] });
});
