
/**
 * 用例 PMSID: 1801275
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键冲突
 * 生成时间: 2026-04-22 13:05:19
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801275-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键冲突', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
    // 添加自定义快捷键：深度影音
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影音" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
  });

  test('1801275-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键冲突', async ({ device, agent, uos, system }) => {
    // 步骤1：点击控制中心-蓝牙和其他设备-键盘-通用，点击菜单项中的快捷键-自定义快捷键分类区域，点击自定义快捷中快捷键区域-输入框内键入Super+L后保存
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:30});
    await agent.aiTap("深度影音右侧的：Super H");
    await device.pressKey("Super", "L");
    await agent.aiAssert("此快捷键与[锁屏界面]冲突，点击取消或替换 提示文案显示");
    
    // 步骤2：点击提示快捷键冲突文案中的点击替换按钮
    await agent.aiTap("冲突提示中的替换按钮");
    await agent.aiAssert("深度影音右侧显示为Super L");
    
    // 步骤3：检查系统分类中锁屏界面快捷键显示
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'up',distance:15});
    await agent.aiAssert("锁屏界面右侧显示为：无");
    
    // 步骤4：使用快捷键super+H
    await device.pressKey("Super", "H");
    await agent.aiAssert("桌面不存在深度影音应用窗口");
    
    // 步骤5：使用快捷键Super+L
    await device.pressKey("Super", "L");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("桌面存在深度影音应用窗口");
    await uos.closeCurrentWindow();

  }, { timeout: 600000, tags: ['1801275', 'level2'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 删除深度影音快捷键，恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
