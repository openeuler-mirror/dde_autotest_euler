/**
 * 用例 PMSID: 1876785
 * 用例标题: 【控制中心】【电源管理】【通用】配置项设置性能模式的值
 * 生成时间: 2026-09-28
 * 用例编写人: UT001924（李鹤）
 */

describe('1876785-【控制中心】【电源管理】【通用】配置项设置性能模式的值', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: 'org.deepin.dde.daemon',
    source: 'org.deepin.dde.daemon.power',
    key: 'mode',
    testValues: [
      { value: 'performance', desc: '高性能模式' },
      { value: 'powersave', desc: '节能模式' },
      { value: 'balance', desc: '平衡模式' }
    ]
  };

  let defaultValue;

  // dde-dconfig --get 字符串型值返回带双引号（如 "balance"），布尔型不带，统一去引号
  const unquote = (v) => v.replace(/^"(.*)"$/, '$1');

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    defaultValue = unquote(await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system));
    console.log(`性能模式默认值为: ${defaultValue}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876785-【控制中心】【电源管理】【通用】配置项设置性能模式的值', async ({ device, agent, uos, system }) => {
    const { setDconfigValue, getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);

    const openPowerManagementGeneral = async () => {
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap('电源管理');
      await agent.aiTap('通用');
      await agent.aiWaitFor("'节能设置'文字可见");
    };

    // 步骤1: 点击控制中心-电源管理-通用，查看性能模式
    await openPowerManagementGeneral();

    // 预期1: 性能模式选项为高性能模式、平衡模式、节能模式
    await agent.aiAssert('性能模式中存在选项：高性能模式');
    await agent.aiAssert('性能模式中存在选项：平衡模式');
    await agent.aiAssert('性能模式中存在选项：节能模式');

    // 关闭控制中心
    await device.pressKey('alt', 'F4');

    for (const item of testConfig.testValues) {
      // 步骤2/4/6: 终端执行 dde-dconfig --set 命令设置 power mode[mode] 的值（替代 dde-dconfig-editor 工具）
      await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, item.value, system);

      // 预期: 设置成功
      const currentValue = unquote(await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system));
      if (currentValue !== item.value) {
        throw new Error(`mode 设置失败，期望 ${item.value}，实际 ${currentValue}`);
      }
      console.log(`mode 已设置为: ${currentValue}`);

      // 步骤3/5/7: 点击控制中心-电源管理-通用，查看性能模式
      await openPowerManagementGeneral();

      // 预期: 对应模式被勾选
      await agent.aiAssert(`性能模式中${item.desc}被勾选`);
      console.log(`性能模式中${item.desc}被勾选，验证通过`);

      // 关闭控制中心
      await device.pressKey('alt', 'F4');
    }
  }, { timeout: 600000, tags: ['1876785', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复性能模式默认值
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, defaultValue, system);
    await uos.showDesktop();
  });
});
