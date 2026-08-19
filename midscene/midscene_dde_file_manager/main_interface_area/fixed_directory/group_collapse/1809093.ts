/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809093
 * 用例标题: 分组折叠-分区悬停鼠标
 * 生成时间: 2026-02-10 20:10:45
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809093-分组折叠-分区悬停鼠标', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
  });

  test('1809093-分组折叠-分区悬停鼠标', async ({ device, agent, uos, system }) => {

    // 步骤1: 从启动器打开文件管理器
    console.log('步骤1: 从启动器打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤2: hover至左侧边栏分区项，分区右边图标为^向上箭头
    console.log('步骤2: hover至左侧边栏分区项，验证分区右边图标为向上箭头');
    await agent.aiHover("左侧边栏分区项");
    await agent.aiWaitFor("左侧边栏内'分区'文字右边小箭头^", { timeout: 3000 });

    // 步骤3: hover至分区右侧向上箭头，点击左侧边分区项右侧向上箭头，左侧边栏计算机项被隐藏
    console.log('步骤3: 点击向上箭头，验证计算机项被隐藏');
    //await agent.aiHover("左侧边栏内'分区'文字右边小箭头^");
    await agent.aiTap("左侧边栏内'分区'文字右边小箭头^");
    await agent.aiAssert("窗口左侧边栏不显示'计算机'项", { timeout: 3000 });

    //还原分区折叠
    await agent.aiTap("左侧边栏内'分区'文字右侧小箭头v");
    await agent.aiWaitFor("窗口左侧边栏显示'计算机'项", { timeout: 3000 });

  }, { timeout: 600000, tags: ['1809093', 'level2', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
    console.log('文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
