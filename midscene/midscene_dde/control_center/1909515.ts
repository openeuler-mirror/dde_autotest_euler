
/**
 * 用例 PMSID: 1909515
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改自定义快捷键名称和命令，取消修改
 * 生成时间: 2026-02-04 20:49:19
 * 用例编写人:UT005571(王艺桥)
 */

describe('1909515-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改自定义快捷键名称和命令，取消修改', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 添加自定义快捷键：深度影院
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影院" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
  });

  test('1909515-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改自定义快捷键名称和命令，取消修改', async ({ device, agent, uos }) => {
    // 步骤 1: 修改快捷键名称
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");

    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiTap("自定义右侧:编辑",{ deepThink: true });
    await agent.aiTap("Super H右侧:铅笔图标",{ deepThink: true });
    await agent.aiTap("名称下方的：深度影院");
    await device.pressKey("Ctrl", "A");
    await device.pressKey("Del");
    await device.typeText("测试");

    // 检查：名称下方为测试
    await agent.aiAssert("名称下方为：测试");

    // 步骤 2: 修改命令
    await agent.aiTap("/usr/bin/ll-cli run org.deepin.movie");
    await device.pressKey("Ctrl", "A");
    await device.pressKey("Del");
    await device.typeText("dde-control-center -s");
    await agent.aiTap("测试");

    // 检查：命令下方为dde-control-center -s
    await agent.aiAssert("命令下方为:dde-control-center-s",{ deepThink: true });

    // 步骤 3: 取消修改名称和命令
    await agent.aiTap("取消");

    // 检查：显示原有名称
    await agent.aiAssert("自定义下方显示有:深度影院, 深度影院右侧显示:Super H");

    // 步骤 4:再次点击快捷键编辑按钮
    await agent.aiTap("Super H右侧:铅笔图标",{ deepThink: true });

    // 检查：名称和命令
    await agent.aiAssert("名称下方显示：深度影院，命令下方显示：/usr/bin/ll-cli run org.deepin.movie");

  }, { timeout: 600000, tags: ['1909515', 'level3'] });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭修改自定义快捷键弹窗
    await agent.aiTap("取消");

    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    
    // 删除自定义快捷键：深度影院
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影院"`);

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
