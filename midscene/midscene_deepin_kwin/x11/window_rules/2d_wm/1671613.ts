/**

 * 用例 PMSID: 1671613
 * 用例标题：点击Dock栏窗口预览右上角"x"按钮，关闭窗口
 * 生成时间: 2026-01-14 11:35:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671613-点击Dock栏窗口预览右上角"x"按钮，关闭窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671613-点击Dock栏窗口预览右上角"x"按钮，关闭窗口', async ({ device, agent, uos, system }) => {
    // 前置条件：桌面打开控制中心、终端、文件管理器应用窗口
    await system.exec('killall deepin-terminal');
    
    await uos.openApp("控制中心");
    // await agent.aiWaitFor("控制中心窗口已打开");
    await agent.aiWaitFor("系统设置窗口已打开");

    await device.pressKey("Ctrl", "Alt", "T");
    await agent.aiWaitFor("终端窗口已打开");

    await device.pressKey("Super", "E");
    await agent.aiWaitFor("文件管理器窗口已打开");

    // 步骤1：鼠标hover到任务栏终端应用图标上，图标上方出现窗口预览，点击窗口预览右上角"X"按钮
    await agent.aiHover("任务栏终端图标", { deepThink: true });
    await agent.aiWaitFor("终端窗口预览显示在图标上方");
    await agent.aiHover("终端窗口的预览图", { deepThink: true });
    await agent.aiTap("终端窗口预览图右侧的X关闭按钮", { deepThink: true });
    
    // 预期结果1：终端应用窗口被关闭，控制中心、文件管理器窗口在桌面显示正常
    await agent.aiAssert("终端应用窗口已被关闭");
    await agent.aiAssert("文件管理器窗口在桌面显示正常");

    // 步骤2：鼠标hover到任务栏文件管理器应用图标上，图标上方出现窗口预览，点击窗口预览右上角"X"按钮
    await agent.aiHover("任务栏文件管理器图标");
    await agent.aiWaitFor("文件管理器窗口预览显示在图标上方");
    await agent.aiHover("文件管理器窗口的预览图", { deepThink: true });
    await agent.aiTap("文件管理器窗口预览图右侧的X关闭按钮", { deepThink: true });
    
    // 预期结果2：文件管理器应用窗口被关闭，控制中心窗口在桌面显示正常
    await agent.aiAssert("文件管理器应用窗口已被关闭");
    // await agent.aiAssert("控制中心窗口在桌面显示正常");
    await agent.aiAssert("系统设置窗口在桌面显示正常");
    
  }, { timeout: 600000, tags: ['1671613', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-control-center');
    await system.exec('killall dde-file-manager');
    //AI有时候会点错成商店，所以再杀一下
    await system.exec('killall deepin-home-appstore-client');
    await uos.setWindowEffect("最佳视觉");
  });
});