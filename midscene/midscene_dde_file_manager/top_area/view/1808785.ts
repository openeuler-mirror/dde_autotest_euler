/**
 * 用例 PMSID: 1808785
 * 用例标题: 树状结构-连续展开子目录
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808785-树状结构-连续展开子目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808785-树状结构-连续展开子目录', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");
    
    // 步骤2：文件管理器视图模式设置为列表视图
    await agent.aiTap("文件管理器右上角设置按钮");
    await agent.aiTap("设置选项");
    await agent.aiTap("视图选项");
    await agent.aiTap('默认视图下拉框');
    await agent.aiTap('树形视图');
    await agent.aiTap("恢复默认视图");
    await agent.aiTap("设置页面右上角关闭按钮"); 

    // 步骤4：创建多个层级的目录文件
    await system.exec(`mkdir -p ~/Documents/1808785_1/1808785_2/1808785_3 && touch ~/Documents/1808785_1/1808785_2/1808785_3/1808785.txt`);

    // 步骤5：进入测试文件目录，展开测试目录
    await agent.aiTap("导航栏左侧文档目录");
    await agent.aiHover('1808785_1');
    await agent.aiTap('1808785_1前面展开的按钮');
    await agent.aiAssert('1808785_2文件夹可见');
    await agent.aiTap('1808785_2前面展开的按钮');
    await agent.aiAssert('1808785_3文件夹可见');
    await agent.aiTap('1808785_3前面展开的按钮');
    await agent.aiAssert('1808785.txt文件可见');
    
  }, { timeout: 1800000, tags: ["1808785", "level2", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关键清理操作
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1808785*`);
  
    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
