/**

 * 用例 PMSID: 1671687
 * 用例标题：窗口级菜单—设置一个窗口总在最前
 * 生成时间: 2026-01-13 09:20:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671687-窗口级菜单—设置一个窗口总在最前', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671687-窗口级菜单—设置一个窗口总在最前', async ({ device, agent, uos }) => {
    // 前置条件：打开控制中心、终端窗口
    await uos.openApp("控制中心");
    // await agent.aiWaitFor("控制中心窗口已打开");
    await agent.aiWaitFor("系统设置窗口已打开");
    await uos.openApp("终端");
    await agent.aiWaitFor("终端窗口已打开");
    
    // 步骤1：打开文件管理器应用，键入"alt+space"组合键，鼠标点击"总在最前"
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiTap('窗口菜单中的"总在最前"选项', { deepThink: true });
    
    // 预期结果1：文件管理器窗口显示在最上层
    await agent.aiAssert('文件管理器窗口显示在最上层');
  }, { timeout: 600000, tags: ['1671687', 'level2','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); // 先显示桌面，便于操作
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    
    await agent.aiRightClick("任务栏终端图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");

    await device.pressKey("Esc");
    await system.exec('killall dde-control-center');
    // await agent.aiRightClick("任务栏控制中心图标");
    // await agent.aiTap("右键菜单中的'关闭所有'选项");
    // 最后设置窗口效果
    await uos.setWindowEffect("最佳视觉")
  });
});