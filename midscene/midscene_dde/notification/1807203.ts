/**
 * 用例 PMSID: 1807203
 * 用例标题: 【通知中心】通知中心鼠标悬浮在折叠信息上，操作按钮默认展示图标
 * 生成时间: 2026-08-05 13:36:23
 * 用例编写人: UT000327(秦家喜)
 */

describe('1807203-【通知中心】通知中心鼠标悬浮在折叠信息上，操作按钮默认展示图标', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807203-【通知中心】通知中心鼠标悬浮在折叠信息上，操作按钮默认展示图标', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 发送多条同一应用的通知，等待进入通知中心长驻区域并折叠
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -a '通知中心测试应用' '通知信息测试' '这是第${i}条通知内容' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // 等待通知横幅消失进入通知中心长驻区域
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 步骤 1: 打开通知中心，鼠标悬浮到折叠信息上
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心长驻区域中存在来自同一应用的折叠通知信息');
    await agent.aiHover('通知中心长驻区域中的折叠通知信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 鼠标 hover 到 x 图标上，验证其为"清除全部"功能：悬浮该图标会显示"清除全部"文案
    await agent.aiHover('通知中心长驻区域中的折叠通知信息右上角的 x 图标上', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查(预期 1): 鼠标悬浮的折叠信息右上角展示[清除全部]功能图标（即 x 图标）
    await agent.aiAssert('显示"清除全部"文案');
  }, { timeout: 600000, tags: ['1807203', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
