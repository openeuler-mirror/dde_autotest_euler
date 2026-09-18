
/**
 * 用例 PMSID: 1850091
 * 用例标题: 【通知中心】点击桌面正常关闭通知中心
 * 生成时间: 2025-12-18 13:46:13
 * 用例编写人: UT003072
 */

describe('1850091-【通知中心】点击桌面正常关闭通知中心', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1850091-【通知中心】点击桌面正常关闭通知中心', async ({ device, agent, uos }) => {
    // 步骤 1: 使用快捷键方式打开通知中心
      await device.pressKey("Super", "M");

      // 检查: 显示通知中心
      await agent.aiWaitFor("桌面右侧显示通知中心", {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });

      await agent.aiAssert("桌面右侧显示通知中心字样");

      // 步骤 2: 点击桌面空白区域
      await agent.aiTap("桌面空白区域");

      // 检查： 通知中心正常关闭
      await agent.aiWaitFor("桌面右侧通知中心字样消失", {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiAssert("桌面右侧通知中心字样消失");
  }, { timeout: 1200000, tags: ['1850091', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
