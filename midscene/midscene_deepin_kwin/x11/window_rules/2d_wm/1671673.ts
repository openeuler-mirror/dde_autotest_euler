/**

 * 用例 PMSID: 1671673
 * 用例标题：窗口级菜单—移至右边工作区—在非最后一个工作区移至右边工作区
 * 生成时间: 2026-01-13 13:33:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671673-窗口级菜单—移至右边工作区—在非最后一个工作区移至右边工作区', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671673-窗口级菜单—移至右边工作区—在非最后一个工作区移至右边工作区', async ({ device, agent, uos }) => {
    // 前置条件：当前工作区数量大于等于2
    // 打开文件管理器应用
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    
    // 键入"alt+space"组合键，选择"移至右边的工作区"选项
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiTap('窗口菜单中的"移至右边的工作区"选项', { deepThink: true });
    
    // 键入"Ctrl+Alt+→"组合键切换到右边工作区
    await device.pressKey("Ctrl", "Alt", "Right");
    
    // 预期结果：文件管理器窗口在当前工作区显示
    await agent.aiAssert("文件管理器窗口在当前工作区显示");
  }, { timeout: 600000, tags: ['1671673', 'level3','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 切换回到第一个工作区
    await device.pressKey("Ctrl", "Alt", "1");
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});