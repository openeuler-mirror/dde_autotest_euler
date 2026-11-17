/**
 * 用例 PMSID: 1818643
 * 用例标题: 【通知中心】没有新通知信息，通知横幅区域展示在任务栏托盘区或插件区tip条下层
 * 生成时间: 2026-07-14 11:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1818643-【通知中心】没有新通知信息，通知横幅区域展示在任务栏托盘区或插件区tip条下层', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 发送常驻通知确保有通知横幅显示
    await system.exec('notify-send "tip条测试通知" "通知横幅在下层" -t 0');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1818643-【通知中心】没有新通知信息，通知横幅区域展示在任务栏托盘区或插件区tip条下层', async ({ device, agent, uos }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 鼠标悬浮在任务栏托盘区和插件区图标上唤出tip条，查看通知横幅展示
    await agent.aiHover('任务栏右侧托盘区或插件区的图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: tip条出现且显示在通知横幅上方
    await agent.aiAssert('鼠标悬浮后出现了任务栏tip条提示信息,tip条信息在通知信息上层');
  }, { timeout: 600000, tags: ['1818643', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
