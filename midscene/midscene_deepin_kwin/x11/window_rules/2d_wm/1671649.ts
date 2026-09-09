/**

 * 用例 PMSID: 1671649
 * 用例标题: 还原/最大化窗口键入“ALT+F4”组合键
 * 生成时间: 2025-12-22 10:49:02
 * 用例编写人: UT006165（李日华）
 */

describe('1671649-还原/最大化窗口键入“ALT+F4”组合键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671649-还原/最大化窗口键入“ALT+F4”组合键', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口，将窗口最大化显示，键入“ALT+F4”组合键
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await device.pressKey("Super", "Up");
    await agent.aiAssert('文件管理器窗口最大化显示，即基本铺满桌面，不用关注右上角');
    await device.pressKey("Alt", "F4");
    // 预期结果1：文管窗口被关闭
    await agent.aiAssert("文管应用窗口已关闭");

    // 步骤2：打开文件管理器窗口，在还原窗口键入“ALT+F4”组合键
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await device.pressKey("Super", "Down");
    await agent.aiAssert('文件管理器窗口还原显示');
    await device.pressKey("Alt", "F4");
    // 预期结果2：文管窗口被关闭
    await agent.aiAssert("文管应用窗口已关闭");
  }, { timeout: 600000, tags: ['1671649', 'level1','x11','window_rules','2d_wm'] });

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
