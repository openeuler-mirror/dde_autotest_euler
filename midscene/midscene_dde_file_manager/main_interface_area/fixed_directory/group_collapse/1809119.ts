
/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809119
 * 用例标题: 分组折叠--重复添加文件夹到快捷访问
 * 生成时间: 2026-02-03 19:46:35
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809119-分组折叠--重复添加文件夹到快捷访问', () => {
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
    // 清理视频目录
    await system.exec(`rm -rf ~/Videos/*`, 5000);
  });

  test('1809119-分组折叠--重复添加文件夹到快捷访问', async ({ device, agent, uos, system }) => {

    // 步骤1: 在视频目录创建1个文件夹folder1
    console.log('步骤1: 在视频目录创建1个文件夹folder1');
    await system.exec(`mkdir -p ~/Videos/folder1`);

    // 步骤2: 启动器打开文件管理器，点击文件管理器左侧边栏的'视频'菜单
    console.log('步骤2: 启动器打开文件管理器，点击文件管理器左侧边栏的视频菜单');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示视频窗口", { timeout: 5000 });

    // 步骤3: hover folder1文件，右键点击folder1文件，弹出右键菜单，点击'添加到快捷访问'
    console.log('步骤3: hover folder1文件，右键点击folder1文件，弹出右键菜单，点击添加到快捷访问');
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");
    await agent.aiTap("右键菜单'添加到快捷访问'选项");

    // 步骤4: 断言文件管理器左侧边栏显示folder1菜单
    console.log('步骤4: 断言文件管理器左侧边栏显示folder1菜单');
    await agent.aiAssert("文件管理器左侧边栏快捷访问下显示'folder1'选项");

    // 步骤5: 点击文件管理器窗口空白区域，hover folder1文件，右键点击folder1文件，弹出右键菜单
    console.log('步骤5: 点击文件管理器窗口空白区域，hover folder1文件，右键点击folder1文件，弹出右键菜单');
    await agent.aiTap("视频窗口空白区域");
    await agent.aiHover("folder1文件夹");
    await agent.aiRightClick("folder1文件夹");

    // 步骤6: 断言右键菜单显示'从快捷访问移除'，点击'从快捷访问移除'，断言左侧边栏不显示'folder1'选项
    console.log('步骤6: 断言右键菜单显示从快捷访问移除，点击从快捷访问移除，断言左侧边栏不显示folder1选项');
    await agent.aiAssert("右键菜单中显示'从快捷访问移除'选项");
    await agent.aiTap("右键菜单中的'从快捷访问移除'选项");
    await agent.aiAssert("文件管理器左侧边栏快捷访问下不显示'folder1'选项");

    // 步骤7: 点击文件管理窗口空白区域，拖拽folder1文件夹到窗口左侧边栏快捷访问菜单上
    console.log('步骤7: 点击文件管理窗口空白区域，拖拽folder1文件夹到窗口左侧边栏快捷访问菜单上');
    await agent.aiTap("视频窗口空白区域");
    await agent.aiHover("folder1文件夹");
    await agent.aiDrag("folder1文件夹", "窗口左侧边栏的快捷访问菜单上");

    // 步骤8: 断言窗口左侧边栏快捷访问下没有folder1选项
    console.log('步骤8: 断言窗口左侧边栏快捷访问下没有folder1选项');
    await agent.aiAssert("窗口左侧边栏快捷访问下没有'folder1'选项");

  }, { timeout: 600000, tags: ['1809119', 'level3', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 清理视频目录
    await system.exec(`rm -rf ~/Videos/folder1`, 5000);
    await uos.closeCurrentWindow();
    console.log('文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
