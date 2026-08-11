
/**
 * 用例 PMSID: 1801385
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】添加快捷键
 * 生成时间: 2026-01-29 20:53:33
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801385-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】添加快捷键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801385-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】添加快捷键', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心-蓝牙和其他设备-键盘-快捷键，添加快捷键
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("窗口右下角：添加快捷键");

    // 检查: 显示添加自定义快捷键窗口
    await agent.aiAssert("显示添加自定义快捷键窗口");
    await agent.aiAssert("从上至下依次显示：名称\n必填\n命令\n必填\n快捷键\n底部显示取消和添加按钮");

    // 步骤 2: 输入自定义快捷键名称，命令，快捷键
    await agent.aiTap("名称下方：必填");
    await device.typeText("深度影音");
    await agent.aiTap("命令下方：必填");
    await device.typeText("/usr/bin/ll-cli run org.deepin.movie");
    await agent.aiTap("添加自定义快捷键窗口下方快捷键右侧:无",{ deepThink: true });
    await device.pressKey("Super", "Q");
    await agent.aiTap("添加");
    // 检查: 显示添加自定义快捷键窗口
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiAssert("深度影音右侧显示：Super Q");

    // 步骤 3: 使用自定义快捷键Super+Q
    await device.pressKey("Super", "Q");
    await agent.aiAssert("出现窗口");

    // 关闭影音窗口
    await device.pressKey("Alt", "F4");


  }, { timeout: 600000, tags: ['1801385', 'level2'] });

  afterEach(async ({ device,uos,agent,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //关闭控制中心
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 删除深度影音快捷键，恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
