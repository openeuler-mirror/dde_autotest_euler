
/**
 * 用例 PMSID: 1963539
 * 用例标题: 【V25】【Microsoft Edge浏览器_玲珑】软件安装
 * 用例编写人:UT006345（田博文）
 * 生成时间: 2026-01-30 17:38:03
 */

describe('1963539-【V25】【Microsoft Edge浏览器_玲珑】软件安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.browser.softedge.stable`;
    await system.exec(uninstallCmd);
    const refreshCmd = `busctl --user call org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 ReloadApplications; sleep 5`;
    await system.exec(refreshCmd);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963539-【V25】【Microsoft Edge浏览器_玲珑】软件安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示");
    await agent.aiTap('应用商店顶部搜索框', { deepThink: true });
    await device.typeText('Microsoft Edge', true);
    await agent.aiWaitFor("进入搜索结果界面");
    await agent.aiTap('搜索结果中Microsoft Edge', { deepThink: true });
    const __installed = await agent.aiBoolean('应用详情页出现"打开"按钮', { timeout: 8000 });
    if (!__installed) {
      await agent.aiTap('安装');
      await agent.aiWaitFor("界面出现打开字样",{timeoutMs:240000});
    }
    await agent.aiAssert("界面出现打开字样");
  }, { timeout: 600000, tags: ['1963539', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.browser.softedge.stable`;
    await system.exec(uninstallCmd);
   
  });
});
