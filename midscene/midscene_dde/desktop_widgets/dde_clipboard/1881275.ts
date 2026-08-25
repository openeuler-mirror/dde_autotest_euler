
/**
 * 用例 PMSID: 1881275
 * 用例标题: 【桌面】【剪贴板】任务栏位置在左或右时，打开剪贴板展示正常
 * 生成时间: 2025-12-22 14:20:24
 * 用例编写人：UT000224(何权)
 */

describe('1881275-【桌面】【剪贴板】任务栏位置在左或右时，打开剪贴板展示正常', () => {
  beforeAll(async ({ device, uos, agent , system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1881275-【桌面】【剪贴板】任务栏位置在左或右时，打开剪贴板展示正常', async ({ device, agent, uos, system }) => {
    //设置经典模式
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:1`
    );
    //设置任务栏位置在左
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:3`
    );
    //打开任务栏
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("文剪贴板界面展示正常，窗口无遮挡）");

    //设置居中模式
     await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:0`
    );

    //重新打开剪切板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("文剪贴板界面展示正常，窗口无遮挡");

    //设置任务栏位置在右
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:1`
    );

    //打开任务栏检查遮挡
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("文剪贴板界面展示正常，窗口无遮挡");

    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
    //设置成经典模式
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:1`
    );

    //打开任务栏检查遮挡
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("文剪贴板界面展示正常，窗口无遮挡");

  }, { timeout: 1200000, tags: ['1881275', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:1`
    );
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`
    );
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
  });
});
