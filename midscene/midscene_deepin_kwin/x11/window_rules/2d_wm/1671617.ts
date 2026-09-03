/**

 * 用例 PMSID: 1671617
 * 用例标题: 调出窗口级菜单—右键窗口标题栏
 * 生成时间: 2025-12-10 16:36:47
 * 用例编写人: UT006165（李日华）
 */

describe('1671617-调出窗口级菜单—右键窗口标题栏', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671617-调出窗口级菜单—右键窗口标题栏', async ({ device, agent, uos }) => {
    // 前置条件: 打开文件管理器窗口
    await device.pressKey("Super", "E");
    await agent.aiAssert("文件管理器窗口显示在桌面");
    await device.pressKey("Super", "Down");

    // 步骤1: 鼠标右键单击标题栏
    await agent.aiRightClick("文件管理器窗口标题栏右侧的空白区域");
    // 预期结果1: 调出窗口右键菜单
    await agent.aiAssert("窗口右键菜单已显示");

  }, { timeout: 600000, tags: ["1671617", "level1",'x11','window_rules','2d_wm'] });

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