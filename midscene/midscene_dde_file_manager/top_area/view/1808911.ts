/**
 * 用例 PMSID: 1808911
 * 用例标题: 【支持视图模式应用到所有目录】- 检查文管设置菜单，新增选项所有目录恢复默认视图
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808911-【支持视图模式应用到所有目录】- 检查文管设置菜单，新增选项所有目录恢复默认视图', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808911-【支持视图模式应用到所有目录】- 检查文管设置菜单，新增选项所有目录恢复默认视图', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");
    
    // 步骤2：打开文件管理器右上角设置按钮，进入设置页面
    await agent.aiTap("文件管理器右上角设置按钮");
    await agent.aiTap("设置选项");
    await system.exec("sleep 5");
    
    // 步骤6：新增选项"所有目录恢复默认视图"
    await agent.aiTap("视图选项");
    await agent.aiAssert("显示所有目录恢复默认视图");
    
    // 步骤8：关闭设置页面
    await agent.aiTap("设置页面右上角关闭按钮"); 
    
  }, { timeout: 1800000, tags: ["1808911", "level2", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
