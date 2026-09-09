/**

 * 用例 PMSID: 1671657
 * 用例标题: 窗口还原—最大化界面下双击窗口标题栏
 * 生成时间: 2026-01-07 08:44:33
 * 用例编写人: UT006165（李日华）
 */

describe('1671657-窗口还原—最大化界面下双击窗口标题栏', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671657-窗口还原—最大化界面下双击窗口标题栏', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    // 确保文管窗口化
    await device.pressKey("Super", "Down");
    
    // 步骤2：点击右上角最大化按钮，将窗口最大化
    await agent.aiTap('文件管理器窗口右上角的最大化按钮', { deepThink: true });
    await agent.aiAssert('文件管理器窗口最大化显示，几乎贴满整个窗口，不必根据窗口右上角按钮判断');
    
    // 步骤3：在最大化界面双击窗口标题栏
    await agent.aiDoubleClick('文件管理器窗口的标题栏', { deepThink: true });
    
    // 预期结果：文件管理器窗口还原至最大化前窗口大小
    await agent.aiAssert('文件管理器窗口已还原至最大化前的大小');
    await agent.aiAssert('文件管理器窗口显示正常');
  }, { timeout: 600000, tags: ['1671657', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保文管窗口化
    await device.pressKey("Super", "Down");
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});