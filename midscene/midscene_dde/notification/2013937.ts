/**
 * 用例 PMSID: 2013937
 * 用例标题: 【社区反馈】【通知中心】通知icon图标需要支持原始ARGB像素数据
 * 生成时间: 2026-09-03 20:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('2013937-【社区反馈】【通知中心】通知icon图标需要支持原始ARGB像素数据', () => {
  const caseDir = process.env.TESTCASE_DIR;

  // 发送携带 image-data（原始ARGB像素数据）的通知，2x2像素红绿白图案
  // expireTimeout 用 15000ms 保证 AI 断言期间横幅保持展示（用例关注点是图标展示而非消失时长）
  const sendArgbNotify = (summary, body, expireMs) => {
    return `gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "${summary}" 0 "" "${summary}" "${body}" "[]" "{'image-data': <(2, 2, 8, true, 8, 4, [byte 0xFF, 0x00, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0xFF])>}" ${expireMs}`;
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2013937-【社区反馈】【通知中心】通知icon图标需要支持原始ARGB像素数据', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 1: 发送携带ARGB像素数据的通知，查看桌面通知横幅左上角的icon展示
    await system.exec(sendArgbNotify('ARGB图标测试', '查看横幅左上角icon', 15000));
    await agent.aiWaitFor('桌面右下角出现一条标题为"ARGB图标测试"的通知横幅', { timeoutMs: 15000 });

    // 检查: 横幅icon展示ARGB像素合成的图标，不是默认通知图标
    // ARGB数据2x2解码为红/绿/蓝/黄四个象限，缩放后为四色方块图案
    await agent.aiAssert('通知横幅左上角的icon是由红、绿、蓝、黄四个纯色色块拼成的方块图案（四色各占一角），不是系统默认的通知图标样式');

    // 等待横幅消失进入通知中心
    await new Promise(resolve => setTimeout(resolve, 20000));

    // 步骤 2: 查看通知中心中这条通知左上角的icon展示
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 10000 });

    // 检查: 通知中心中icon同样展示ARGB像素合成的图标
    await agent.aiAssert('通知中心中标题为"ARGB图标测试"的通知左上角的icon是由红、绿、蓝、黄四个纯色色块拼成的方块图案（四色各占一角，没有白色箭头等其他图形），不是系统默认的通知图标样式');
  }, { timeout: 600000, tags: ['2013937', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });
});
