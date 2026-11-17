/**
 * 用例 PMSID: 1846171
 * 用例标题: 【通知中心】通知通知中心暂驻区点击常驻通知的清除按钮能正常删除通知信息
 * 生成时间: 2026-07-14 10:50:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846171-【通知中心】通知通知中心暂驻区点击常驻通知的清除按钮能正常删除通知信息', () => {

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

  test('1846171-【通知中心】通知通知中心暂驻区点击常驻通知的清除按钮能正常删除通知信息', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送一条常驻通知
    await system.exec('notify-send "清除按钮测试" "点击清除按钮删除" -t 0');

    // 步骤 2: 打开通知中心，点击通知中心暂驻区通知右上角的清除按钮
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    await agent.aiHover('通知中心暂驻区域中标题为"清除按钮测试"的通知', { deepThink: true });
    await agent.aiTap('该通知右上角的x关闭按钮', { deepThink: true });

    // 检查: 正常删除通知，通知信息不会进入通知中心常驻区域
    await agent.aiAssert('通知中心看不到标题为"清除按钮测试"的通知');
  }, { timeout: 600000, tags: ['1846171', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    // 关闭通知中心
    await uos.showDesktop();
  });
});
