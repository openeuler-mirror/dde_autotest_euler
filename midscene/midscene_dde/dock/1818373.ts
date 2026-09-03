
/**
 * 用例 PMSID: 1818373
 * 用例标题: 【任务栏】【插件区域】声音&快捷设置面板组合键，鼠标左键效果检查
 * 生成时间: 2026-05-07 11:00:00
 * 用例编写人:UT001707(陈慧）
  */
 
describe('1818373-【任务栏】【插件区域】声音&快捷设置面板组合键，鼠标左键效果检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1818373-【任务栏】【插件区域】声音&快捷设置面板组合键，鼠标左键效果检查', async ({ device, agent, uos }) => {
    // 步骤1：鼠标左键点击任务栏上的声音插件图标
    await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
    await agent.aiWaitFor("快捷设置面板已显示");  // 添加等待
    
    // 预期：显示统快捷设置面板
    await agent.aiAssert("显示UOS系统的快捷设置面板");
    
    //  关闭面板
    await agent.aiTap("桌面空白区域");
    
    // 步骤2：鼠标左键点击任务栏上的快捷设置面板图标
    await agent.aiTap("桌面右下角声音图标右侧的快捷设置按钮, { deepThink: true }");
    
    // 预期：显示系统快捷设置面板
    await agent.aiAssert("显示UOS系统的快捷设置面板");
    
    // 关闭面板
    await agent.aiTap("桌面空白区域");
    
    // 步骤3：鼠标左键点击任务栏上的声音插件图标&快捷设置面板图标任意位置
    await agent.aiTap("任务栏上的声音插件图标, { deepThink: true }");
    
    // 预期：显示系统快捷设置面板
    // await agent.aiAssert("显示UOS系统的快捷设置面板");

  }, { timeout: 1200000, tags: ['1818373', 'level2'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device }) => {
    await uos.closeCurrentWindow();
    console.log('5. afterAll: 清理测试套件');
  });
});