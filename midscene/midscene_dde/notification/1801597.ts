/**
 * 用例 PMSID: 1801597
 * 用例标题: 【通知中心】默认配置，非常驻通知，5秒后通知横幅消失，进入通知中心常驻区域
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801597-【通知中心】默认配置，非常驻通知，5秒后通知横幅消失，进入通知中心常驻区域', () => {
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

  test('1801597-【通知中心】默认配置，非常驻通知，5秒后通知横幅消失，进入通知中心常驻区域', async ({ device, agent, system }) => {
    await system.exec('notify-send "测试通知" "这是一条非常驻通知"');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('屏幕上显示通知横幅，内容包含"这是一条非常驻通知"');

    await new Promise(resolve => setTimeout(resolve, 20000));
    await agent.aiAssert('屏幕上不存在内容为"这是一条非常驻通知"的通知横幅，横幅已自动消失');

    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('通知中心中存在通知，且显示内容包含"这是一条非常驻通知"');
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 500));
  }, { timeout: 300000, tags: ['1801597', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin.dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});