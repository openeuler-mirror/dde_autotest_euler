
/**
 * 用例 PMSID: 1970499
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】打开窗口菜单快捷键功能使用
 * 生成时间: 2026-01-29 10:42:57
 * 用例编写人:UT005571(王艺桥)
 */

describe('1970499-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】打开窗口菜单快捷键功能使用', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1970499-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】打开窗口菜单快捷键功能使用', async ({ device, agent, uos }) => {
    // 步骤1： 打开控制中心，唤起菜单窗口
    await uos.openApp("控制中心",{maximizeWindow: true});
    await device.pressKey("alt", "space");
    // 检查： 控制中心左上角显示菜单窗口
    await agent.aiAssert("窗口左上角存在窗口");
    await agent.aiAssert("窗口左上角窗口显示：最小化，还原，移动等");

  }, { timeout: 600000, tags: ['1970499', 'level3'] });

  afterEach(async ({ system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`killall dde-control-center`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
