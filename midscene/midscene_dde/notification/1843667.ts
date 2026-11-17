/**
 * 用例 PMSID: 1843667
 * 用例标题: 【通知中心】传入通知icon图标尺寸单边小于24*24，通知横幅展示icon图标等比缩放最长一边为24，另一个边根据比例等比缩小
 * 生成时间: 2026-09-09 09:00:00
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1843667-【通知中心】传入通知icon图标尺寸单边小于24*24，通知横幅展示icon图标等比缩放最长一边为24，另一个边根据比例等比缩小', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const iconPath = '/tmp/test_icons/icon_16x48.png';
  const iconUri = `file://${iconPath}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await system.exec('python3 ' + caseDir + 'midscene_dde/common/gen_test_icons.py');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1843667-【通知中心】传入通知icon图标尺寸单边小于24*24，通知横幅展示icon图标等比缩放最长一边为24，另一个边根据比例等比缩小', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 传入16x48(单边小于24*24：宽16<24，高48>24)的icon图标，通知横幅应展示为最长边24的等比缩放
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "iconsize-test" 0 "${iconPath}" "图标尺寸测试通知" "传入图标16*48(单边小于24*24)，横幅icon等比缩放最长边为24" "[]" '{"urgency": <byte 1>, "image-path": <"${iconUri}">}' 30000`);
    await agent.aiWaitFor('桌面右下角出现一条通知横幅，标题为"图标尺寸测试通知"', { timeoutMs: 20000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await agent.logScreenshot('通知横幅icon图标尺寸-传入16x48单边小于24');
    await agent.aiAssert('通知横幅左上角显示了一个小的应用图标icon，该icon图标最长的一边为24，另一个边根据比例等比缩小，图标大小适中不会过大', { deepThink: true });
  }, { timeout: 600000, tags: ['1843667', 'level4'] });

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
