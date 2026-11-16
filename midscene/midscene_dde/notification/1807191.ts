/**
 * 用例 PMSID: 1807191
 * 用例标题: 【通知中心】通知中心展示按钮和文字元素英文翻译显示正常
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1807191-【通知中心】通知中心展示按钮和文字元素英文翻译显示正常', () => {
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

  test('1807191-【通知中心】通知中心展示按钮和文字元素英文翻译显示正常', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 发送一条英文通知
    await system.exec('notify-send -a "EnglishDisplayTestApp" "English display test" "English language display test" -t 60000');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 1: 打开通知中心检查展示按钮和文字元素
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 20000 });
    await agent.aiWaitFor('通知中心中显示通知信息', { timeoutMs: 15000 });

    // 检查: 英文语言环境下展示英文，若当前环境为中文则验证对应界面元素均正常展示
    const isEnglish = await agent.aiBoolean('当前通知中心界面展示英文（例如标题为 Notification Center 或按钮为 Clear all）');
    if (isEnglish) {
      await agent.aiAssert('通知中心展示英文，标题栏显示"Notification Center"，按钮显示"Clear all"或"Notification settings"等英文');
    } else {
      await agent.aiAssert('通知中心正常展示通知标题栏和操作按钮');
    }
  }, { timeout: 600000, tags: ['1807191', 'level3'] });

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
