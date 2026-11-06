/**
 * 用例 PMSID: 1971135
 * 用例标题: 【V25】【奇安信可信浏览器】软件卸载
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-01-21 16:38:03
 */

describe('1971135-【V25】【奇安信可信浏览器】软件卸载', () => {
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

  test('1971135-【V25】【奇安信可信浏览器】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('奇安信可信浏览器','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现奇安信可信浏览器", {
      timeoutMs: 3000000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    // await agent.aiTap("点击包格式后面的如意玲珑")
    await agent.aiTap("'奇安信可信浏览器'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'奇安信可信浏览器'条目右侧显示已卸载", {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器界面搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiAssert("左侧启动器中无搜索结果"); 
  
  }, { timeout: 1000000, tags: ['1971135', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
    await uos.closeCurrentWindow();
  });
});
