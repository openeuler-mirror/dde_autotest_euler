/**
 * 用例 PMSID: 1808749
 * 用例标题: 树状结构-设置中增加树状结构选项
 * 生成时间: 2026-01-04 21:07:47
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808749-树状结构-设置中增加树状结构选项', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808749-树状结构-设置中增加树状结构选项', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");

    // 步骤2：点击右上角设置按钮，选择设置
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置选项");
    
    // 步骤4：检查视图选项中有树形视图
    await agent.aiTap("视图选项");
    await agent.aiTap('默认视图右侧的图标视图');
    await system.exec("sleep 3");
    await agent.aiTap('树形视图');
    await agent.aiTap("设置页面右上角关闭按钮");
    
  }, { timeout: 1800000, tags: ["1808749", "level3", "view", "liqingling"] });
  
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
