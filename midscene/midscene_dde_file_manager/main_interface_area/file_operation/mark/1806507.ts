/**
 * 用例 PMSID: 1806507
 * 用例标题: 角标设置-系统角标与设置角标不同位置
 * 生成时间: 2026-08-24 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806507-角标设置-系统角标与设置角标不同位置', () => {
  const USERNAME = process.env.TEST_USERNAME;
  const PASSWD = process.env.TEST_PASSWORD;
  const CASEDIR = process.env.TESTCASE_DIR;

  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file = "testfile_1806507.txt"
  const test_dir = "testdir_1806507";
  const auxiliary_file = "aux_file_1806507.txt";

  const work_dir = `/home/${USERNAME}/Desktop/`;
  const test_file_path = `${work_dir}/${test_file}`;
  const auxiliary_file_path = `${work_dir}/${auxiliary_file}`;
  const test_dir_path = `${work_dir}/${test_dir}`;
  const test_pic = "test.png";
  const test_pic_path = `${work_dir}/${test_pic}`;

  const ShareFolderUtil = `${CASEDIR}/midscene_dde_file_manager/main_interface_area/file_operation/mark/common.ts`;
  let shareFolder = null;

  const zoom_count = 3;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 准备步骤: 初始化ShareFolder类
    console.log('准备步骤: 初始化ShareFolder类');
    const { ShareFolder } = await import(ShareFolderUtil);
    shareFolder = new ShareFolder(PASSWD, USERNAME, agent, system, device);
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${auxiliary_file_path} && rm ${auxiliary_file_path} || true`);

    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
    await system.exec(`yes "Hello World! Auxiliary" | head -n 10 > ${auxiliary_file_path}`);
    await system.exec(`mkdir -p ${test_dir_path}`);

    // 准备步骤: 准备测试图片
    console.log('准备步骤: 准备测试图片');
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    await system.exec(`cp ${pic_url} ${test_pic_path}`);
    // await system.exec(`head -c 1024 ${test_pic} > ${test_pic}`); // 截取图片的前1024个字节创建损坏的图片

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();

    // 准备步骤: 设置桌面缩放比例
    console.log('准备步骤: 设置桌面缩放比例');
    await agent.aiTap('桌面任意空白位置');
    for (let i = 0; i < zoom_count; i++) {
      await device.pressKey('Ctrl', '=');
    }

    // 准备步骤: 给文件和文件夹设置角标
    console.log('准备步骤: 给文件和文件夹设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);
    await system.exec(`gio set ${test_dir_path} -t stringv metadata::emblems "${test_pic_path};ru"`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}和${test_dir}角标设置成功, 文件${test_file}和文件夹${test_dir}右上角有缩小的龙猫图片`);
  });

  test('1806507-角标设置-系统角标与设置角标不同位置_只读', async ({ device, agent, uos, system }) => {
    // 步骤 1: 设置测试文件为只读
    console.log('步骤 1: 设置测试文件为只读');
    await system.exec(`chmod 400 ${test_file_path}`);
    // await system.exec(`chmod 400 ${auxiliary_file_path}`);

    // 预期 1: 文件同时有只读角标和图片角标
    console.log('预期 1: 文件同时有只读角标和图片角标');
    for (zoom_count_actual = 0; zoom_count_actual < zoom_count; zoom_count_actual++) {
      await device.pressKey('Ctrl', '=');
    }
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上文件${test_file}图标右下角有锁的符号`,
      {
        timeoutMS: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiAssert(`桌面上文件${test_file}右上角有缩小的龙猫图片`, { deepThink: true });

  }, { timeout: 600000, tags: ['1806507', 'level3', 'DITT', 'youwei', 'emblems', 'readonly'] });

  test('1806507-角标设置-系统角标与设置角标不同位置_共享', async ({ device, agent, uos, system }) => {
    // 步骤 1: 共享测试文件夹
    console.log('步骤 1: 共享测试文件夹');
    await shareFolder.shareFolder(test_dir, work_dir);

    // 预期 1: 文件夹同时有共享角标和图片角标
    console.log('预期 1: 文件夹同时有共享角标和图片角标');
    await device.pressKey('F5');
    await agent.aiAssert(`桌面上文件夹${test_dir}右上角有缩小的龙猫图片`);
    await agent.aiAssert(`桌面上文件夹${test_dir}右下角有共享的符号`, { deepThink: true });
  }, { timeout: 600000, tags: ['1806507', 'level3', 'DITT', 'youwei', 'emblems', 'share'] });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 恢复缩放
    console.log('清理步骤: 恢复缩放');
    await system.exec("rm -rf ~/.config/deepin/dde-desktop");
    await system.exec('systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service');

    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 取消文件夹共享
    console.log('清理步骤: 取消文件夹共享');
    await shareFolder.unshareFolder();
    await shareFolder.stopSMB();

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${auxiliary_file_path} && rm ${auxiliary_file_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 显示桌面
    console.log('清理步骤: 显示桌面');
    await uos.showDesktop();

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
