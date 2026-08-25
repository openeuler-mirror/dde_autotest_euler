/**
 * 用例 PMSID: 1696225
 * 用例标题: 【控制中心】【电源管理】【使用电池】修改低电量操作设置值，检查低电量阈值设置值
 * 生成时间: 2026-04-28
 * 用例编写人: UT001924（李鹤）
 */

describe('1696225-【控制中心】【电源管理】【使用电池】修改低电量操作设置值，检查低电量阈值设置值', () => {

  const caseDir = process.env.TESTCASE_DIR;

  const powerService = {
    busName: "org.deepin.dde.Power1",
    objectPath: "/org/deepin/dde/Power1",
    interfaceName: "org.deepin.dde.Power1",
    lowPowerActionKey: "LowPowerAction",
    lowPowerAutoSleepThresholdKey: "LowPowerAutoSleepThreshold",
    resetLowPowerActionKeyValue: 1,
    resetLowPowerAutoSleepThresholdKeyValue: 5
  };

  let defaultLowPowerAction;
  let defaultLowPowerAutoSleepThreshold;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    
    const { BusctlGetProperty } = await import(`${caseDir}midscene_dde/common/common.ts`);
    defaultLowPowerAction = await BusctlGetProperty("--user", powerService.busName, powerService.objectPath, powerService.interfaceName, powerService.lowPowerActionKey, system);
    defaultLowPowerAutoSleepThreshold = await BusctlGetProperty("--user", powerService.busName, powerService.objectPath, powerService.interfaceName, powerService.lowPowerAutoSleepThresholdKey, system);
    
    console.log(`低电量操作默认值为: ${defaultLowPowerAction}`);
    console.log(`低电量阈值默认值为: ${defaultLowPowerAutoSleepThreshold}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1696225-【控制中心】【电源管理】【使用电池】修改低电量操作设置值，检查低电量阈值设置值', async ({ device, agent, uos, system }) => {
    const { BusctlSetProperty } = await import(`${caseDir}midscene_dde/common/common.ts`);

    const verifyLowPowerActionDropdown = async () => {
          await agent.aiTap({
          prompt: '点击低电量时右侧按钮，按钮位置见"低电量时右侧按钮"图片红框框选的下拉箭头',
          images: [
              { name: '低电量时右侧按钮', url: 'https://youqu.uniontech.com/_picture/professional-desktop/lihe/control-center/lowBattery.png' }
            ],
          convertHttpImage2Base64: true,
          deepThink: true,
          });
      await agent.aiAssert("下拉菜单展示自动休眠、自动待机");
    };

    if (defaultLowPowerAction !== '1') {
      await BusctlSetProperty("--user", powerService.busName, powerService.objectPath, powerService.interfaceName, powerService.lowPowerActionKey, "i 1", system);
    }
    if (defaultLowPowerAutoSleepThreshold !== '5') {
      await BusctlSetProperty("--user", powerService.busName, powerService.objectPath, powerService.interfaceName, powerService.lowPowerAutoSleepThresholdKey, "i 5", system);
    }

    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiTap("电源管理");
    await agent.aiTap("使用电池");
    await agent.aiWaitFor("'低电量管理'文字可见");

    await verifyLowPowerActionDropdown();

    await agent.aiTap("自动待机", { deepThink: true });
    await agent.aiAssert("低电量时展示自动待机，低电量阈值显示5%");

    await agent.aiTap("低电量阈值下拉菜单", { deepThink: true });
    await agent.aiAssert("下拉菜单展示1%、2%、3%、4%、5%、6%、7%、8%、9%");

    await agent.aiTap("8%", { deepThink: true });
    await agent.aiAssert("低电量阈值显示8%");

    await verifyLowPowerActionDropdown();

    await agent.aiTap("自动休眠", { deepThink: true });
    await agent.aiAssert("低电量时展示自动休眠，低电量阈值显示8%");
  }, { timeout: 600000, tags: ['1696225', 'level3', "laptop"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { BusctlSetProperty } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await BusctlSetProperty("--user", powerService.busName, powerService.objectPath, powerService.interfaceName, powerService.lowPowerActionKey, `i ${powerService.resetLowPowerActionKeyValue}`, system);
    await BusctlSetProperty("--user", powerService.busName, powerService.objectPath, powerService.interfaceName, powerService.lowPowerAutoSleepThresholdKey, `i ${powerService.resetLowPowerAutoSleepThresholdKeyValue}`, system);
    
    await device.pressKey("super", "down");
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});