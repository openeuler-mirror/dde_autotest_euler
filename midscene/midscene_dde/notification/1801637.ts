/**
 * 用例 PMSID: 1801637
 * 用例标题: 【通知中心】通知中心打开状态，新的通知信息先显示在暂驻区域
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801637-【通知中心】通知中心打开状态，新的通知信息先显示在暂驻区域', () => {

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

  test('1801637-通知中心打开状态新的通知信息先显示在暂驻区域', async ({ device, agent, uos, system }) => {
    // 前置条件：通知中心打开状态
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 先发送一条旧通知，作为对比基准
    await system.exec(`notify-send "通知信息测试" "第一条旧通知" -t 20000`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 验证暂驻区域已有第一条通知
    await agent.aiAssert("通知中心暂驻区域有内容为'第一条旧通知'的通知信息");
    // 再发送一条新通知
    await system.exec(`notify-send "通知信息测试" "第二条新通知" -t 20000`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查: 新通知显示在通知中心的暂驻区域，且显示在旧通知上方（最上面）
    await agent.aiAssert("通知中心暂驻区域有内容为'第二条新通知'的通知信息");
    await agent.aiAssert("暂驻区域中'第二条新通知'显示在'第一条旧通知'的上方，即最新的通知显示在最上面", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801637', 'level3'] });

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
