/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809121
 * 用例标题: 分组折叠-频繁快速拖拽文件夹到快捷访问
 * 生成时间: 2026-02-04 17:30:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809121-分组折叠-频繁快速拖拽文件夹到快捷访问', () => {
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

  test('1809121-分组折叠-频繁快速拖拽文件夹到快捷访问', async ({ device, agent, uos, system }) => {

    // 步骤1: 在视频目录创建folder1文件夹
    console.log('步骤1: 在视频目录创建folder1文件夹');
    await system.exec(`mkdir -p ~/Videos/folder1`);

    // 步骤2: 启动器打开文件管理器
    console.log('步骤2: 启动器打开文件管理器');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 步骤3: 点击文件管理器左侧边栏'视频'菜单
    console.log('步骤3: 点击文件管理器左侧边栏"视频"菜单');
    await agent.aiTap("文件管理器左侧边栏的'视频'菜单");
    await agent.aiWaitFor("显示视频窗口", { timeout: 5000 });

    // 步骤4-5: 循环10次拖拽folder1到快捷访问并断言
    console.log('步骤4-5: 循环15次拖拽folder1到快捷访问并断言');
    for (let i = 0; i < 15; i++) {
      console.log(`第 ${i + 1} 次循环:`);
      
      // hover至folder1文件夹
      console.log('  hover至folder1文件夹');
      await agent.aiHover("folder1文件夹");
      
      // 拖拽folder1文件夹至窗口左侧边栏的快捷访问菜单上
      console.log('  拖拽folder1文件夹至窗口左侧边栏的快捷访问菜单上');
      await agent.aiDrag("folder1文件夹", "窗口左侧边栏的快捷访问菜单上");
      
      // 断言窗口左侧边栏快捷访问下没有folder1文件选项
      console.log('  断言窗口左侧边栏快捷访问下没有folder1文件选项');
      await agent.aiAssert("窗口左侧边栏快捷访问下没有folder1选项");
      await agent.aiAssert("文件管理器窗口显示正常");
    }

  }, { timeout: 1200000, tags: ['1809121', 'level4', 'group_collapse', 'DITT', 'sushanshan'] });

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
