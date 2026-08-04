
/**
 * 用例 PMSID: 1801327
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】检查添加快捷键规则
 * 生成时间: 2026-04-21 19:49:04
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801327-【控制中心】【设备】【键盘】【快捷键】检查添加快捷键规则', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801327-【控制中心】【设备】【键盘】【快捷键】检查添加快捷键规则', async ({ device, agent, uos, system }) => {
    // 步骤1：点击添加快捷键按钮，输入名称和命令后，不输入快捷键，点击添加
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("添加快捷键按钮");
    await agent.aiWaitFor("添加自定义快捷键弹窗已显示");
    await agent.aiTap("名称输入框");
    await device.typeText("测试快捷键");
    await agent.aiTap("命令输入框");
    await device.typeText("echo test");
    await agent.aiTap("添加按钮");
    await agent.aiAssert("快捷键输入框显示红色底色");
    
    // 步骤2：输入包含修饰键和其他键组合的快捷键
    await agent.aiTap("快捷键右侧：无",{ deepThink: true });
    await device.pressKey("Ctrl", "T");
    await agent.aiAssert("快捷键右侧显示为Ctrl T");
    
    // 步骤3：输入Shift+Ctrl+Alt+Super+T，检查修饰键的显示顺序
    await agent.aiTap("快捷键右侧：Ctrl T",{ deepThink: true });
    await device.pressKey("shift", "ctrl", "alt", "super", "t");
    await agent.aiAssert("修饰键的显示顺序为Shift、Ctrl、Alt、Super");
    
    // 步骤4：只输入修饰键，如alt+super、ctrl+alt、shift
    await agent.aiTap("快捷键右侧：Shift、Ctrl、Alt、Super",{ deepThink: true });
    await device.pressKey("Alt", "Super");
    await agent.aiTap("添加按钮");
    await agent.aiAssert("快捷键右侧显示：无");
    
    // 步骤5：只输入非修饰键：如 A\1\UP
    await agent.aiTap("快捷键右侧：无",{ deepThink: true });
    await device.pressKey("A");
    await agent.aiTap("添加按钮");
    await agent.aiAssert("快捷键右侧显示：无");
    
    // 关闭弹窗
    await agent.aiTap("取消按钮");
  }, { timeout: 600000, tags: ['1801327', 'level3'] });

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
