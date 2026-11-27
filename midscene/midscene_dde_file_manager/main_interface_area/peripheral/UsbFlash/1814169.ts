/**
 * 用例 PMSID: 1814169
 * 用例标题: 【U盘】Bug194699转：U盘中复制多层次级的文件到本地
 * 生成时间: 2026-08-28 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1814169-【U盘】Bug194699转：U盘中复制多层次级的文件到本地', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;
  const USB_FLASH = process.env.USB_FLASH;

  const usb_mount_point = `/media/${USERNAME}/${USB_FLASH}`;  // U盘挂载点
  const local_target_dir = `/home/${USERNAME}/Documents/`;
  const local_target_name = "文档";

  const test_folder_name = 'test_folder_1814169';
  const test_folder_structure = [
    '层级1',
    '层级1/层级2',
    '层级1/层级2/层级3',
    '层级1/层级2/层级3/层级4',
    '层级1/层级2/层级3/层级4/层级5'
  ];

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

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理本地可能存在的测试文件夹
    console.log('准备步骤：清理本地可能存在的测试文件夹');
    await system.exec(`test -d ${local_target_dir}/${test_folder_name} && rm -rf ${local_target_dir}/${test_folder_name} || true`);

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 创建U盘测试数据
    console.log('准备步骤：检查并准备U盘测试数据');
    const usbPath = `${usb_mount_point}/${test_folder_name}`;
    await system.exec(`test -d ${usbPath} && rm -rf ${usbPath} || true`);

    // 创建多层级的测试文件夹结构
    await system.exec(`mkdir -pv ${usbPath}/${test_folder_structure.pop()}`);
    for ( let i = 0; i < test_folder_structure.length; i++ ) {
      const folder = test_folder_structure[i];
      await system.exec(`echo "File ${i} content" > ${usbPath}/${folder}/test_${i}.txt`);
    }


    // 准备步骤：打开U盘
    console.log('准备步骤：打开U盘');
    await system.exec(`dde-file-manager ${usb_mount_point}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`已打开文件管理器${USB_FLASH}窗口`);

  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 清理本地复制的测试文件夹
    console.log('清理步骤：清理本地复制的测试文件夹');
    await system.exec(`test -d ${local_target_dir}/${test_folder_name} && rm -rf ${local_target_dir}/${test_folder_name} || true`);

    // 清理步骤: 清理U盘可能残留的测试文件夹
    console.log('清理步骤：清理U盘可能残留的测试文件夹');
    await system.exec(`test -d ${usb_mount_point}/${test_folder_name} && rm -rf ${usb_mount_point}/${test_folder_name} || true`);

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');



  });

  test('1814169-【U盘】Bug194699转：U盘中复制多层次级的文件到本地', async ({ device, agent, uos, system }) => {

    // 步骤 1: 找到并选中多层次文件夹
    console.log('步骤 1：找到并选中多层次文件夹');
    await agent.aiTap(`文件管理器右侧内容窗口中的${test_folder_name}文件夹图标`);
    await agent.aiWaitFor(`文件夹${test_folder_name}被选中`);

    // 步骤 2: 复制多层次文件夹
    console.log('步骤 2：复制多层次文件夹');
    await device.pressKey('Ctrl', 'C');

    // 步骤 3: 导航到本地目标位置
    console.log('步骤 3：导航到本地目标位置');
    await agent.aiTap('文件管理器左侧导航栏中的文档文件夹');
    await agent.aiWaitFor(`文件夹${local_target_name}打开成功`);

    // 步骤 4: 粘贴文件夹
    console.log('步骤 4：粘贴文件夹到本地');
    await device.pressKey('Ctrl', 'V');
    // await agent.aiWaitFor('文件夹粘贴操作完成');

    // 预期 4: 复制操作成功, 层级和文件完整
    console.log('预期 4：复制操作成功, 层级和文件完整');
    let result = await system.exec(`test -d ${local_target_dir}/${test_folder_name}`)
    assertTrue(result.success, `文件夹${test_folder_name}不存在，复制失败`);

    for (let i = 0; i < test_folder_structure.length; i++) {
      const folder = test_folder_structure[i];
      result = await system.exec(`test -d ${local_target_dir}/${test_folder_name}/${folder}`);
      assertTrue(result.success, `文件夹${folder}不存在，复制失败`);
      result = await system.exec(`test -f ${local_target_dir}/${test_folder_name}/${folder}/test_${i}.txt`);
      assertTrue(result.success, `文件file_${i}.txt不存在，复制失败`);
    }

  }, { timeout: 600000, tags: ['1814169', 'level3', 'remote', 'DITT', 'youwei', 'USB', 'file operation', 'copy', 'multi-level', 'folder'] });
});
