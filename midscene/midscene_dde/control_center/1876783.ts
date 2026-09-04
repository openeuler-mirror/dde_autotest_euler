/**
 * 用例 PMSID: 1876783
 * 用例标题: 【控制中心】【电源管理】【通用】【笔记本】配置项设置低电量时自动开启节能模式
 * 生成时间: 2026-04-24
 * 用例编写人: UT001924（李鹤）
 */

describe('1876783-【控制中心】【电源管理】【通用】【笔记本】配置项设置低电量时自动开启节能模式', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.daemon",
    source: "org.deepin.dde.daemon.power",
    key: "powerSavingModeAutoWhenBatteryLow",
    testValueTrue: true,
    testValueFalse: false
  };

  let defaultValue;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    defaultValue = await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system);
    console.log(`低电量时自动开启节能模式默认值为: ${defaultValue}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876783-【控制中心】【电源管理】【通用】【笔记本】配置项设置低电量时自动开启节能模式', async ({ device, agent, uos, system }) => {
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);

    const openPowerManagementGeneral = async () => {
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap("电源管理");
      await agent.aiTap("通用");
      await agent.aiWaitFor("'节能设置'文字可见");
    };

    // 步骤1: 点击控制中心-电源管理-通用
    await openPowerManagementGeneral();

    // 步骤2: 点击低电量时自动开启节能模式开关
    await agent.aiTap("低电量时自动开启节能模式右边的开关(开关可能是灰色也可能是蓝色)", { deepThink: true });
    await agent.aiAssert("低电量时自动开启节能模式开关为灰色关闭状态");

    // 关闭控制中心
    await device.pressKey("alt", "F4");

    // 步骤3: 执行命令设置为true
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValueTrue, system);

    // 步骤4: 点击控制中心-电源管理-通用
    await openPowerManagementGeneral();

    // 步骤5: 预期：低电量时自动开启节能模式开关是开启状态(蓝色)
    await agent.aiAssert("低电量时自动开启节能模式开关为蓝色开启状态");

    // 关闭控制中心
    await device.pressKey("alt", "F4");

    // 步骤6: 执行命令设置为false
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValueFalse, system);

    // 步骤7: 点击控制中心-电源管理-通用
    await openPowerManagementGeneral();

    // 步骤8: 预期：低电量时自动开启节能模式开关是关闭状态(灰色)
    await agent.aiAssert("低电量时自动开启节能模式开关为灰色关闭状态");
  }, { timeout: 600000, tags: ['1876783', 'level3', 'laptop'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, defaultValue, system);
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
