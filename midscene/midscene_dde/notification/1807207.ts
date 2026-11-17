/**
 * 用例 PMSID: 1807207
 * 用例标题: 【通知中心】通知中心鼠标悬浮到单条信息上，右上角的按钮默认显示图标
 * 生成时间: 2026-07-14 11:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1807207-【通知中心】通知中心鼠标悬浮到单条信息上，右上角的按钮默认显示图标', () => {

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

  test('1807207-【通知中心】通知中心鼠标悬浮到单条信息上，右上角的按钮默认显示图标', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送通知并等待通知进入通知中心
    await system.exec('notify-send "悬浮图标测试" "悬浮显示按钮图标" -t 1000');

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 步骤 2: 鼠标悬浮到通知条目上，查看右上角展示按钮图标
    await agent.aiHover('通知中心中标题为"悬浮图标测试"的通知条目内容区域', { deepThink: true });

    // 检查: 展示[删除]功能图标
    await agent.aiAssert('通知右上角出现删除按钮，是x图标');
  }, { timeout: 600000, tags: ['1807207', 'level3'] });

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
