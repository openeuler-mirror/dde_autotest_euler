/**
 * 用例 PMSID: 1801595
 * 用例标题: 【通知中心】常驻通知，不手动操作不会消失
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801595-【通知中心】常驻通知，不手动操作不会消失', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('确保任务栏在底部');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801595-常驻通知10秒后横幅未消失', async ({ device, agent, system }) => {
    await system.exec('notify-send -t 0 "常驻通知" "这条通知不会自动消失"');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await new Promise(resolve => setTimeout(resolve, 10000));

    await agent.aiAssert('通知横幅仍然显示，内容包含"常驻通知"');
  }, { timeout: 300000, tags: ['1801595', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
