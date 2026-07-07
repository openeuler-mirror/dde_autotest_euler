/**
 * 用例 PMSID: 1801267
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】已添加多个自定义快捷键，自定义列表显示
 * 生成时间: 2026-04-30 15:00:00
 * 用例编写人:UT001707(陈慧）
 */

describe('1801267-【控制中心】【设备】【键盘】【快捷键】已添加多个自定义快捷键，自定义列表显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
    // 添加自定义快捷键：深度影音
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影音" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
    // 添加自定义快捷键：深度音乐
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度音乐" string:"/usr/bin/deepin-music" string:"<Super>Q"`);
  });

  test('1801267-【控制中心】【设备】【键盘】【快捷键】已添加多个自定义快捷键，自定义列表显示', async ({ device, agent, uos }) => {
    // 步骤1：点击控制中心-设备-键盘-通用，点击菜单项中的快捷键-检查自定义分类显示
    await uos.openApp("控制中心", {maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域', {direction: 'down', distance: 25});
    
    // 检查：辅助功能分类下方显示自定义分类，默认展开显示
    await agent.aiAssert("辅助工具分类下方显示自定义分类");
    await agent.aiAssert("自定义标题右侧显示编辑按钮");
    await agent.aiAssert("自定义列表显示已添加的快捷键");
    await agent.aiAssert("深度影音右侧显示Super H");
    await agent.aiAssert("深度音乐右侧显示Super Q");

  }, { timeout: 600000, tags: ['1801267', 'level2'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度音乐"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
