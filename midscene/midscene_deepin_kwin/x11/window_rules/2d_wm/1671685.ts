/**

 * 用例 PMSID: 1671685
 * 用例标题：快捷键"Alt+空格"调出窗口级菜单
 * 生成时间: 2026-01-07 14:07:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671685-快捷键"Alt+空格"调出窗口级菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671685-快捷键"Alt+空格"调出窗口级菜单', async ({ device, agent, uos }) => {
    // 前置条件：打开文件管理器应用
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");
    
    // 步骤：键入"alt+space"组合键
    await device.pressKey("Alt", "Space");
    
    // 预期结果：调出窗口右键菜单
    await agent.aiAssert("窗口右键菜单已显示");
  }, { timeout: 600000, tags: ['1671685', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    await system.exec('killall dde-file-manager');
    await uos.setWindowEffect("最佳视觉")
  });
});