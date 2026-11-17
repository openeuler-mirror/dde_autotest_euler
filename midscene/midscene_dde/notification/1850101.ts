/**
 * 用例 PMSID: 1850101
 * 用例标题: 【通知中心】通知中心暂驻区域，鼠标长按常驻通知信息向右拖动，删除通知信息，通知信息不会进入通知中心常驻区域
 * 生成时间: 2026-07-14 09:10:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1850101-【通知中心】通知中心暂驻区域，鼠标长按常驻通知信息向右拖动，删除通知信息，通知信息不会进入通知中心常驻区域', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1850101-【通知中心】通知中心暂驻区域，鼠标长按常驻通知信息向右拖动，删除通知信息，通知信息不会进入通知中心常驻区域', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送一个常驻通知（-t 0 表示常驻不消失）
    await system.exec('notify-send -a "拖动删除测试应用" "拖动删除测试" "暂驻区域拖动删除" -t 0');
    await agent.aiWaitFor('桌面右下角出现一条通知，标题为拖动删除测试');

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 步骤 2: 在暂驻区域，鼠标长按常驻通知横幅向右拖动操作删除通知
    const { hoverDrag } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await hoverDrag(agent, device, '通知中心中标题为"拖动删除测试"的通知', 200, 0, 2000);

    // 检查: 删除通知信息，通知信息不会进入通知中心常驻区域
    await agent.aiAssert('通知中心看不到标题为"拖动删除测试"的通知（已被删除）');
  }, { timeout: 600000, tags: ['1850101', 'level3'] });

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
