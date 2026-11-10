
/**
 * 用例 PMSID: 1963535
 * 用例标题: 【V25】【WPS Office】软件打开、关闭
 * 生成时间: 2025-12-17 17:16:52
 * 用例编写人：UT003531(钱程)
 */

describe('1963535-【V25】【WPS Office】软件打开、关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963535-【V25】【WPS Office】软件打开、关闭', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('WPS Office');
    await device.pressKey('Enter');
    await agent.aiAssert("界面存在新建按钮");
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1963535', 'level2', 'smoke'] });

  afterEach(async ({ device, uos, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.showDesktop();
    await agent.aiTap("桌面右上角空白处", { deepThink:true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
