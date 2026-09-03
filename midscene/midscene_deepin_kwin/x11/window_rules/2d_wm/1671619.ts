/**

 * 用例 PMSID: 1671619
 * 用例标题: 退出窗口菜单—鼠标点击窗口级菜单以外任意位置
 * 生成时间: 2025-12-10 17:30:36
 * 用例编写人: UT006165（李日华）
 */

describe('1671619-退出窗口菜单—鼠标点击窗口级菜单以外任意位置', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671619-退出窗口菜单—鼠标点击窗口级菜单以外任意位置', async ({ device, agent, uos }) => {
    // 前置条件: 打开文件管理器窗口
    await device.pressKey("Super", "E");
    await agent.aiAssert("文件管理器窗口显示在桌面");
    // 文管窗口化显示
    await device.pressKey("Super", "Down");

    // 步骤1: 键入"alt+空格"组合键
    await device.pressKey("Alt", "Space");
    
    // 预期结果1: 调出窗口右键菜单
    await agent.aiAssert("窗口右键菜单已显示");

    // 步骤2: 鼠标点击窗口右键菜单以外任意位置
    await agent.aiTap("窗口空白处");

    // 预期结果2: 窗口右键菜单被关闭
    await agent.aiAssert("窗口右键菜单已关闭");

  }, { timeout: 600000, tags: ["1671619", "level1",'x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey("Super", "Down");
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});