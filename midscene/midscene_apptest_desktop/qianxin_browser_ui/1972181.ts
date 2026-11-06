
/**
 * 用例 PMSID: 1972181
 * 用例标题: 【V25】【奇安信可信浏览器】软件下载安装
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2025-01-21 15:40:28
 */

describe('1972181-【V25】【奇安信可信浏览器】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1972181-【V25】【奇安信可信浏览器】软件下载安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiTap('应用商店顶部搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器', true);
    await agent.aiWaitFor("进入搜索结果界面",{timeoutMs:60000});
    await agent.aiAssert("进入搜索结果界面");
    await agent.aiTap('安装');
    await agent.aiWaitFor("界面出现打开字样",{timeoutMs:120000});
  }, { timeout: 1000000, tags: ['1972181', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
    console.log('5. afterAll: 清理测试套件');
  });
});
