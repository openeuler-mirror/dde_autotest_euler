
/**
 * 用例 PMSID: 1970501
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改打开窗口菜单快捷键为非默认值
 * 生成时间: 2026-01-29 13:30:50
 * 用例编写人:UT005571(王艺桥)
 */

describe('1970501-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】修改打开窗口菜单快捷键为非默认值', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1970501-【控制中心【蓝牙和其他设备】【键盘】【快捷键】修改打开窗口菜单快捷键为非默认值', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心-蓝牙和其他设备-键盘-快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    // 修改打开窗口菜单快捷键为：Super+H
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:10});
    await agent.aiTap("打开窗口菜单右侧:Alt space",{ deepThink: true });
    await device.pressKey("Super", "H");
    // 检查: 打开窗口菜单快捷键为：Super+H
    await new Promise(resolve => setTimeout(resolve,1000));
    await agent.aiAssert("打开窗口菜单右侧显示:Super H");

    // 步骤 2: 使用快捷键Super+H
    await device.pressKey("Super", "H");
    // 检查: 显示控制中心窗口菜单
    await agent.aiAssert("应用窗口菜单已唤出");
    await agent.aiAssert("窗口左上角窗口显示：最小化，还原，移动等");

    // 步骤 3: 恢复默认
    await agent.aiTap("蓝牙和其他设备/快捷键/键盘下方区域");
    await agent.aiTap("恢复默认");
    await new Promise(resolve => setTimeout(resolve,1000));

    // 检查: 打开窗口菜单快捷键显示
    await agent.aiAssert("打开窗口菜单右侧显示:Alt space");

    // 步骤 4: 使用Spuper+H
    await device.pressKey("Super", "H");

    // 检查: 无响应，无弹出窗口
    await agent.aiAssert("窗口左侧显示有：搜索框，系统网络等");

    // 步骤 5: 使用快捷键Alt+space
    await device.pressKey("Alt", "space");

    // 检查: 显示控制中心窗口菜单
    await agent.aiAssert("窗口左上角窗口显示：最小化，还原，移动等");

    //关闭窗口菜单
    await agent.aiTap("蓝牙和其他设备/快捷键/键盘下方区域");

  }, { timeout: 600000, tags: ['1970501', 'level3'] });

  afterEach(async ({ device,uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
