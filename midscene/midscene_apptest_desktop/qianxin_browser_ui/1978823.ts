/**
 * 用例 PMSID: 1978823
 * 用例标题: 【V25】【奇安信可信浏览器】打开新的无痕窗口
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-02-13 16:38:03
 */

describe('1978823-【V25】【奇安信可信浏览器】打开新的无痕窗口', () => {
  beforeAll(async ({ device, uos, agent ,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.qianxin.browser-stable`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现奇安信可信浏览器图标', {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1978823-【V25】【奇安信可信浏览器】打开新的无痕窗口', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await agent.aiAssert("奇安信可信浏览器已打开");
    await uos.maximizeWindow();
    try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }
    await agent.aiTap("浏览器右侧图标三", { deepThink: true });
    await agent.aiWaitFor("打开新的无痕窗口");
    await agent.aiTap("打开新的无痕窗口菜单")
    await agent.aiWaitFor("您已进入无痕模式")
    
  }, { timeout: 1000000, tags: ['1978823', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
  
    await uos.closeCurrentWindow();
    // await agent.aiTap('确定', { deepThink: true });
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
