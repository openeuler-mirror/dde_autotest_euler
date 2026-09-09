/**

 * 用例 PMSID: 1671647
 * 用例标题: 还原/最大化窗口点击右上角关闭“×”按钮
 * 生成时间: 2025-12-22 10:35:21
 * 用例编写人: UT006165（李日华）
 */

describe('1671647-还原/最大化窗口点击右上角关闭“×”按钮', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671647-还原/最大化窗口点击右上角关闭“×”按钮', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口，将窗口最大化显示，右上角点击关闭按钮
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await device.pressKey("Super", "Up");
    await agent.aiAssert('文件管理器窗口已最大化,但窗口尺寸略小于全屏(底部被dock栏占用的区域未被窗口覆盖)', { deepThink: true });

    await agent.aiTap("文管窗口右上角的关闭按钮（×）");
    // 预期结果1：文管窗口被关闭
    await agent.aiAssert("文管应用窗口已关闭");

    // 步骤2：打开文件管理器窗口，在还原窗口右上角点击关闭按钮
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await device.pressKey("Super", "Down");
    await agent.aiAssert('文件管理器窗口还原显示');
    await agent.aiTap("文管窗口右上角的关闭按钮（×）");
    // 预期结果2：文管窗口被关闭
    await agent.aiAssert("文管应用窗口已关闭");
  }, { timeout: 600000, tags: ['1671647', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey("Esc");
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await system.exec('killall dde-file-manager');
    await uos.setWindowEffect("最佳视觉")
  });
});
