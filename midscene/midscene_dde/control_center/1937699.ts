
/**
 * 用例 PMSID: 1937699
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键名称为长字符串，检查快捷键显示
 * 生成时间: 2026-01-30 17:52:02
 * 用例编写人:UT005571(王艺桥)
 */

describe('1937699-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键名称为长字符串，检查快捷键显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,uos,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建长字符串的快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
  });

  test('1937699-【控制中心【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键名称为长字符串，检查快捷键显示', async ({ device, agent, uos }) => {
    // 步骤1：切换至自定义快捷键处，检查自定义长字符串快捷键显示
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiAssert("文本显示正常，文本无重叠");
    await agent.aiAssert("测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试右侧显示：Super H");

  }, { timeout: 600000, tags: ['1937699', 'level3'] });

  afterEach(async ({ device,agent,uos,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 清理新增的快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试"`);
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
