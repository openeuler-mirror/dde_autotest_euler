/**

 * 用例 PMSID: 1671621
 * 用例标题: 窗口级菜单—最小化-还原
 * 生成时间: 2025-12-19 16:38:35
 * 用例编写人: UT006165（李日华）
 */

describe('1671621-窗口级菜单—最小化-还原', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671621-窗口级菜单—最小化-还原', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await device.pressKey("Super", "Down");
    
    // 步骤1：键入“alt+空格”组合键调出菜单
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    // 步骤1：点击"最小化"选项
    await agent.aiTap('窗口菜单中的"最小化"选项', { deepThink: true });
    // 预期结果1: 文件管理器窗口最小化到任务栏
    await agent.aiAssert('文件管理器窗口最小化到任务栏');

    // 步骤2：点击任务栏文管图标
    await agent.aiTap("任务栏文件管理器图标", { deepThink: true });
    await agent.aiAssert("文件管理器窗口已还原显示");
  }, { timeout: 600000, tags: ['1671621', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey("Super", "Down");
    await uos.showDesktop(); 
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});
