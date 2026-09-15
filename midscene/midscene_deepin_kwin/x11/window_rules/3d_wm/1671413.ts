/**

 * 用例 PMSID: 1671413
 * 用例标题: 键入super+D快捷键，按super调出启动器查看桌面显示
 * 生成时间: 2025-12-11 13:47:48
 * 用例编写人: UT006165（李日华）
 */

describe('1671413-键入super+D快捷键，按super调出启动器查看桌面显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671413-键入super+D快捷键,按super调出启动器查看桌面显示', async ({ device, agent, uos }) => {
    // 前置条件: 桌面无打开窗口
    await agent.aiAssert("桌面无打开窗口");

    // 步骤1: 键入"super+D"快捷键
    await device.pressKey("Super", "d");
    
    // 预期结果1: 桌面显示正常
    await agent.aiAssert("桌面显示正常");

    // 步骤2: 按super快捷键
    await device.pressKey("Super");

    // 预期结果2: 调出启动器窗口，桌面显示正常
    await agent.aiAssert("启动器窗口已显示");
    await agent.aiAssert("桌面显示正常");

  }, { timeout: 600000, tags: ["1671413", "level2",'x11','window_rules','3d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭启动器窗口（如果还打开着）
    try {
      await device.pressKey("Escape");
    } catch (e) {
      console.log('启动器窗口可能已关闭');
    }
  });
});