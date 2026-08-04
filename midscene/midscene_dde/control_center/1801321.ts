/**
 * 用例 PMSID: 1801321
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】清除系统快捷键
 * 生成时间: 2026-05-07
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801321-【控制中心】【设备】【键盘】【快捷键】清除系统快捷键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：恢复默认快捷键设置，确保测试环境干净
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801321-【控制中心】【设备】【键盘】【快捷键】清除系统快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，进入键盘快捷键设置界面
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");

    // 步骤2：使用Delete键清除显示工作区快捷键
    await agent.aiTap("显示工作区右侧Super S");
    await device.pressKey("Delete");
    await agent.aiAssert("显示工作区右侧显示：无");

    // 步骤3：验证清除后的快捷键不再生效
    await device.pressKey("Super", "S");
    await agent.aiAssert("桌面右上角不存在+");

    // 步骤4：重新设置快捷键为Super+S，验证恢复正常使用
    await agent.aiTap("显示工作区右侧无");
    await device.pressKey("Super", "S");
    await agent.aiAssert("显示工作区右侧显示：Super S");
  }, { timeout: 600000, tags: ['1801321', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 后置清理：关闭控制中心窗口，恢复默认快捷键设置
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});