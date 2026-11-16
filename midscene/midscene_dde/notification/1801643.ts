/**
 * 用例 PMSID: 1801643
 * 用例标题: 【通知中心】通知中心长驻区域单个通知信息展示元素与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801643-【通知中心】通知中心长驻区域单个通知信息展示元素与需求一致', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801643-【通知中心】通知中心长驻区域单个通知信息展示元素与需求一致', async ({ device, agent, uos, system }) => {
    // 发送一条带标题和内容的通知
    await system.exec(`notify-send -a 'dde-control-center' "通知标题" "通知内容信息"`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 等待通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 检查: 显示应用程序名称、应用程序图标、通知标题、通知内容、通知时间
    await agent.aiAssert("通知信息应用程序名称'控制中心'");
    await agent.aiAssert("通知信息显示应用程序图标");
    await agent.aiAssert("通知信息显示通知标题'通知标题'");
    await agent.aiAssert("通知信息显示通知内容'通知内容信息'");
    await agent.aiAssert("通知信息右上角显示通知时间");
  }, { timeout: 1200000, tags: ['1801643', 'level3'] });

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
