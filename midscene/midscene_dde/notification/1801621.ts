/**
 * 用例 PMSID: 1801621
 * 用例标题: 【通知中心】通知中心无暂驻区域，默认展示符合设计预期
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801621-【通知中心】通知中心无暂驻区域，默认展示符合设计预期', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 关闭通知中心
    await device.pressKey("super", "m");
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801621-【通知中心】通知中心无暂驻区域，默认展示符合设计预期', async ({ device, agent, uos }) => {
    await uos.showDesktop();
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 检查: 只展示长驻区，标题栏显示标题"通知中心"，标题栏右侧显示功能图标，从左往右依次为功能按钮【设置】、【清除通知】
    await agent.aiAssert("标题栏显示'通知中心'文字");
    await agent.aiAssert("标题栏右侧有设置按钮(三个点图标)和清除通知按钮(类似扫帚或网格的图标)");
  }, { timeout: 1200000, tags: ['1801621', 'level2', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
