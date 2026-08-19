/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809091
 * 用例标题: 分组折叠-分区折叠
 * 生成时间: 2026-02-06 15:14:57
 * 用例编写人: UT002899(胡诗敏)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809091-分组折叠-分区折叠', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
  });

  beforeEach(async ({ device, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
  });

  test('1809091-分组折叠-分区折叠', async ({ device, agent, uos }) => {
    //步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor("文件管理器窗口已显示");

    //步骤 2: 点击分区折叠按钮
    console.log('步骤 2: 点击分区折叠按钮');
    await agent.aiHover('左侧栏分区');
    await agent.aiTap('左侧栏分区右边的小箭头^');
    await agent.aiAssert('分区右边的箭头显示为v');

    //步骤 3: 关闭文件管理器，再次打开，分区显示为折叠状态
    console.log('步骤 3: 关闭文件管理器，再次打开，分区显示为折叠状态');
    await agent.aiTap('文件管理器右上角关闭按钮');
    await uos.openApp('文件管理器');
    await agent.aiHover('左侧栏分区');
    await agent.aiAssert("分区右边的箭头显示为v");

    // 环境还原：再次点击分区折叠按钮，展开分区
    await agent.aiTap('左侧栏分区右边的小箭头v');
    await agent.aiHover('左侧栏分区')
    await agent.aiAssert('分区右边的箭头显示为^');

  }, { timeout: 1200000, tags: ['1809091', 'level2', 'group_collapse', 'DITT', 'hushimin'] });

  afterEach(async ({ device, uos }) => {
    console.log('6. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
    console.log('文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('7. afterAll: 清理测试套件');
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
