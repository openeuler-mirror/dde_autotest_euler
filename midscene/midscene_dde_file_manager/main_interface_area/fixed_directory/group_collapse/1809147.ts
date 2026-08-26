
/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809147
 * 用例标题: 分组折叠-快捷访问默认为展开
 * 生成时间: 2026-02-03 15:42:34
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809147-分组折叠-快捷访问默认为展开', () => {
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

  test('1809147-分组折叠-快捷访问默认为展开', async ({ device, agent, uos }) => {
    // 步骤1: 启动器打开文件管理器
    console.log('步骤1: 启动器打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤2: hover至快捷访问行，断言箭头向上显示（非折叠状态）
    console.log('步骤2: hover至快捷访问行，断言箭头向上显示（非折叠状态）');
    await agent.aiHover("快捷访问", { timeout: 3000 });
    await agent.aiWaitFor("左侧边栏'快捷访问'文字右边显示小箭头^", { timeout: 5000, deepThink: true });
    await agent.aiAssert("窗口左侧边栏有显示'桌面''视频'菜单");

  }, { timeout: 1200000, tags: ['1809147', 'level3', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('3. afterEach: 每个测试后的清理');
    console.log('[步骤3] 关闭窗口');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
