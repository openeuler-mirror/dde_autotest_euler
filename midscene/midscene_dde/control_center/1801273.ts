
/**
 * 用例 PMSID: 1801273
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】编辑自定义快捷键
 * 生成时间: 2026-04-22 13:06:31
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801273-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】编辑自定义快捷键', () => {
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

  test('1801273-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】编辑自定义快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：点击控制中心-蓝牙和其他设备-键盘-通用，点击菜单项中的快捷键-滑动快捷键列表至自定义快捷键分类区域，点击编辑按钮
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:30});
    await agent.aiTap("编辑按钮");
    await agent.aiAssert("深度影音右侧依次显示：Super H、铅笔按钮、垃圾桶按钮");
    
    // 步骤2：点击自定义的快捷键右侧的修改按钮
    await agent.aiTap("深度影音右侧的铅笔按钮");
    await agent.aiAssert("修改自定义快捷键弹窗已显示");
    
    // 步骤3：修改自定义快捷键弹框中，修改快捷键的名称为test，点击快捷键后在快捷键输入框中键入super+k，点击保存按钮
    await agent.aiTap("名称输入框");
    await device.pressKey("Ctrl", "A");
    await device.typeText("test");
    await agent.aiTap("修改自定义窗口上的：Super H");
    await device.pressKey("Super", "K");
    await agent.aiTap("保存按钮");
    
    // 步骤4：快捷键界面，检查自定义快捷键显示
    await agent.aiAssert("test右边显示Super K");
    
    // 步骤5：使用快捷键super+k
    await device.pressKey("Super", "K");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("桌面存在窗口，窗口上有播放按钮");
    await uos.closeCurrentWindow();

    // 步骤6：使用快捷键super+H
    await device.pressKey("Super", "H");
    await agent.aiAssert("桌面不存在深度影音窗口");

  }, { timeout: 600000, tags: ['1801273', 'level2'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 删除自定义快捷键，恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
