/**
 * 用例 PMSID: 1801567
 * 用例标题: 【通知中心】默认配置，通知横幅展示边距符合设计要求
 * 生成时间: 2026-07-18 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801567-【通知中心】默认配置，通知横幅展示边距符合设计要求', () => {
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

  test('1801567-默认配置通知横幅展示边距正常', async ({ device, uos, agent, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await system.exec('notify-send -t 0 "通知边距测试" "通知边距测试内容"');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await agent.aiAssert('通知横幅区域展示正常，无异常');
  }, { timeout: 300000, tags: ['1801567', 'level1', 'smoke'] });

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
