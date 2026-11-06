/**
 * 用例 PMSID: 2034169
 * 用例标题: 【V25】【玲珑】【格式工厂】帮助菜单
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034169- 【V25】【玲珑】【格式工厂】帮助菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install com.pcfreetime.formatfactory.deepin`;
    await system.exec(installCmd);
  });

  test('2034169- 【V25】【玲珑】【格式工厂】帮助菜单', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('格式工厂');

    await agent.aiWaitFor('启动器搜索结果中已显示格式工厂应用图标', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await device.pressKey('Enter');
    await agent.aiWaitFor('格式工厂主界面已显示', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });
    await agent.aiAssert("界面存在'主页'按钮");

    await agent.aiAssert("界面存在'帮助'菜单");
    await agent.aiTap("帮助菜单");
    await agent.aiAssert("下拉菜单存在'更新历史'按钮");

    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2034169', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const killCmd = `pkill -f 'com.pcfreetime.formatfactory.deepin'`;
    await system.exec(killCmd);
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.pcfreetime.formatfactory.deepin`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
