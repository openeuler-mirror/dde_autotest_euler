/**
 * 用例 PMSID: 1801655
 * 用例标题: 【通知中心】通知中心长驻区域单条信息右上角的[删除]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801655-【通知中心】通知中心长驻区域单条信息右上角的删除按钮功能与需求一致', () => {

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

  test('1801655-【通知中心】通知中心长驻区域单条信息右上角的删除按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 使用notify-send发送一条唯一标识的通知
    await system.exec(`notify-send -a 'dde-control-center' "待删除通知" "待删除通知内容"`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 等待通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 8000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心长驻区域有'待删除通知'的通知信息");
    // 鼠标悬浮到本条用例发送的测试通知信息上，使删除按钮显示
    await agent.aiHover("通知中心长驻区域中标题为'待删除通知'的通知条目", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 点击单条信息右上方的[删除]按钮（X图标）
    await agent.aiTap("该通知右上角的x关闭按钮", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查: 单独删除该条通知信息，通知中心不会关闭
    await agent.aiAssert("'待删除通知'的通知信息已被删除，不显示'待删除通知'的通知信息");
    await agent.aiAssert("通知中心未关闭");
  }, { timeout: 1200000, tags: ['1801655', 'level3'] });

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
