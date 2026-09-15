/**

 * 用例 PMSID: 1671681
 * 用例标题：窗口级菜单—最大化
 * 生成时间: 2025-01-07 11:07:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671681-窗口级菜单—最大化', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671681-窗口级菜单—最大化', async ({ device, agent, uos }) => {
    // 前置条件：打开文件管理器应用
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    
    // 步骤：键入"alt+space"组合键调出窗口右键菜单后，鼠标点击"最大化"选项
    await device.pressKey("Super", "Down");
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiTap('窗口菜单中的"最大化"选项', { deepThink: true });
    
    // 预期结果：文件管理器窗口最大化显示
    await agent.aiAssert('文件管理器窗口最大化显示，文件管理器页面几乎铺满整个屏幕');
  }, { timeout: 600000, tags: ['1671681', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保文件管理器窗口关闭
    await device.pressKey("Super", "Down");
        // 切换回到第一个工作区
    await device.pressKey("Ctrl", "Alt", "1");
    // 确保文件管理器窗口关闭
    await uos.showDesktop();
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});