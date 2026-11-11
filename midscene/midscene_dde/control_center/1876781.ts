/**
 * 用例 PMSID: 1876781
 * 用例标题: 【控制中心】【电源管理】【通用】【笔记本】配置项设置使用电池时自动开启节能模式
 * 生成时间: 2026-09-28
 * 用例编写人: UT001924（李鹤）
 */

describe('1876781-【控制中心】【电源管理】【通用】【笔记本】配置项设置使用电池时自动开启节能模式', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: 'org.deepin.dde.daemon',
    source: 'org.deepin.dde.daemon.power',
    key: 'powerSavingModeAuto',
    testValueTrue: true,
    testValueFalse: false
  };

  let defaultValue;

  // dde-dconfig --get 字符串型值返回带双引号（如 "false"），布尔型不带，统一去引号
  const unquote = (v) => v.replace(/^"(.*)"$/, '$1');

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    defaultValue = unquote(await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system));
    console.log(`使用电池时自动开启节能模式默认值为: ${defaultValue}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876781-【控制中心】【电源管理】【通用】【笔记本】配置项设置使用电池时自动开启节能模式', async ({ device, agent, uos, system }) => {
    const { setDconfigValue, getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);

    const openPowerManagementGeneral = async () => {
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap('电源管理');
      await agent.aiTap('通用');
      await agent.aiWaitFor("'节能设置'文字可见");
    };

    // 步骤1: 点击控制中心-电源管理-通用，关闭节能设置中使用电池时自动开启节能模式
    await openPowerManagementGeneral();
    const switchOn = await agent.aiBoolean('使用电池时自动开启节能模式开关是打开状态');
    if (switchOn) {
      await agent.aiTap('使用电池时自动开启节能模式右边的开关(开关可能是灰色也可能是蓝色)', { deepThink: true });
    }
    await agent.aiAssert('使用电池时自动开启节能模式开关为灰色关闭状态');

    // 关闭控制中心
    await device.pressKey('alt', 'F4');

    // 步骤2: 终端执行 dde-dconfig --set 命令将 power saving mode auto[powerSavingModeAuto] 开关状态设置为开启（替代 dde-dconfig-editor 工具）
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValueTrue, system);

    // 预期: 设置成功
    const onValue = unquote(await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system));
    if (onValue !== String(testConfig.testValueTrue)) {
      throw new Error(`powerSavingModeAuto 设置失败，期望 ${testConfig.testValueTrue}，实际 ${onValue}`);
    }
    console.log(`powerSavingModeAuto 已设置为: ${onValue}`);

    // 步骤3: 点击控制中心-电源管理-通用，查看使用电池时自动开启节能模式的开关状态
    await openPowerManagementGeneral();

    // 预期: 使用电池时自动开启节能模式开关为开启状态
    await agent.aiAssert('使用电池时自动开启节能模式开关为蓝色开启状态');
    console.log('开关为开启状态，验证通过');

    // 关闭控制中心
    await device.pressKey('alt', 'F4');

    // 步骤4: 终端执行 dde-dconfig --set 命令将 power saving mode auto[powerSavingModeAuto] 开关状态设置为关闭（替代 dde-dconfig-editor 工具）
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValueFalse, system);

    // 预期: 设置成功
    const offValue = unquote(await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system));
    if (offValue !== String(testConfig.testValueFalse)) {
      throw new Error(`powerSavingModeAuto 设置失败，期望 ${testConfig.testValueFalse}，实际 ${offValue}`);
    }
    console.log(`powerSavingModeAuto 已设置为: ${offValue}`);

    // 步骤5: 点击控制中心-电源管理-通用，查看使用电池时自动开启节能模式的开关状态
    await openPowerManagementGeneral();

    // 预期: 使用电池时自动开启节能模式开关为关闭状态
    await agent.aiAssert('使用电池时自动开启节能模式开关为灰色关闭状态');
    console.log('开关为关闭状态，验证通过');

    // 关闭控制中心
    await device.pressKey('alt', 'F4');
  }, { timeout: 600000, tags: ['1876781', 'level3', 'laptop'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复使用电池时自动开启节能模式默认值
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, defaultValue, system);
    await uos.showDesktop();
  });
});
