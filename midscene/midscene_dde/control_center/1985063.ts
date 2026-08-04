/**
 * 用例 PMSID: 1985063
 * 用例标题: 【非功能性需求】【dde-dconfig】【控制中心】【电源管理】【使用电池】笔记本合盖时默认值配置检查
 * 生成时间: 2026-04-28
 * 用例编写人: UT001924（李鹤）
 */

describe('1985063-【非功能性需求】【dde-dconfig】【控制中心】【电源管理】【使用电池】笔记本合盖时默认值配置检查', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.daemon",
    source: "org.deepin.dde.daemon.power",
    key: "batteryLidClosedAction",
    expectedValue: "1"
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1985063-【非功能性需求】【dde-dconfig】【控制中心】【电源管理】【使用电池】笔记本合盖时默认值配置检查', async ({ system }) => {
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    const result = await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system);
    const output = result.replace(/"/g, '');
    assertEqual(testConfig.expectedValue, output);
  }, { timeout: 600000, tags: ['1985063', 'level3', 'laptop'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});