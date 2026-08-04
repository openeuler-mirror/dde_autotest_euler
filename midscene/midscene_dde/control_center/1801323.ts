
/**
 * 用例 PMSID: 1801323
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】修改系统快捷键冲突
 * 生成时间: 2026-04-21 19:52:31
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801323-【控制中心】【设备】【键盘】【快捷键】修改系统快捷键冲突', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801323-【控制中心】【设备】【键盘】【快捷键】修改系统快捷键冲突', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，点击显示工作区快捷键，输入Super+L
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("显示工作区右侧:Super S");
    await device.pressKey("Super", "L");
    
    // 检查：提示快捷键冲突
    await agent.aiAssert("此快捷键与[锁屏界面]冲突，点击取消或替换");
    
    // 步骤2：点击替换按钮
    await agent.aiTap("替换");
    
    // 步骤3：检查显示工作区快捷键显示
    await agent.aiAssert("显示工作区右侧显示：Super L");
    
    // 步骤4：使用快捷键Super+L，打开工作区预览
    await device.pressKey("Super", "L");
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("桌面右上角有：+");
    await agent.aiTap("桌面上方左边的窗口");
    
    // 步骤5：检查锁屏界面快捷键显示
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:10});
    await agent.aiAssert("锁屏界面右侧显示：无");
    
    // 步骤6：使用快捷键Super+s，没有响应
    await device.pressKey("Super", "S");
    await agent.aiAssert("桌面右上角不存在：+");
  }, { timeout: 600000, tags: ['1801323', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
