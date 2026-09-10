/**

 * 用例 PMSID: 1671675
 * 用例标题：窗口级菜单—移至右边工作区—在最后一个工作区移至右边工作区置灰
 * 生成时间: 2026-01-13 13:45:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671675-窗口级菜单—移至右边工作区—在最后一个工作区移至右边工作区置灰', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671675-窗口级菜单—移至右边工作区—在最后一个工作区移至右边工作区置灰', async ({ device, agent, uos }) => {
    // 前置条件：当前工作区数量等于2，当前在第2个工作区（最后一个工作区）
    // 键入"Ctrl+Alt+→"组合键切换到第2个工作区（最后一个工作区）
    // 前置条件：super+s进入多任务视图，执行五次快捷键 alt+-，再新增一次，是工作区为2
    await device.pressKey('Super', 'S');

    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    await device.pressKey('Alt', 'equal');
    await device.pressKey('Esc');

    await uos.setWindowEffect("最佳性能")
    await device.pressKey("Ctrl", "Alt", "1");
    await device.pressKey("Ctrl", "Alt", "Right");

    // 打开文件管理器应用
    await uos.openApp("文件管理器");
    await agent.aiAssert("桌面显示文件管理器窗口");

    // 键入"alt+space"组合键，鼠标点击"移至右边的工作区"选项
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    
    // 预期结果："移至右边的工作区"选项置灰无法点击。ai无法识别颜色，通过判断点击的方式
    await agent.aiTap('窗口菜单中第八项的"移至右边的工作区"')
    await device.pressKey('Esc');
    await agent.aiAssert('桌面显示文件管理窗口');
  

  }, { timeout: 600000, tags: ['1671675', 'level3', 'x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 切换回到第一个工作区
    await device.pressKey("Ctrl", "Alt", "1");
    // 确保文件管理器窗口关闭
    await uos.showDesktop();
    await system.exec('killall dde-file-manager');
    await uos.setWindowEffect("最佳视觉")
  });
});