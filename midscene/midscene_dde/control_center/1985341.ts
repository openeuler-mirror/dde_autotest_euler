/**
 * 用例 PMSID: 1985341
 * 用例标题: 【lastore-daemon】【增量更新】专业版增量更新默认开启
 * 生成时间: 2026-04-22
 * 用例编写人: UT001924（李鹤）
 */

describe('1985341-【lastore-daemon】【增量更新】专业版增量更新默认开启', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.lastore",
    source: "org.deepin.dde.lastore",
    key: "incremental-update",
    expectedValue: "true"
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1985341-【lastore-daemon】【增量更新】专业版增量更新默认开启', async ({ device, agent, uos, system }) => {
    // 使用命令行获取配置项值
    const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    const result = await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system);
    // 去除返回值中的引号进行比对
    const output = result.replace(/"/g, '');
    assertEqual(testConfig.expectedValue, output);
  }, { timeout: 600000, tags: ['1985341', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
