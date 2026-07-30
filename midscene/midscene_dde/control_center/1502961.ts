/**
 * 用例 PMSID: 1502961
 * 用例标题: 测试设备支持亮度调节
 * 生成时间: 2025-12-12 20:14:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502961-测试设备支持亮度调节', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1502961-测试设备支持亮度调节', async ({ device, agent, uos }) => {
    // 步骤 1: 打开任务栏右下角声音图标
    await agent.aiTap("任务栏的'音量图标'", { deepThink: true });

    // 检查: 快捷面板已开启，左侧显示亮度图标，右侧显示电脑图标
    await agent.aiAssert("快捷控制面板显示亮度模块");
    await agent.aiAssert("亮度模块左侧为亮度图标");
    await agent.aiAssert("亮度模块右侧为电脑图标");

  }, { timeout: 1200000, tags: ["1502961","level1","smoke"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("桌面空白区域");
  });
});
