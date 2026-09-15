/**

 * 用例 PMSID: 1671697
 * 用例标题: 桌面工作区切换—工作区数量为1,键入“Ctrl+Alt+0~5”无响应 
 * 生成时间: 2026-04-23 19:19:00
 * 用例编写人: UT006165（李日华）
 */


describe('1671697-桌面工作区切换—工作区数量为1,键入“Ctrl+Alt+0~5”无响应', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671697-桌面工作区切换—工作区数量为1,键入“Ctrl+Alt+0~5”无响应', async ({ device, agent, uos }) => {
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

    // 步骤 1: 设置最佳性能界面效果
    await uos.setWindowEffect("最佳性能");

    // 步骤2：回到桌面，显示桌面
    await uos.showDesktop();
    await agent.aiAssert('正常显示桌面');

    // 按下 Ctrl+Alt+0
    await device.pressKey("Ctrl", "Alt", "0");
    await agent.aiAssert("快捷键按下后无报错、无闪退，桌面无任何切换动画、无界面变化、无响应");

    // 按下 Ctrl+Alt+1
    console.log('按下 Ctrl+Alt+1');
    await device.pressKey("Ctrl", "Alt", "1");
    await agent.aiAssert("快捷键按下后无报错、无闪退，桌面无任何切换动画、无界面变化、无响应");

    // 按下 Ctrl+Alt+2
    console.log('按下 Ctrl+Alt+2');
    await device.pressKey("Ctrl", "Alt", "2");
    await agent.aiAssert("快捷键按下后无报错、无闪退，桌面无任何切换动画、无界面变化、无响应");

    // 按下 Ctrl+Alt+3
    await device.pressKey("Ctrl", "Alt", "3");
    await agent.aiAssert("快捷键按下后无报错、无闪退，桌面无任何切换动画、无界面变化、无响应");   

    // 按下 Ctrl+Alt+4
    await device.pressKey("Ctrl", "Alt", "4");
    await agent.aiAssert("快捷键按下后无报错、无闪退，桌面无任何切换动画、无界面变化、无响应");   

    // 按下 Ctrl+Alt+5
    await device.pressKey("Ctrl", "Alt", "5");
    await agent.aiAssert("快捷键按下后无报错、无闪退，桌面无任何切换动画、无界面变化、无响应");   

  }, { timeout: 350000, tags: ['1671697', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.setWindowEffect("最佳视觉")
    await uos.showDesktop();
  });
});
