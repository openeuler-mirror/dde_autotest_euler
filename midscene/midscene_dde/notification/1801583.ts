/**
 * 用例 PMSID: 1801583
 * 用例标题: 【通知中心】有新通知信息，通知横幅区域展示在任务栏托盘区或插件区右键或左键菜单上层
 * 生成时间: 2026-08-03 17:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801583-【通知中心】有新通知信息，通知横幅区域展示在任务栏托盘区或插件区右键或左键菜单上层', () => {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  beforeAll(async ({ device, uos, agent, system }) => {
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await delay(3000);

    console.log('确保任务栏在底部');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await delay(3000);

    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801583-新通知横幅在任务栏右键菜单上层', async ({ device, uos, agent, system }) => {
    console.log('步骤1: 发送常驻通知作为前置条件');
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -t 0 "应用${i}" "应用${i}的第1条常驻通知"`);
      await delay(1000);
      await system.exec(`notify-send -t 0 "应用${i}" "应用${i}的第2条常驻通知"`);
      await delay(1000);
    }
    await delay(2000);
    await uos.showDesktop();

    console.log('步骤2: 延迟发送新通知');
    await system.exec("nohup bash -c 'sleep 5 && notify-send aaa' >/dev/null 2>&1 &");

    await delay(4000);

    console.log('步骤3: 右键点击任务栏音量图标');
    await agent.aiRightClick('任务栏音量图标', { deepThink: true });
    await delay(2000);

    console.log('步骤4: 断言新通知横幅在右键菜单上层');
    await agent.aiAssert('右下角的右键菜单（包含“静音”“声音设置”）位于最上层，新通知横幅在右键菜单的后方，被右键菜单遮挡了一部分');

    await device.pressKey('Escape');
    await delay(500);
  }, { timeout: 300000, tags: ['1801583', 'level3'] });

  afterEach(async ({ uos }) => {
    console.log('1. afterEach: 每个测试后的清理');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('恢复任务栏位置到底部');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await delay(3000);

    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await delay(3000);
    await uos.showDesktop();
  });
});