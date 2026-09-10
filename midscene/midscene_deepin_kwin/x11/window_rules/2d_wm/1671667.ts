/**

 * 用例 PMSID: 1671667
 * 用例标题：多实例应用—"Ctrl+Alt+T"打开一个终端，在屏幕中间显示
 * 生成时间: 2026-01-13 10:39:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671667-多实例应用—"Ctrl+Alt+T"打开一个终端，在屏幕中间显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671667-多实例应用—"Ctrl+Alt+T"打开一个终端，在屏幕中间显示', async ({ device, agent, uos }) => {
    // 步骤1：输入快捷键"Ctrl+Alt+T"
    await device.pressKey("Ctrl", "Alt", "T");
    
    // 预期结果1：打开终端窗口显示在屏幕中间位置
    await agent.aiAssert("终端窗口显示在屏幕中间位置");
  }, { timeout: 600000, tags: ['1671667', 'level3','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保终端窗口关闭
    await uos.showDesktop(); 
    await system.exec('killall deepin-terminal');
    await uos.setWindowEffect("最佳视觉")
  });
});