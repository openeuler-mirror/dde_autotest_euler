
/**
 * 用例 PMSID: 1829881
 * 用例标题: 【控制中心】【个性化】【外观】外观设置为“浅色”生效正常
 * 生成时间: 2026-04-03 11:17:44
 * 用例编写人:UT001707(陈慧）
 */

describe('1829881-【控制中心】【个性化】【外观】外观设置为“浅色”生效正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1829881-【控制中心】【个性化】【外观】外观设置为“浅色”生效正常', async ({ device, agent, uos }) => {
     //步骤1：进入控制中心-个性化中
    await uos.openApp("控制中心",{maximizeWindow: false});
    await agent.aiTap("左侧：个性化")
    //检查1：显示主题、外观
    await agent.aiAssert("个性化下有：主题、外观、桌面和任务栏、窗口效果、壁纸、屏幕保护")
    //步骤2：设置外观为深色
    await agent.aiTap("浅色")
    await agent.aiTap("深色")
    //检查2：默认主题：nirvana，其示例图片边框为选中，外观为深色
    await agent.aiAssert("外观为深色")
    //步骤3：打开文件管理器
    await device.pressKey("Super","E")
    //检查3：文件管理器显示黑色
    await agent.aiAssert("文件管理器界面窗口颜色显示黑色")
    await device.pressKey("Alt","F4")
    //步骤4：切回浅色模式
    await agent.aiTap("深色") 
    await agent.aiTap("浅色")
    //检查4：外观为浅色
    await agent.aiAssert("浅色")
    //步骤5：打开文件管理器
    await device.pressKey("Super","E")
    //检查5：文件管理器显示白色
    await agent.aiAssert("界面窗口颜色显示白色")
    // 步骤6：打开终端，设置主题跟随系统
    await device.pressKey("Ctrl","Alt","T")
    await agent.aiTap("汉堡菜单")
    await agent.aiTap("主题")
    await agent.aiTap("跟随系统")
    //检查6：终端显示白色
    await agent.aiAssert("界面窗口颜色显示白色")
    
  }, { timeout: 600000, tags: ['1829881', 'level2'] });

  afterEach(async ({ device, env, agent, uos }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 关闭终端、文件管理器窗口
    await agent.aiTap("汉堡菜单")
    await agent.aiTap("主题")
    await agent.aiTap("深色")
    await device.pressKey("Alt","F4")
    await device.pressKey("Alt","F4")
    // 关闭控制中心窗口
    
    await uos.closeCurrentWindow();
  });



  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
