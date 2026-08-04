/**
 * 用例 PMSID: 1801343
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】重置修改后的自定义冲突快捷键
 * 生成时间: 2026-04-21 09:17:31
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801343-【控制中心】【设备】【键盘】【快捷键】重置修改后的自定义冲突快捷键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 新建深度影音快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("窗口右下角：添加快捷键",{ deepThink: true });
    await agent.aiTap("名称下方：必填");
    await device.typeText("深度影音");
    await agent.aiTap("命令下方：必填");
    await device.typeText("/usr/bin/ll-cli run org.deepin.movie");
    await agent.aiTap("添加自定义快捷键窗口下方快捷键右侧:无",{ deepThink: true });
    await device.pressKey("Super", "L");
    await agent.aiTap("添加",{ deepThink: true });
  });

  test('1801343-【控制中心】【设备】【键盘】【快捷键】重置修改后的自定义冲突快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：点击恢复默认按钮
    await agent.aiTap("恢复默认按钮");
    
    // 检查：验证重置结果
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:5});
    await agent.aiAssert("锁屏界面快捷键右侧显示:Super+L");
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:15});
    await agent.aiAssert("自定义快捷键中深度影院快捷键显示:无");

  }, { timeout: 600000, tags: ['1801343', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 删除深度影音快捷键，恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
