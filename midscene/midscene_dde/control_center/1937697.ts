
/**
 * 用例 PMSID: 1937697
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键名称包含&amp;，检查冲突文案显示
 * 生成时间: 2026-01-30 17:55:00
 * 用例编写人:UT005571(王艺桥)
 */

describe('1937697-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键名称包含&amp;，检查冲突文案显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,uos,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建快捷键中存在&的快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影院&" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>K"`);
  });

  test('1937697-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键名称包含&amp;，检查冲突文案显示', async ({ device, agent, uos }) => {
    // 步骤1：修改任意快捷键为super+K：这里选择屏幕缩小：super-
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiTap("屏幕缩小快捷键右侧:super -",{ deepThink: true });
    await device.pressKey("Super", "K");
    // 检查：冲突文案显示正常
    await agent.aiAssert("文案显示：此快捷键与[深度影院&]冲突，点击取消或替换");
    

  }, { timeout: 600000, tags: ['1937697', 'level3'] });

  afterEach(async ({ device,agent,uos,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("取消",{ deepThink: true });
    // 关闭控制中心
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 清理新增的快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影院&"`);
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
