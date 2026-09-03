/**

 * 用例 PMSID: 1671589
 * 用例标题:  键入“Alt+tab”切换到最右侧桌面窗口
 * 生成时间: 2026-05-14 17:47:53
 * 用例编写人: UT006165（李日华）
 */

describe('1671589- 键入“Alt+tab”切换到最右侧桌面窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671589- 键入“Alt+tab”切换到最右侧桌面窗口', async ({ device, agent, uos }) => {
    // 前置操作：打开三个浏览器，两个终端，三个文管应用
    await uos.openApp('浏览器');
    await uos.openApp('浏览器');
    await uos.openApp('浏览器');
  
    await device.pressKey('Ctrl', 'Alt', 'T');
    await device.pressKey('Ctrl', 'Alt', 'T');

    await device.pressKey('Super', 'E');
    await device.pressKey('Super', 'E');
    await device.pressKey('Super', 'E');

    // 步骤1：键入"Alt+tab"组合键，松开tab键，保持窗口切换器页面
    console.log('步骤1:按下 Alt+Tab,松开 Tab 键，保持 Alt 键按下');
    await device.keyDown('Alt');
    await device.keyDown('Shift');
    await device.pressKey('Tab');
    await agent.aiAssert('桌面窗口被选中，窗口切换器页面保持显示');

    // 步骤3：最后松开组合键，所有窗口最小化到任务栏，只显示桌面
    await device.keyUp('Alt');
    await device.keyUp('Shift');
    await agent.aiAssert('所有窗口最小化到任务栏，只显示桌面');
  }, { timeout: 600000, tags: ['1671589', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("任务栏终端图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await agent.aiRightClick("任务栏文件管理图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await agent.aiRightClick("任务栏浏览器图标");
    await agent.aiTap("右键菜单中的'强制退出'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});
