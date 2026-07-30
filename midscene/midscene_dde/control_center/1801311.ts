/**
 * 用例 PMSID: 1801311
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】已添加自定义快捷键后恢复默认值
 * 生成时间: 2026-05-07
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801311-【控制中心】【设备】【键盘】【快捷键】已添加自定义快捷键后恢复默认值', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：恢复默认快捷键设置，添加自定义快捷键"深度影院"
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影院" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>Z"`);
  });

  test('1801311-【控制中心】【设备】【键盘】【快捷键】已添加自定义快捷键后恢复默认值', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，进入键盘快捷键设置界面，找到自定义快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:20});
    await agent.aiTap("编辑按钮");
    await agent.aiAssert("深度影院右侧显示：Super Z");

    // 步骤2：点击恢复默认按钮，验证自定义快捷键列表不变
    await agent.aiTap("恢复默认按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:20});
    await agent.aiAssert("深度影院右侧仍然显示：Super Z");
  }, { timeout: 600000, tags: ['1801311', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 后置清理：关闭控制中心窗口，删除自定义快捷键，恢复默认快捷键设置
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影院"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});