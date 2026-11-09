/**
 * 用例 PMSID: 2023627
 * 用例标题: 【V25】【Visual Studio Code】软件卸载
 * 生成时间: 2026-08-03 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2023627-【V25】【Visual Studio Code】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 清理可能残留的软件，确保从干净状态开始
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
    await system.exec(uninstallCmd);
    // 通过应用商店安装，确保软件出现在应用管理中
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await agent.aiInput('visual studio', '搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果包含Visual Studio Code应用", {
      timeoutMs: 180000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap("visual studio条目右侧第一个安装按钮");
    await agent.aiWaitFor('Visual Studio Code条目右侧打开按钮已显示', {
      timeoutMs: 1800000,
      checkIntervalMs: 5000,
    });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
  });

  test('2023627-【V25】【Visual Studio Code】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('Visual Studio Code', '搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果出现Visual Studio Code应用", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await agent.aiTap("Visual Studio Code条目右侧第一个卸载按钮");
    await agent.aiWaitFor("Visual Studio Code条目右侧显示已卸载", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有Visual Studio Code图标");
    await uos.openLauncher();
    await uos.searchInLauncher('Visual Studio Code');
    await agent.aiAssert("启动器搜索结果中不存在Visual Studio Code应用图标");
  }, { timeout: 600000, tags: ['2023627', 'level1', 'smoke'] });

  afterEach(async ({ uos }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
