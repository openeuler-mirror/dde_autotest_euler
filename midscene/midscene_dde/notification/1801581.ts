/**
 * 用例 PMSID: 1801581
 * 用例标题: 【通知中心】没有新通知信息，通知横幅区域展示在任务栏托盘区或插件区右键或左键菜单下层
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801581-【通知中心】没有新通知信息，通知横幅区域展示在任务栏托盘区或插件区右键或左键菜单下层', () => {
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

  test('1801581-通知横幅展示在任务栏菜单下层', async ({ device, agent, system }) => {
    console.log('步骤1: 发送3个应用各2条常驻通知');
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -t 0 "应用${i}" "应用${i}的第1条常驻通知"`);
      await delay(300);
      await system.exec(`notify-send -t 0 "应用${i}" "应用${i}的第2条常驻通知"`);
      await delay(300);
    }
    await delay(2000);

    console.log('步骤2: 打开通知中心确认常驻通知已存在，再关闭');
    await device.pressKey('super', 'm');
    await delay(1000);
    await agent.aiAssert('通知中心中存在通知,通知中心上方存在悬浮的多条常驻通知');
    await device.pressKey('super', 'm');
    await delay(500);
    await system.exec('DISPLAY=:0 XDG_RUNTIME_DIR=/run/user/1000 XAUTHORITY=/home/uos/.Xauthority xdotool key super+d');
    await delay(500);

    console.log('步骤3: 左键点击任务栏音量图标，断言快捷面板遮挡横幅');
    await agent.aiTap('任务栏音量图标', { deepThink: true });
    await delay(1000);
    await agent.aiAssert('右下方显示的常驻通知横幅有部分被快捷面板遮挡，快捷面板下方的功能按钮区域完全展示出来');
    await device.pressKey('super', 'D');
    await delay(500);

    console.log('步骤4: 右键点击任务栏音量图标，断言右键菜单遮挡横幅');
    await agent.aiRightClick('任务栏音量图标', { deepThink: true });
    await delay(1000);
    await agent.aiAssert('右下方显示的常驻通知横幅有部分被右键菜单遮挡');
    await device.pressKey('Escape');
    await delay(500);
  }, { timeout: 300000, tags: ['1801581', 'level3'] });

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