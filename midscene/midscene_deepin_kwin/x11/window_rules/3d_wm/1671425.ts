/**

 * 用例 PMSID: 1671425
 * 用例标题: 窗口级菜单—移至左/右边工作区
 * 生成时间: 2026-01-14 16:44:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671425-窗口级菜单—移至左/右边工作区', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671425-窗口级菜单—移至左/右边工作区', async ({ device, agent, uos }) => {
    // 步骤1：使用快捷键"Super+E"打开文件管理器应用
    await device.pressKey("Super", "E");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await agent.aiAssert("文件管理器窗口显示正常");

    // 使用"alt+space"调出窗口级菜单
    await device.pressKey("Alt", "Space");
    await agent.aiWaitFor('窗口右键菜单已显示');
    
    // 点击"移至右边的工作区"选项
    await agent.aiTap('窗口菜单中的"移至右边的工作区"选项', { deepThink: true });
    
    // 键入"Ctrl+Alt+→"组合键切换到右边工作区
    await device.pressKey("Ctrl", "Alt", "Right");
    
    // 预期结果1：文件管理器窗口显示在当前工作区桌面
    await agent.aiAssert("文件管理器窗口显示在当前工作区桌面");
    await agent.aiAssert("文件管理器窗口显示正常");

    // 步骤2：使用"alt+space"调出窗口级菜单
    await device.pressKey("Alt", "Space");
    await agent.aiWaitFor('窗口右键菜单已显示');
    
    // 点击"移至左边的工作区"选项
    await agent.aiTap('窗口菜单中的"移至左边的工作区"选项', { deepThink: true });
    
    // 键入"Ctrl+Alt+←"组合键切换到左边工作区
    await device.pressKey("Ctrl", "Alt", "Left");
    
    // 预期结果2：文件管理器窗口显示在当前工作区桌面
    await agent.aiAssert("文件管理器窗口显示在当前工作区桌面");
    await agent.aiAssert("文件管理器窗口显示正常");
  }, { timeout: 600000, tags: ['1671425', 'level3','x11','window_rules','3d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保文件管理器窗口关闭
    await uos.showDesktop();
    await device.pressKey("Ctrl", "Alt", "1");
    await system.exec('killall dde-file-manager');
  });
});