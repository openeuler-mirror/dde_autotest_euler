/**
 * 用例 PMSID: 1806527
 * 用例标题: 角标设置-管理员目录设置角标
 * 生成时间: 2026-08-25 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806527-角标设置-管理员目录设置角标', () => {
  const USERNAME = process.env.TEST_USERNAME;
  const PASSWORD = process.env.TEST_PASSWORD;

  // 龙猫图片
  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file = "testfile_1806527.txt"

  const work_dir = `/home/${USERNAME}/Desktop/`;
  const test_file_path = `${work_dir}/${test_file}`;
  const test_pic = "test.png";
  const test_pic_path = `${work_dir}/${test_pic}`;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);

    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 准备步骤: 准备测试图片
    console.log('准备步骤: 准备测试图片');
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);
    await system.exec(`cp ${pic_url} ${test_pic_path}`);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();

    // 准备步骤: 给文件设置角标
    console.log('准备步骤: 给文件设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}角标设置成功, 文件${test_file}图标的右上角有缩小的正方形龙猫图片`);
  });

  test('1806527-角标设置-管理员目录设置角标', async ({ device, agent, uos, system }) => {
    // 步骤 1: 以管理员身份打开文件管理器
    console.log('步骤 1: 以管理员身份打开文件管理器');
    await system.exec(`dde-file-manager -r ${work_dir}`, 500);
    const needAuthorized = await agent.aiBoolean(`有密码认证对话框`);
    assertTrue(needAuthorized, '没有密码认证对话框');
    if (needAuthorized) {
      await agent.aiTap('请输出密码输入框');
      await device.typeText(PASSWORD, false);
      await agent.aiWaitFor('密码认证对话框中的确定按钮可用');
      await agent.aiTap('密码认证对话框中的确定按钮');
    }
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器窗口打开, 当前目录为${work_dir.replace(/\/+$/, '').split('/').pop()}`);

    // 预期 1: ${test_file}没有角标
    console.log('预期 1: ${test_file}没有角标');
    await agent.aiAssert(`文件管理器右侧内容区域中文件${test_file}右上角没有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806527', 'level3', 'DITT', 'youwei', 'emblems', 'root'] });


  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);

    // 清理步骤: 清空回收站
    console.log('清理步骤: 清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec(`echo ${PASSWORD} | sudo -S killall -15 dde-file-manager`);
    await system.exec('killall -15 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
