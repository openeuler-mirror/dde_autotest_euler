/**
 * 用例 PMSID: 1849667
 * 用例标题: 【通知中心】常驻通知信息，在通知中心暂驻区域手动操作消失后，关闭通知中心，常驻通知不会展示在桌面
 * 生成时间: 2026-07-14 10:25:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849667-【通知中心】常驻通知信息，在通知中心暂驻区域手动操作消失后，关闭通知中心，常驻通知不会展示在桌面', () => {
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

  test('1849667-【通知中心】常驻通知信息，在通知中心暂驻区域手动操作消失后，关闭通知中心，常驻通知不会展示在桌面', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 通过 dbus 接口发送多个带按钮的常驻通知（timeout=0 表示常驻，按钮标签区分通知）
    for (let i = 1; i <= 2; i++) {
      await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "常驻消失测试应用${i}" 0 "" "常驻消失测试${i}" "手动消失后不展示桌面" '["action${i}", "删除${i}"]' "{}" 0`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await agent.aiWaitFor('桌面右下角出现两条通知横幅，标题为"常驻消失测试1"和"常驻消失测试2"');

    // 步骤 2: 打开通知中心，在暂驻区域点击常驻通知的"删除1"按钮使其消失，关闭通知中心
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示');

    // 点击常驻通知的"删除1"按钮使其消失
    await agent.aiHover('通知中心暂驻区域中标题为"常驻消失测试1"的通知', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('通知中心暂驻区域中标题为"常驻消失测试1"的通知上的"删除1"按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 关闭通知中心
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 常驻通知消失，不会展示在桌面
    await agent.aiAssert('桌面上看不到标题为"常驻消失测试1"的常驻通知横幅');
  }, { timeout: 600000, tags: ['1849667', 'level3'] });

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
