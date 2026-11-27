/**
 * 用例 PMSID: 1806523
 * 用例标题:  角标设置-保险箱目录内设置角标
 * 生成时间: 2026-08-26 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806523- 角标设置-保险箱目录内设置角标', () => {
  const USERNAME = process.env.TEST_USERNAME;
  const PASSWORD = process.env.TEST_PASSWORD;
  const CASE_DIR = process.env.TESTCASE_DIR;
  const ENV = process.env;

  // 龙猫图片
  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file = "testfile_1806523.txt"
  const test_folder = "testfolder_1806523"

  const work_dir = `dfmvault:///`;
  const vault_real_path = `/home/${USERNAME}/.config/Vault/vault_unlocked/`;
  const test_file_path = `${vault_real_path}/${test_file}`;
  const test_dir_path = `${vault_real_path}/${test_folder}`;
  const test_pic = "test.jpg";
  const test_pic_path = `${work_dir}/${test_pic}`;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 准备步骤: 创建密码保险箱
    console.log('准备步骤: 创建密码保险箱');
    const { createNoPasswordVault } = await import(`${CASE_DIR}midscene_dde_file_manager/common/common.ts`);
    await createNoPasswordVault(uos, ENV, agent, device, system);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 删除密码保险箱
    console.log('清理步骤: 删除密码保险箱');
    const { UiRmNoPasswordVault } = await import(`${CASE_DIR}midscene_dde_file_manager/common/common.ts`);
    await UiRmNoPasswordVault(device, agent, uos, ENV, systems);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 显示桌面
    console.log('清理步骤: 显示桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件和文件夹
    console.log('准备步骤: 创建测试文件和文件夹');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`mkdir -p ${test_dir_path}`);

    // 准备步骤: 准备测试图片
    console.log('准备步骤: 准备测试图片');
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    await system.exec(`cp ${pic_url} ${test_pic_path}`);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);
    await system.exec(`gio set ${test_dir_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);

    // 清理步骤: 清空回收站
    console.log('清理步骤: 清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1806523- 角标设置-保险箱目录内设置角标', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开保险箱
    console.log('步骤 1: 打开保险箱');
    await system.exec(`dde-file-manager`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器已打开');
    await agent.aiTap('文件管理器左侧栏的保险箱');
    await agent.aiWaitFor('已经切换到保险箱目录')

    // 预期 1: ${test_file}和${test_folder}显示在文件管理器右侧内容区域
    console.log(`预期 1：${test_file}和${test_folder}显示在文件管理器右侧内容区域`);
    await agent.aiWaitFor(`文件管理器右侧内容区域中有${test_file}文件和${test_folder}文件夹`);

    // 步骤 2: 给文件和文件夹设置角标
    console.log('步骤 2: 给文件和文件夹设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);
    await system.exec(`gio set ${test_dir_path} -t stringv metadata::emblems "${test_pic_path}:ru"`);

    // 预期 2: ${test_file}和${test_folder}没有角标
    console.log(`预期 2：${test_file}和${test_folder}没有角标`);
    await device.pressKey('F5');
    await agent.aiAssert(`文件管理器右侧内容区域中${test_file}文件图标右上角没有缩小的正方形龙猫图片`);
    await agent.aiAssert(`文件管理器右侧内容区域中${test_folder}文件夹图标右上角没有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806523', 'level3', 'DITT', 'youwei', 'emblems', 'vault'] });

});
