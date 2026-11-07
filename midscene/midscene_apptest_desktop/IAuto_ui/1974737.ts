/**
 * 用例 PMSID: 1974737
 * 用例标题: 【V25】【IAuto绘图】【玲珑】软件卸载
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-01-30 16:38:03
 */

describe('1974737-【V25】【IAuto绘图】【玲珑】软件卸载', () => {
  beforeAll(async ({ device, uos, agent ,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install iauto.linyaps`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现IAuto绘图图标', {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1974737-【V25】【IAuto绘图】【玲珑】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('IAuto绘图','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现IAuto绘图", {
      timeoutMs: 3000000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    // await agent.aiTap("点击包格式后面的如意玲珑")
    await agent.aiTap("'IAuto绘图'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'IAuto绘图'条目右侧显示已卸载", {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有IAuto绘图");
    await uos.openLauncher();
    await agent.aiInput('IAuto绘图','搜索框');
    await agent.aiAssert("不存在IAuto绘图图标"); 
  
  }, { timeout: 1000000, tags: ['1974737', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall iauto.linyaps`;
    await system.exec(uninstallCmd);   
    await uos.closeCurrentWindow();
  });
});
