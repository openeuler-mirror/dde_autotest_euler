/**
 * 用例 PMSID: 2023625
 * 用例标题: 【V25】【Visual Studio Code】软件下载安装
 * 生成时间: 2026-08-03 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2023625-【V25】【Visual Studio Code】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化卸载Visual Studio Code软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
    await system.exec(uninstallCmd);
  });

  test('2023625-【V25】【Visual Studio Code】软件下载安装', async ({ device, agent, uos }) => {
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
    await agent.aiAssert("桌面出现Visual Studio Code图标");
  }, { timeout: 1000000, tags: ['2023625', 'level1', 'smoke'] });

  afterEach(async ({ uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
