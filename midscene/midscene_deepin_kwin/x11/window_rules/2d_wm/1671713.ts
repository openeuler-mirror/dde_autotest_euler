
/**

 * 用例 PMSID: 1671713
 * 用例标题: 无窗口时，键入“Alt+Tab/Alt+~”，切换器不被唤起
 * 生成时间: 2026-06-18 15:34:42
 * 用例编写人: UT006165（李日华）
 *  */

describe('1671713-无窗口时，键入“Alt+Tab/Alt+~”，切换器不被唤起', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671713-无窗口时,键入“Alt+Tab/Alt+~”，切换器不被唤起', async ({ device, agent, uos ,system }) => {
    //前置操作：防止有其他窗口，查杀一些
    await system.exec('killall dde-control-center');
    await system.exec('killall dde-file-manager');
    await system.exec('killall org.deepin.browser');
    await system.exec('killall deepin-terminal');

    // 步骤1：键入“Alt+tab”组合键
    await device.pressKey('Alt', 'Tab');
    await agent.aiAssert("正常显示桌面");
    // 步骤2：键入Alt+Shift+tab组合键
    await device.pressKey('Alt', 'Shift', 'Tab');
    await agent.aiAssert("正常显示桌面");
    // 步骤3：键入Alt+～组合键
    await device.pressKey('Alt', '`');
    await agent.aiAssert("正常显示桌面");
    // 步骤4：键入Alt+Shift+～组合键
    await device.pressKey('Alt', 'Shift', '`');
    await agent.aiAssert("正常显示桌面");
  }, { timeout: 600000, tags: ['1671713', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Esc');
  });
});
