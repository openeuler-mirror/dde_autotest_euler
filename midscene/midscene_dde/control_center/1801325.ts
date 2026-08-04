
/**
 * 用例 PMSID: 1801325
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】修改系统快捷键
 * 生成时间: 2026-04-21 19:49:43
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801325-【控制中心】【设备】【键盘】【快捷键】修改系统快捷键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801325-【控制中心】【设备】【键盘】【快捷键】修改系统快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，点击显示桌面的快捷键 Super+D
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("显示桌面右侧:Super D");
    await agent.aiAssert("快捷键编辑框内显示文案为:请输入新的快捷键");
    
    // 步骤2：在快捷键编辑框中按下键盘ALT+D
    await device.pressKey("Alt", "D");
    await agent.aiAssert("显示桌面右侧显示为：Alt D");
    
    // 步骤3：使用快捷键ALT+D，显示桌面快捷键生效
    await device.pressKey("Alt", "D");
    await agent.aiAssert("显示桌面，桌面不存在搜索快捷键文案");
  
    // 步骤4：使用快捷键Super+D，没有响应
    await agent.aiTap("桌面下方任务栏上的齿轮图标",{ deepThink: true });
    await device.pressKey("Super", "D");
    await agent.aiAssert("存在搜索快捷键文案");
  }, { timeout: 600000, tags: ['1801325', 'level3'] });

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
