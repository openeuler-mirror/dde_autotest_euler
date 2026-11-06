/**
 * 用例 PMSID: 2024411
 * 用例标题: 【V25】【向日葵企业版客户端】软件卸载
 * 生成时间: 2026-08-04 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2024411-【V25】【向日葵企业版客户端】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装向日葵企业版客户端软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.oray.sunlogin.enterprise`;
    await system.exec(installCmd);
    await uos.openLauncher();
    await uos.searchInLauncher('向日葵客户端');
    await agent.aiWaitFor('出现"向日葵客户端"图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await uos.closeCurrentWindow();
  });

  test('2024411-【V25】【向日葵企业版客户端】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('向日葵客户端', '搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果出现向日葵企业版客户端应用", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await agent.aiTap("'向日葵客户端'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'向日葵客户端'条目右侧显示已卸载", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有向日葵企业版客户端图标");
    await uos.openLauncher();
    await agent.aiInput('向日葵客户端', '搜索框');
    await agent.aiAssert("不存在向日葵企业版客户端应用图标");
  }, { timeout: 600000, tags: ['2024411', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.oray.sunlogin.enterprise`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
