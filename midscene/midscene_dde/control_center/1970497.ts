
/**
 * 用例 PMSID: 1970497
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】打开窗口菜单快捷键检查
 * 生成时间: 2026-01-29 10:54:53
 * 用例编写人:UT005571(王艺桥)
 */

describe('1970497-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】打开窗口菜单快捷键检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1970497-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】打开窗口菜单快捷键检查', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心-蓝牙和其他设备-键盘-快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    // 检查： 打开窗口菜单快捷键展示在窗口类快捷键列表的首位
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:10});
    await agent.aiAssert("打开窗口菜单快捷键展示在窗口类快捷键列表的首位");
    await agent.aiAssert("打开窗口菜单右侧显示:Alt space");
  }, { timeout: 600000, tags: ['1970497', 'level3'] });

  afterEach(async ({ device,uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
