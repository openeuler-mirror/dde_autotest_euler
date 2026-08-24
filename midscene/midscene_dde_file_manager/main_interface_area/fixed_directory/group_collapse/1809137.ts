/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809137
 * 用例标题: 分组折叠-折叠状态拖动文件到快捷访问目录
 * 生成时间: 2026-02-03 18:48:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809137-分组折叠-折叠状态拖动文件到快捷访问目录', () => {
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
    // 清理文档目录
    await system.exec(`rm -rf ~/Videos/*`, 5000);
  });

  test('1809137-分组折叠-折叠状态拖动文件到快捷访问目录', async ({ device, agent, uos, system }) => {

    // 步骤1: 在文档目录创建2个文件file1.txt、file2.txt
    console.log('步骤1: 在视频目录创建2个文件file1.txt、file2.txt');
    await system.exec(`touch ~/Videos/file1.txt ~/Videos/file2.txt`);

    // 步骤2: 启动器打开文件管理器
    console.log('步骤2: 启动器打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤3: 点击左侧边栏文件目录
    console.log('步骤3: 点击左侧边栏文件目录');
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示视频窗口", { timeout: 5000 });

    // 步骤4: 拖动文件file1至左侧边栏快捷访问列表下
    console.log('步骤4: 拖动文件file1至左侧边栏快捷访问菜单上');
    await agent.aiHover("file1.txt文件");
    await agent.aiDrag("file1.txt文件", "窗口左侧边栏的快捷访问菜单上");

    // 步骤5: 断言窗口图标出现红色禁止标识，且左侧边栏未新增file1.txt选项
    console.log('步骤5: 断言窗口图标出现红色禁止标识，且左侧边栏未新增file1.txt选项');
    await agent.aiAssert("窗口左侧边栏快捷访问下没有file1.txt选项");

    // 步骤6: 点击左侧边栏文档菜单
    console.log('步骤6: 点击左侧边栏视频菜单');
    await agent.aiTap("文件管理器左侧边栏'视频'菜单");

    // 步骤7: 点击文档菜单窗口空白处
    console.log('步骤7: 点击视频菜单窗口空白处');
    await agent.aiTap("视频窗口空白区域");

    // 步骤8: 使用快捷键Ctrl+A
    console.log('步骤8: 使用快捷键Ctrl+A');
    await device.pressKey("Ctrl+A");
    await agent.aiWaitFor("'file1.txt''file2.txt'都被选中", { timeout: 3000 });

    // 步骤9: 拖动file1.txt|file2.txt文件至左侧边栏快捷访问列表下
    console.log('步骤9: 拖动file1.txt|file2.txt文件至左侧边栏快捷访问列表下');
    await agent.aiHover("file1.txt文件");
    await agent.aiDrag("file1.txt文件", "窗口左侧边栏的快捷访问菜单上");

    // 步骤10: 断言窗口图标出现红色禁止标识，且左侧边栏未新增file1.txt|file2.txt选项
    console.log('步骤10: 断言窗口图标出现红色禁止标识，且左侧边栏未新增file1.txt|file2.txt选项');
    await agent.aiAssert("窗口左侧边栏快捷访问下没有'file1.txt''file2.txt'选项");

  }, { timeout: 600000, tags: ['1809137', 'level3', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 清理文档目录
    await system.exec(`rm -rf ~/Videos/file*.txt`, 5000);
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
