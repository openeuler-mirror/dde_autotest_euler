/**

 * 用例 PMSID: 1671449
 * 用例标题: 【X11】super+shift+tab切换窗管特效
 * 生成时间: 2026-05-14 19:56:03
 * 用例编写人: UT006165（李日华）
 */

describe('1671449-【X11】super+shift+tab切换窗管特效', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671449-【X11】super+shift+tab切换窗管特效', async ({ device, agent, uos }) => {
    // 场景1：键入【super+shift+tab】按下不弹起
    await device.keyDown('Super');
    await device.keyDown('Shift');
    await device.pressKey('Tab');
    await agent.aiAssert('弹出特效切换框，含最佳性能、均衡、最佳视觉，特效切换框显示正常，有模糊效果');
    // 松开所有按键
    // await device.keyUp('Super');
    // await device.keyUp('Shift');
    // //await device.keyUp('Tab');

    // // 场景2：键入【super+shift+tab】一次不弹起，弹窗显示最佳视觉
    // await device.keyDown('Super');
    // await device.keyDown('Shift');
    await device.pressKey('Tab');
    await agent.aiAssert('弹窗选中最佳性能');
    // 仅抬起再按下tab，弹窗显示最佳性能
    await device.pressKey('Tab');
    // await device.pressKey('Tab');
    await agent.aiAssert('弹窗选中均衡');
    // 先回到最佳视觉，再松开所有按键
    await device.pressKey('Tab');
    await device.keyUp('Super');
    await device.keyUp('Shift');
    //await device.keyUp('Tab');

    // 最终断言：桌面整体正常显示，无花屏等现象
    await agent.aiAssert('桌面整体正常显示，无花屏等现象');
  }, { timeout: 600000, tags: ['1671449', 'level2','x11','window_rules','3d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.keyUp('Esc');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });
});
