/**
 * 用例 PMSID: 1915505
 * 用例标题: 【控制中心】【安全密钥】Dconfig配置开启后，控制中心才可同步展示安全密钥模块
 * 生成时间: 2026-06-04 15:53:27
 * 用例编写人: UT002485(卢燕)
 */

describe('1915505-【控制中心】【安全密钥】Dconfig配置开启后，控制中心才可同步展示安全密钥模块', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.control-center",
    source: "org.deepin.dde.control-center.passkey",
    key: "dccPasskeyPluginHideStatus",
    testValueShow: false,
    testValueHide: true
  };

  let defaultValue;

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    defaultValue = await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system);
    console.log(`安全密钥模块隐藏状态默认值为: ${defaultValue}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1915505-【控制中心】【安全密钥】Dconfig配置开启后，控制中心才可同步展示安全密钥模块', async ({ device, agent, uos, system }) => {
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);

    const openAccountSettings = async () => {
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap("账户");
    };

    // 步骤1: 命令行设置安全密钥模块为显示状态
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValueShow, system);

    // 步骤2: 打开控制中心-账户界面
    await openAccountSettings();

    // 步骤3: 检查账户界面显示“安全密钥”菜单项
    await agent.aiWaitFor("'安全密钥'文字可见");
    await agent.aiAssert('安全密钥菜单项正确提供');

    // 步骤4: 点击安全密钥，检查设置界面
    await agent.aiTap("安全密钥");
    await agent.aiWaitFor("'请插入安全密钥'文字及图案显示");
    await agent.aiAssert('安全密钥设置界面正确提供');

    // 关闭控制中心
    await device.pressKey("alt", "F4");
  }, { timeout: 600000, tags: ['1915505', 'level2', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, defaultValue, system);
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
