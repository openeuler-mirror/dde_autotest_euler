
/**
 * 用例 PMSID: 1801251
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】修改自定义快捷键冲突2
 * 生成时间: 2026-03-02
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801251-【控制中心】【设备】【键盘】【快捷键】修改自定义快捷键冲突2', () => {
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

  test('1801251-【控制中心】【设备】【键盘】【快捷键】修改自定义快捷键冲突2', async ({ device, agent, uos }) => {
    // 步骤 1: 编辑深度影音      
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiTap("自定义右边的编辑");
    await agent.aiTap("Super H右边的铅笔图标",{ deepThink: true });

    // 检查: 显示修改自定义快捷键弹窗
    await agent.aiAssert("显示修改自定义快捷键弹窗");

    // 步骤 2: 修改快捷键为Super L
    await agent.aiTap("Super H");
    await device.pressKey("Super", "L");

     // 检查: 提示快捷键冲突
    await agent.aiAssert("此快捷键与[锁屏界面]冲突，点击保存使这个快捷键生效");

    // 步骤 3: 修改快捷键为Super L，点击保存
    await agent.aiTap("保存");
    await agent.aiTap("自定义右侧：完成");

    // 检查: 深度影音右侧显示：Super L
    await agent.aiAssert("深度影音右侧显示Super L");

    // 步骤 4: 检查锁屏界面快捷键显示无
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'up',distance:10});
    await agent.aiAssert("锁屏界面右侧显示无");

    // 步骤 5: 使用快捷键Super H，无响应
    await device.pressKey("Super", "H");
    await agent.aiAssert("不存在深度影音窗口");
    
    // 步骤 6: 使用快捷键Super L，显示深度影音
    await device.pressKey("Super", "L");
    await new Promise(resolve => setTimeout(resolve,1000));
    await agent.aiAssert("出现窗口,窗口中间有一个带播放箭头的媒体播放图标");
    
  }, { timeout: 600000, tags: ['1801251', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭深度影音
    await system.exec(`killall deepin-movie`)

    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();

    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
