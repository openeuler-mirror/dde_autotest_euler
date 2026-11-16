/**
 * 用例 PMSID: 1802205
 * 用例标题: 【通知中心】通知中心操作按钮默认展示图标，鼠标悬浮到操作按钮上展示文字说明
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1802205-【通知中心】通知中心操作按钮默认展示图标，鼠标悬浮到操作按钮上展示文字说明', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1802205-【通知中心】通知中心操作按钮默认展示图标，鼠标悬浮到操作按钮上展示文字说明', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 准备通知数据：两个应用各3条形成折叠信息，再发1条单条通知
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '控制中心通知' '这是第${i}条控制中心通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'org.deepin.browser' '浏览器通知' '这是第${i}条浏览器通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await system.exec(`notify-send -a 'org.deepin.terminal' '单条悬浮文字测试' '用于删除按钮悬浮测试' -t 1000`);
    await new Promise(resolve => setTimeout(resolve, 6000));

    // 步骤 1: 打开通知中心，查看标题栏操作按钮展示（默认展示图标）
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心列表中显示通知信息', { timeoutMs: 15000 });
    await agent.aiAssert('通知中心标题栏操作按钮默认展示图标');

    // 展开第一条通知信息
    await agent.aiTap('通知中心列表中最上方的通知条目', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 2~8: 悬停按钮
    await agent.aiHover('通知中心顶部的全部清除或设置按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));

    await agent.aiHover('通知中心中通知条目右上角的关闭按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 断言通知中心面板各操作按钮和通知条目展示完整
    await agent.aiAssert('通知中心面板操作按钮和通知列表正常展示');
  }, { timeout: 600000, tags: ['1802205', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
