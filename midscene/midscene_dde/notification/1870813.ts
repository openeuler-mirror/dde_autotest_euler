/**
 * 用例 PMSID: 1870813
 * 用例标题: 【通知中心】发送一条非常驻通知，在通知消失前打开通知中心并点击通知中心全部清除按钮，关闭通知中心，非常驻通知到时间后会自动消失
 * 生成时间: 2026-07-14 09:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1870813-【通知中心】发送一条非常驻通知，在通知消失前打开通知中心并点击通知中心全部清除按钮，关闭通知中心，非常驻通知到时间后会自动消失', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1870813-【通知中心】发送一条非常驻通知，在通知消失前打开通知中心并点击通知中心全部清除按钮，关闭通知中心，非常驻通知到时间后会自动消失', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送一条非常驻通知（15秒超时），在通知消失前打开通知中心并点击全部清除按钮
    await system.exec('notify-send -a "测试应用" "非常驻通知测试" "15秒后自动消失" -t 15000');

    // 打开通知中心
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示');

    // 点击通知中心清除全部按钮（有则点击），否则逐条删除，直到通知全部清除
    await agent.aiTap('通知中心文字所在行右边的扫把图标（清除全部）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 关闭通知中心
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 等待通知超时时间到达，此处等待16秒是业务逻辑不可降低
    await new Promise(resolve => setTimeout(resolve, 16000));

    // 检查: 非常驻通知到时间后会自动消失
    await agent.aiAssert('桌面没有显示该非常驻通知的横幅，通知已自动消失');

    // 打开通知中心确认通知已被清除
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiAssert('通知中心中没有显示标题为非常驻通知测试的通知信息');
  }, { timeout: 600000, tags: ['1870813', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
