/**

 * 用例 PMSID: 1671577
 * 用例标题: 【bug169611转】【X11】右键窗口标题栏调出窗口级菜单
 * 生成时间: 2026-01-14 15:48:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671577-【bug169611转】【X11】右键窗口标题栏调出窗口级菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671577-【bug169611转】【X11】右键窗口标题栏调出窗口级菜单', async ({ device, agent, uos }) => {
    // 步骤1：使用快捷键"Super+E"打开文件管理器应用
    await device.pressKey("Super", "E");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await agent.aiAssert("文件管理器窗口显示正常");

    // 鼠标hover到窗口标题栏，点击鼠标右键
    await agent.aiRightClick("文件管理器窗口标题栏右侧空白部分", { deepThink: true });
    
    // 预期结果1：显示窗口右键菜单
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiAssert("窗口右键菜单显示正常");

    // 步骤2：使用快捷键"Super+Down"和"Super+Up"
    await device.pressKey("Super", "Down");
    // 预期结果2：窗口右键菜单选项可以正常上下切换选择，选中项高亮显示
    await agent.aiAssert("窗口右键菜单最小化选项高亮显示");
    await device.pressKey("Super", "Down");
    await agent.aiAssert("窗口右键菜单的最大化选项高亮显示");
    
    await device.pressKey("Super", "Up");
    await agent.aiAssert("窗口右键菜单最小化选项高亮显示");
    await device.pressKey("Super", "Up");
    await agent.aiAssert("窗口右键菜单关闭选项高亮显示");
  }, { timeout: 600000, tags: ['1671577', 'level2','x11','window_rules','3d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保文件管理器窗口关闭
    await agent.aiTap("窗口空白处");
    await uos.showDesktop();
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
  });
});