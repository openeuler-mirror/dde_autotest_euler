/**
 * 用例 PMSID: 1801281
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】快捷键搜索结果中修改快捷键
 * 生成时间: 2026-05-07
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801281-【控制中心】【设备】【键盘】【快捷键】快捷键搜索结果中修改快捷键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：恢复默认快捷键设置，确保测试环境干净
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801281-【控制中心】【设备】【键盘】【快捷键】快捷键搜索结果中修改快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，进入键盘快捷键设置界面
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");

    // 步骤2：在搜索框输入"终端"，验证搜索结果
    await agent.aiTap("快捷键搜索框");
    await device.typeText("终端");
    await agent.aiAssert("搜索结果界面显示：终端");
    await agent.aiAssert("搜索结果界面显示：终端雷神模式");

    // 步骤3：在搜索结果中修改终端快捷键为Super+K
    await agent.aiTap("终端右侧:ctrl alt T");
    await device.pressKey("Super", "K");
    await agent.aiAssert("终端右侧显示：Super K");

    // 步骤4：退出搜索模式后重新搜索，验证修改生效
    await device.pressKey("Escape");
    await agent.aiTap("快捷键搜索框");
    await device.typeText("终端");
    await agent.aiAssert("终端右侧显示：Super K");
  }, { timeout: 600000, tags: ['1801281', 'level3'] });

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