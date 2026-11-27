/**
 * 用例 PMSID: 1809095
 * 用例标题: 分组折叠-分区默认展示
 * 生成时间: 2026-08-19 09:46:58
 * 用例编写人: UT002411（胡戬）
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809095-分组折叠-分区默认展示', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
  });

  test('1809095-分组折叠-分区默认展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 最大化窗口打开文件管理器
    console.log('步骤1: 最大化窗口打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 断言: 侧边栏的分区模块，从上往下依次显示为计算机-保险箱-系统盘-数据盘，可能会有挂载分区和光盘
    console.log('断言: 侧边栏分区模块默认展示');
    await agent.aiAssert('文件管理器侧边栏的分区模块从上往下依次显示为计算机、保险箱、系统盘、数据盘，可能会有挂载分区和光盘', { deepThink: true });
    console.log('断言通过: 分区模块默认展示正确');

  }, { timeout: 600000, tags: ['1809095', 'level2', 'group_collapse', 'hujian'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await uos.showDesktop();
  });
});
