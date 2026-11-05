/**
 * 用例 PMSID: 2034503
 * 用例标题: 【V25】【玲珑】【chrome-谷歌浏览器】软件卸载
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034503- 【V25】【玲珑】【chrome-谷歌浏览器】软件卸载', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install cn.google.chrome`;
    await system.exec(installCmd);
    // 同步应用商店数据库，确保 Chrome 在“应用管理-已安装应用”中可见
    const syncCmd = `echo '${env.testPassword}' | sudo -S sqlite3 /var/lib/deepin-home-appstore-daemon/appstore.db "UPDATE app_install_status SET app_status='1' WHERE package_name LIKE 'cn.google.chrome%';"`;
    await system.exec(syncCmd);
  });

  test('2034503- 【V25】【玲珑】【chrome-谷歌浏览器】软件卸载', async ({ device, agent, uos, system, env }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });

    await agent.aiTap("应用管理");

    await agent.aiInput('Chrome','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果已显示", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("chrome条目右侧第一个卸载按钮");
    await agent.aiWaitFor("chrome条目右侧的已卸载", {
      timeoutMs: 600000,
      checkIntervalMs: 5000,
    });
  }, { timeout: 1200000, tags: ['2034503', 'level1', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    await uos.showDesktop();
  });
});
