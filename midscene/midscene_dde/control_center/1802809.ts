/**
 * 用例 PMSID: 1802809
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】编辑自定义快捷键后，检查自定义列表显示
 * 生成时间: 2026-02-10 19:50:33
 * 用例编写人:UT005571(王艺桥)
 */

describe('1802809-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】编辑自定义快捷键后，检查自定义列表显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 添加自定义快捷键：深度影院
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影院" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
    
  });

  test('1802809-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】编辑自定义快捷键后，检查自定义列表显示', async ({ device, agent, uos }) => {
    // 步骤 1: 编辑自定义快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiTap("自定义右侧：编辑");

    // 检查：快捷键处于编辑状态，编辑按钮显示为完成
    await agent.aiAssert("自定义右侧显示：完成");
    await agent.aiAssert("深度影院右侧显示:Super H,铅笔图标,垃圾桶图标");

    // 步骤 2: 修改自定义快捷键名称和快捷键
    await agent.aiTap("Super H右侧:铅笔图标",{ deepThink: true });
    await agent.aiTap("深度影院");
    await device.pressKey("Ctrl", "A");
    await device.pressKey("Del");
    await device.typeText("测试");
    await agent.aiTap("Super H",{ deepThink: true });
    await device.pressKey("Super", "K");
    await agent.aiTap("保存");

    // 检查: 快捷键处于编辑状态
    await agent.aiAssert("自定义右侧显示：完成");
    await agent.aiAssert("测试右侧显示:Super K,铅笔图标,垃圾桶图标");

  }, { timeout: 600000, tags: ['1802809', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    
    // 删除自定义快捷键：测试；该快捷键id是：深度影院
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影院"`);
      
});

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
