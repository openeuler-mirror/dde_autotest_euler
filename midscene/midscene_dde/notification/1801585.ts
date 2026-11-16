/**
 * 用例 PMSID: 1801585
 * 用例标题: 【通知中心】没有新通知信息，锁屏页面不展示通知横幅
 * 生成时间: 2026-07-18 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801585-【通知中心】没有新通知信息，锁屏页面不展示通知横幅', () => {
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

  test('1801585-【通知中心】没有新通知信息，锁屏页面不展示通知横幅', async ({ device, agent, env, uos, system }) => {
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -t 0 "应用${i}" "应用${i}的第1条常驻通知"`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`notify-send -t 0 "应用${i}" "应用${i}的第2条常驻通知"`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('通知中心中存在多条常驻通知');
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 500));
    await uos.showDesktop();

    await device.pressKey('Super', 'L');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await agent.aiAssert('锁屏界面没有通知横幅信息展示');
  }, { timeout: 300000, tags: ['1801585', 'level3'] });

  afterEach(async ({ device, agent, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.typeAscii(env.testPassword);
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 5000));
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
