/**
 * 用例 PMSID: 1801717
 * 用例标题: 【通知中心】通知中心tab键将焦点移动到折叠通知信息上按回车键，展开该应用所有通知信息
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801717-【通知中心】通知中心tab键将焦点移动到折叠通知信息上按回车键，展开该应用所有通知信息', () => {
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

  test('1801717-【通知中心】通知中心tab键将焦点移动到折叠通知信息上按回车键，展开该应用所有通知信息', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 用两个不同的真实应用名发送通知，形成折叠信息
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '控制中心通知' '这是第${i}条控制中心通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'org.deepin.browser' '浏览器通知' '这是第${i}条浏览器通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 6000));

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 20000 });
    await agent.aiWaitFor('通知中心列表中显示通知信息', { timeoutMs: 15000 });

    // 步骤 1: 按tab键将焦点移动到折叠通知信息上，按回车键
    for (let i = 0; i < 3; i++) {
      await device.pressKey('tab');
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 检查: 展开该应用所有通知信息
    await agent.aiAssert('通知信息已成功展开或该应用通知条目内容显示完整');
  }, { timeout: 600000, tags: ['1801717', 'level3'] });

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
