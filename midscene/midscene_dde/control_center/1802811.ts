
/**
 * 用例 PMSID: 1802811
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键列表编辑状态检查
 * 生成时间: 2026-02-10 19:53:52
 * 用例编写人:UT005571(王艺桥)
 */

describe('1802811-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键列表编辑状态检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 使用DBus命令添加自定义快捷键：深度影院，音乐
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影院" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"音乐" string:"/usr/bin/ll-cli run org.deepin.music" string:"<Super>K"`);
  });

  test('1802811-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】自定义快捷键列表编辑状态检查', async ({ device, agent, uos }) => {
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
    await agent.aiAssert("音乐右侧显示:Super K,铅笔图标,垃圾桶图标");

    // 步骤 2: 点击完成
    await agent.aiTap("自定义右侧：完成");

    // 检查：快捷键退出编辑状态，自定义右侧显示编辑
    await agent.aiAssert("自定义右侧显示：编辑");
    await agent.aiAssert("深度影院右侧显示:Super H,无铅笔图标,无垃圾桶图标");

    // 步骤 3: 删除新建的快捷键
    await agent.aiTap("自定义右侧：编辑");
    await agent.aiTap("Super H右侧:垃圾桶图标",{ deepThink: true });
    await agent.aiTap("自定义右侧：完成");

    // 检查：快捷键退出编辑状态，自定义右侧显示编辑
    await agent.aiAssert("自定义右侧显示：编辑");
    await agent.aiAssert("音乐右侧显示:Super K,无铅笔图标,无垃圾桶图标");

    // 步骤 4: 修改新建的快捷键
    await agent.aiTap("自定义右侧：编辑");
    await agent.aiTap("Super K右侧:铅笔图标",{ deepThink: true });
    await agent.aiTap("音乐");
    await device.pressKey("Ctrl", "A");
    await device.pressKey("Del");
    await device.typeText("测试");
    await agent.aiTap("保存");
    await agent.aiTap("自定义右侧：完成");

    // 检查：快捷键退出编辑状态，音乐改成测试，自定义右侧显示编辑
    await agent.aiAssert("自定义右侧显示：编辑");
    await agent.aiAssert("测试右侧显示:Super K,无铅笔图标,无垃圾桶图标");

  }, { timeout: 600000, tags: ['1802811', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口，删除自定义快捷键
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    
    // 删除自定义快捷键：测试；该快捷键id是：音乐
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"音乐"`);
      
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
