/**
 * 用例 PMSID: 1815893
 * 用例标题:  长文件名功能(关闭) - 复制，剪切，拖拽到/tmp目录
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/3
 */

describe('1815893-长文件名功能(关闭) - 复制，剪切，拖拽到/tmp目录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的系统盘");
    await agent.aiRightClick("tmp");
    await agent.aiTap('添加到快捷访问');
    await uos.closeCurrentWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815893-长文件名功能(关闭) - 复制，剪切，拖拽到/tmp目录', async ({ device, agent, uos, system }) => {
    console.log('验证库目录，选择原长文件名称文件，复制到/tmp目录');
    const test_dir = "test1815893";
    const user = process.env.TEST_USERNAME;
    await system.exec(`mkdir "/home/${user}/Pictures/${test_dir}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiRightClick(test_dir);
    await agent.aiTap('复制(C)');
    await agent.aiTap("文件管理器侧边栏的tmp");
    await agent.aiRightClick('空白处');
    await agent.aiTap('粘贴(P)');
    await agent.aiAssert(test_dir);
    await system.exec(`rm -rf "/tmp/${test_dir}"`);

    console.log('验证库目录，选择原长文件名称文件，剪切到/tmp目录');
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiRightClick(test_dir);
    await agent.aiTap('剪切(T)');
    await agent.aiTap("文件管理器侧边栏的tmp");
    await agent.aiRightClick('空白处');
    await agent.aiTap('粘贴(P)');
    await agent.aiAssert(test_dir);
    await system.exec(`rm -rf "/tmp/${test_dir}"`);

    console.log('验证库目录，选择原长文件名称文件，拖拽到/tmp目录');
    await system.exec(`mkdir "/home/${user}/Pictures/${test_dir}"`);
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiDrag(test_dir, "tmp");
    await agent.aiTap("文件管理器侧边栏的tmp");
    await agent.aiAssert(test_dir, { deepThink: true });
    await uos.closeCurrentWindow();
  }, { timeout: 1200000, tags: ["1815893", 'level3', 'other', 'DITT', 'xuqi'] });

  afterEach(async ({ device, system, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const test_dir = "test1815893";
    const user = process.env.TEST_USERNAME;
    await system.exec(`rm -rf "/tmp/${test_dir}"`);
    await system.exec(`mkdir "/home/${user}/Pictures/${test_dir}"`);
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.closeCurrentWindow();
  });
});