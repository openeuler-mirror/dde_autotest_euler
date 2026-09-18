
/**
 * 用例 PMSID: 1850093
 * 用例标题: 【通知中心】点击任务栏正常关闭通知中心
 * 生成时间: 2025-12-18 14:51:08
 * 用例编写人: UT001924(李鹤)
 */

describe('1850093-【通知中心】点击任务栏正常关闭通知中心', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 使用快捷键打开通知中心
    await device.pressKey("super", "m");
    await agent.aiAssert("桌面右上区域'通知中心'文字可见");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1850093-【通知中心】点击任务栏正常关闭通知中心', async ({ device, agent, uos }) => {
    // 点击任务栏没有图标的区域关闭通知中心
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
    await agent.aiAssert("通知中心关闭,桌面右上角'通知中心'文字不可见");
  }, { timeout: 1200000, tags: ['1850093', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
