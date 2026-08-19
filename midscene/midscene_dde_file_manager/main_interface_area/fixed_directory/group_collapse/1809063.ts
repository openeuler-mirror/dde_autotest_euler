
/**
 * 用例 PMSID: 1809063
 * 用例标题: 分组折叠-标签折叠
 * 生成时间: 2026-01-27 19:43:57
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809063-分组折叠-标签折叠', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);

  });

  beforeEach(async ({ device, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
  });

  test('1809063-分组折叠-标签折叠', async ({ device, agent, uos }) => {
    // 步骤1: 启动器打开文件管理器
    console.log('步骤1: 启动器打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤2: hover至快捷访问行，断言箭头向上显示，默认为展开状态
    console.log('步骤2: hover至快捷访问行，断言箭头向上显示，默认为展开状态');
    await agent.aiHover("左侧边'栏快捷访问'行", { timeout: 3000 });
    await agent.aiWaitFor("左侧边栏内'快捷访问'文字右边显示小箭头^", { timeout: 5000 });

    // 步骤3: 点击向上按钮，断言窗口左侧边栏的'桌面''视频'菜单已被隐藏
    console.log('步骤3: 点击向上按钮，断言窗口左侧边栏的菜单已被隐藏');
    await agent.aiTap("左侧边栏内'快捷访问'文字右边小箭头^", { timeout: 3000 });
    await agent.aiWaitFor("左侧边栏内'快捷访问'文字右边显示小箭头v", { timeout: 5000 });
    await agent.aiAssert("窗口左侧边栏不显示的'桌面''视频'菜单");

    // 步骤4: 关闭文件管理器窗口
    console.log('步骤4: 关闭文件管理器窗口');
    await agent.aiTap("文件管理器窗口右上角关闭(X)按钮", { timeout: 3000 });
    await agent.aiWaitFor("文件管理器窗口已关闭", { timeout: 5000 });

    // 步骤5: 再次从启动器打开文件管理器，验证状态保持
    console.log('步骤5: 再次打开文件管理器，验证折叠状态保持');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    await agent.aiHover("左侧边栏'快捷访问'行", { timeout: 3000 });
    await agent.aiWaitFor("左侧边栏内'快捷访问'文字右边显示小箭头v", { timeout: 5000 });

    // 步骤6: 点击向下按钮，展开快捷访问
    await agent.aiTap("左侧边栏内'快捷访问'文字右边小箭头v(一个圆形图标)", { timeout: 3000 });
    await agent.aiAssert("窗口左侧边栏显示'桌面''视频'菜单");
  }, { timeout: 1200000, tags: ['1809063', 'level2', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('6. afterEach: 每个测试后的清理');
    console.log('[步骤6] 关闭窗口');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('7. afterAll: 清理测试套件');
    // 关闭文件管理器
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
