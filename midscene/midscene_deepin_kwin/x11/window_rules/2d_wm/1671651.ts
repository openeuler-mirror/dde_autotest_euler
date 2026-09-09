/**

 * 用例 PMSID: 1671651
 * 用例标题: Dock栏右键菜单关闭所有
 * 生成时间: 2025-12-22 11:03:29
 * 用例编写人: UT006165（李日华）
 */

describe('1671651-Dock栏右键菜单关闭所有', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671651-Dock栏右键菜单关闭所有', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口，鼠标hover到任务栏窗口上，右键选择“关闭所有”按钮关闭窗口
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await agent.aiHover("任务栏文件管理器图标");
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiWaitFor("任务栏文件管理器窗口的右键菜单已显示");
    await agent.aiTap("右键菜单中的“关闭所有”按钮");
    // 预期结果1：文管应用被关闭
    await agent.aiAssert("文管应用已关闭");
  }, { timeout: 600000, tags: ['1671651', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});
