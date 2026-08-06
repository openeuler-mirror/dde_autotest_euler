/**
 * 用例 PMSID: 1985359
 * 用例标题: 【非功能性需求】【dde-dconfig】【控制中心】【电源管理】【使用电池】低电量操作配置设置检查
 * 生成时间: 2026-04-24
 * 用例编写人: UT001924（李鹤）
 */

describe('1985359-【非功能性需求】【dde-dconfig】【控制中心】【电源管理】【使用电池】低电量操作配置设置检查', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.daemon",
    source: "org.deepin.dde.daemon.power",
    key: "lowPowerAction",
    testValue0: 0,
    testValue1: 1
  };

  let defaultValue;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    defaultValue = await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system);
    console.log(`低电量操作默认值为: ${defaultValue}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1985359-【非功能性需求】【dde-dconfig】【控制中心】【电源管理】【使用电池】低电量操作配置设置检查', async ({ device, agent, uos, system }) => {
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);

    const openPowerManagementUsingBattery = async () => {
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap("电源管理");
      await agent.aiTap("使用电池");
      await agent.aiWaitFor("'低电量管理'文字可见");
    };

    // 步骤1: 执行命令设置低电量操作为0
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValue0, system);

    // 步骤2: 打开控制中心-电源管理-使用电池，检查低电量时设置值
    await openPowerManagementUsingBattery();
    await agent.aiAssert("低电量时显示自动待机");

    // 关闭控制中心
    await device.pressKey("alt", "F4");

    // 步骤3: 执行命令设置低电量操作为1
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValue1, system);

    // 步骤4: 打开控制中心-电源管理-使用电池，检查低电量时设置值
    await openPowerManagementUsingBattery();
    await agent.aiAssert("低电量时显示自动休眠");
  }, { timeout: 600000, tags: ['1985359', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, Number(defaultValue), system);
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});