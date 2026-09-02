/**
 * 用例 PMSID: 1801231
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】快捷键搜索框可以清空输入内容
 * 生成时间: 2026-05-07
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801231-【控制中心】【设备】【键盘】【快捷键】快捷键搜索框可以清空输入内容', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：恢复默认快捷键设置，确保测试环境干净
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801231-【控制中心】【设备】【键盘】【快捷键】快捷键搜索框可以清空输入内容', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，进入键盘快捷键设置界面
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");

    // 步骤2：点击搜索框，验证进入输入状态
    await agent.aiTap("快捷键搜索框");
    await agent.aiAssert("搜索图标显示在搜索框的最左端");

    // 步骤3：输入测试文字，验证清除图标显示
    await device.typeText("test");
    await agent.aiAssert("清除图标按钮已显示");

    // 步骤4：点击清除图标按钮，验证搜索框内容被清空
    await agent.aiTap("清除图标按钮");
    await agent.aiAssert("搜索框内无文字");
  }, { timeout: 600000, tags: ['1801231', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 后置清理：关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});