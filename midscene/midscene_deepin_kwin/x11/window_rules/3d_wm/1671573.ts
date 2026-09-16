/**

 * 用例 PMSID: 1671573
 * 用例标题: 打开/关闭窗口菜单
 * 生成时间: 2025-12-11 11:05:36
 * 用例编写人: UT006165（李日华）
 */

describe('1671573-打开/关闭窗口菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671573-打开/关闭窗口菜单', async ({ device, agent, uos }) => {
    // 前置条件: 使用快捷键"Super+E"打开文件管理器应用
    await device.pressKey("Super", "E");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await agent.aiAssert("文件管理器窗口显示正常");

    // 步骤1: 键入"alt+空格"组合键
    await device.pressKey("Alt", "Space");
    
    // 预期结果1: 调出窗口右键菜单
    await agent.aiAssert("窗口右键菜单已显示");

    // 步骤2: 鼠标点击窗口右键菜单以外任意位置
    await agent.aiTap("窗口空白处");

    // 预期结果2: 窗口右键菜单被关闭
    await agent.aiAssert("窗口右键菜单已关闭");

  }, { timeout: 600000, tags: ["1671573", "level1",'x11','window_rules','3d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保文件管理器窗口关闭
    await device.pressKey("Esc");
    await system.exec('killall dde-file-manager');
  });
});