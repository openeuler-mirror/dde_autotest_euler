
/**
 * 用例 PMSID: 1910355
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改自定义快捷键为同一快捷键，检查界面显示
 * 生成时间: 2026-02-04 20:47:10
 * 用例编写人:UT005571(王艺桥)
 */

describe('1910355-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改自定义快捷键为同一快捷键，检查界面显示', () => {
  beforeAll(async ({ device, uos, agent ,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 添加自定义快捷键：深度影音
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影院" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
  });

  beforeEach(async ({ device, agent,uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建自定义快捷键，名称为深度影院
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
  });

  test('1910355-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改自定义快捷键为同一快捷键，检查界面显示', async ({ device, agent, uos }) => {
    // 步骤 1： 修改快捷键为super H
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:30});
    await agent.aiAssert("自定义快捷键下方显示有：深度影院，深度影院右侧显示：Super H");
    await agent.aiTap("深度影院右侧:super H",{ deepThink: true });
    await device.pressKey("Super", "H");

    // 检查 ：正常修改，无冲突提示
    await agent.aiAssert("自定义快捷键下方显示有：深度影院，深度影院右侧显示：Super H");

  }, { timeout: 600000, tags: ['1910355', 'level3'] });

  afterEach(async ({ device,agent,uos,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
// 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    
    // 删除自定义快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影院"`);
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
