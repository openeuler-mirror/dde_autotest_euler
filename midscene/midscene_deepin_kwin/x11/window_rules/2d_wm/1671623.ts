/**

 * 用例 PMSID: 1671623
 * 用例标题: 窗口级菜单—最大化-还原
 * 生成时间: 2025-12-19 17:18:14
 * 用例编写人: UT006165（李日华）
 */

describe('1671623-窗口级菜单—最大化-还原', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671623-窗口级菜单—最大化-还原', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    // 步骤1：键入“alt+空格”组合键调出菜单
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    // 步骤1: 点击"最大化"选项
    await agent.aiTap('窗口菜单中的"最大化"选项', { deepThink: true });    
    // 预期结果1: 文件管理器窗口最大化显示
    await agent.aiAssert('文件管理器窗口最大化显示，文件管理器页面几乎铺满整个屏幕，无需观察右上角最大化控制按钮');

    // 步骤2：键入“alt+空格”组合键调出菜单
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    // 步骤2: 点击"还原"选项
    await agent.aiTap('窗口菜单中的"还原"选项', { deepThink: true });    
    // 预期结果2: 文件管理器窗口还原显示
    await agent.aiAssert('文件管理器窗口还原显示');
  }, { timeout: 600000, tags: ['1671623', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保窗口化显示
    await device.pressKey("Super", "Down");
    await uos.showDesktop(); 
    await system.exec('killall dde-file-manager');
    await uos.setWindowEffect("最佳视觉")
  });
});
