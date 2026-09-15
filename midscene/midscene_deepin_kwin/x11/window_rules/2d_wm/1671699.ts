/**

 * 用例 PMSID: 1671699
 * 用例标题: 面工作区切换—工作区数量为1,键入“Ctrl+Alt+←’无响应
 * 生成时间: 2026-04-23 11:13:00
 * 用例编写人: UT006165（李日华）
 */


describe('1671699-桌面工作区切换—工作区数量为1,键入“Ctrl+Alt+←’无响应', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671699-桌面工作区切换—工作区数量为1,键入“Ctrl+Alt+←’无响应', async ({ device, agent, uos }) => {
    // 将工作区减为1
    await uos.setWindowEffect("最佳视觉")
    await device.pressKey('Super', 'S');

    // 连续输入5次快捷键alt+-，使工作区的数量为1
    console.log('连续输入5次 Alt+- 减少工作区数量到1');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    // 退出多任务视图
    await device.pressKey("Esc");

    // 步骤 1: 设置最佳性能界面效果并显示桌面
    await uos.setWindowEffect("最佳性能");
    await uos.showDesktop();

    // 按下 Ctrl+Alt+左箭头
    await device.pressKey("Ctrl", "Alt", "Left");
    await agent.aiAssert("界面保持在当前桌面，没有显示其他工作区或工作区切换效果");

  }, { timeout: 350000, tags: ['1671699', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey("Ctrl", "Alt", "1");
    await uos.showDesktop();

  });
});
