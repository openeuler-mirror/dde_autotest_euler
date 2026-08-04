
/**
 * 用例 PMSID: 1801347
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】修改自定义快捷键冲突时，取消修改
 * 生成时间: 2026-04-21 09:16:26
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801347-【控制中心】【设备】【键盘】【快捷键】修改自定义快捷键冲突时，取消修改', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system ,env}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
    // 添加自定义快捷键：深度影音
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影音" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
  });

  test('1801347-【控制中心】【设备】【键盘】【快捷键】修改自定义快捷键冲突时，取消修改', async ({ device, agent, uos, system, env }) => {
    // 步骤1：打开控制中心,点击编辑按钮，修改快捷键为Super+L
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:20});
    await agent.aiTap("自定义快捷键区域的编辑按钮",{ deepThink: true });
    await agent.aiTap("Super H右侧铅笔图标",{ deepThink: true });
    await agent.aiTap("快捷键右侧:Super H");
    await device.pressKey("super", "L");
    
    // 检查：验证冲突提示文案
    await agent.aiAssert("文案显示：此快捷键与[锁屏界面]冲突，点击保存使这个快捷键生效");
    
    // 步骤2：点击取消按钮
    await agent.aiTap("取消");
    await agent.aiWaitFor("修改自定义快捷键弹窗已关闭");
    
    // 检查：取消自定义快捷键修改
    await agent.aiAssert("前处于快捷键设置的自定义页面，页面存在完成按钮");
    await agent.aiTap("完成");
    
    // 步骤3：检查自定义快捷键深度影音显示
    await agent.aiAssert("深度影音快捷键右侧显示为Super H");
    
    // 步骤4：使用快捷键Super+H，打开深度影音应用
    await device.pressKey("super", "H");
    await agent.aiWaitFor("显示默认的播放占位图标");
    await uos.closeCurrentWindow();
    
    // 步骤5：检查锁屏界面快捷键显示
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'up',distance:10});
    await agent.aiAssert("锁屏快捷键显示为Super L");
    
    // 步骤6：使用快捷键Super+L，显示锁屏界面
    await device.pressKey("super", "L");
    await agent.aiWaitFor("锁屏界面已显示");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

  }, { timeout: 600000, tags: ['1801347', 'level3'] });

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