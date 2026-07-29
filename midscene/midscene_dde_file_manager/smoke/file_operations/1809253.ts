/**
 * 用例 PMSID: 1809253
 * 用例标题: 右键菜单-空白处右键显示设置
 * 生成时间: 2025-12-17 13:37:27
 * 用例编写人：UT002899(胡诗敏)
 */
describe('1809253-右键菜单-空白处右键显示设置', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });
  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager')
  });
  test('1809253-右键菜单-空白处右键显示设置', async ({ agent }) => {
    await agent.aiWaitFor("桌面已显示");
    //右键点击显示设置
    await agent.aiRightClick("桌面空白处")
    await agent.aiTap("显示设置")
    await agent.aiAssert("进入系统/显示")

  }, { timeout: 300000, tags: ['1809253', 'level2', 'smoke', 'hushimin'] });
  afterEach(async ({ system }) => {
    console.log('4. afterEach: 每个测试后的清理');
   //关闭所有文管窗口
    await system.exec('killall dde-control-center')

  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

  });
});
