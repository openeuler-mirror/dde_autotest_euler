/**
 * 用例 PMSID: 2023643
 * 用例标题: 【V25】【Visual Studio Code】打开Go菜单
 * 生成时间: 2026-08-03 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2023643-【V25】【Visual Studio Code】打开Go菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装Visual Studio Code软件
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install com.visualstudio.code`;
    await system.exec(installCmd);
    // 安装后刷新启动器应用列表，确保启动器搜索能命中
    const refreshCmd = `busctl --user call org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 ReloadApplications; sleep 2; systemctl --user daemon-reload; systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service; sleep 6`;
    await system.exec(refreshCmd);
  });

  test('2023643-【V25】【Visual Studio Code】打开Go菜单', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('Visual Studio Code');
    await agent.aiWaitFor('启动器搜索结果中已显示Visual Studio Code应用图标', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap('启动器搜索结果中的"Visual Studio Code"应用图标');
    await agent.aiWaitFor('Visual Studio Code主界面已显示', {
      timeoutMs: 120000,
      checkIntervalMs: 5000,
    });
    await agent.aiAssert("界面存在'Visual Studio Code'");
    await agent.aiWaitFor('Go菜单可见');
    await agent.aiTap('Go菜单');

    await agent.aiAssert("界面存在'Switch'按钮");
    await agent.aiTap('屏幕中间空白处');
    await agent.aiTap('窗口右上角的关闭按钮');
    await agent.aiWaitFor("Visual Studio Code窗口已关闭", {
      timeoutMs: 30000,
      checkIntervalMs: 3000,
    });
  }, { timeout: 1200000, tags: ['2023643', 'level3'] });

  afterEach(async ({ system }) => {
    console.log('4. afterEach: 清理环境');
    await system.exec("pkill -f 'll-cli run com.visualstudio.code' 2>/dev/null || true");
  });

  afterAll(async ({ uos, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.visualstudio.code`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
