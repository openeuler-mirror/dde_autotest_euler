/**
 * 用例 PMSID: 1850097
 * 用例标题: 【通知中心】鼠标长按常驻通知横幅信息向右拖动，删除通知信息，通知信息不会进入通知中心
 * 生成时间: 2026-07-14 09:45:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1850097-【通知中心】鼠标长按常驻通知横幅信息向右拖动，删除通知信息，通知信息不会进入通知中心', () => {

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

  test('1850097-【通知中心】鼠标长按常驻通知横幅信息向右拖动，删除通知信息，通知信息不会进入通知中心', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送一个常驻通知（-t 0 表示常驻不消失）
    await system.exec('notify-send -a "横幅拖动测试应用" "横幅拖动测试" "桌面横幅拖动删除" -t 0');

    // 步骤 2: 鼠标长按通知横幅向右拖动操作删除通知
    // 悬浮定位到通知横幅 → 按住左键3秒 → 平滑右移200px → 松开左键
    const { hoverDrag } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await hoverDrag(agent, device, '标题为"横幅拖动测试"的通知横幅', 200, 0, 2000);

    // 步骤 3: 打开通知中心
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 通知信息不会进入通知中心
    await agent.aiAssert('通知中心中看不到标题为"横幅拖动测试"的通知信息');
  }, { timeout: 600000, tags: ['1850097', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
