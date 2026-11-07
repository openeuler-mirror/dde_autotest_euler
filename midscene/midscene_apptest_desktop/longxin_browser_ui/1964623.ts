
/**
 * 用例 PMSID: 1964623
 * 用例标题: 【V25】【龙芯浏览器】软件下载安装
 * 用例编写人:ut006345
 * 生成时间: 2025-12-23 15:40:28
 */

describe('1964623-【V25】【龙芯浏览器】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1964623-【V25】【龙芯浏览器】软件下载安装', async ({ device, agent, uos }) => {
   await uos.openApp("应用商店");
    await agent.aiTap('应用商店顶部搜索框', { deepThink: true });
    await device.typeText('龙芯浏览器', true);
    await agent.aiWaitFor("进入搜索结果界面",{timeoutMs:60000});
    await agent.aiAssert("进入搜索结果界面");
    await agent.aiTap('包格式右侧如意玲珑按钮', { deepThink: true });
    await agent.aiTap('搜索结果中龙芯浏览器', { deepThink: true });
    await agent.aiTap('安装');
    await agent.aiWaitFor("界面出现打开字样",{timeoutMs:120000});
  }, { timeout: 1200000, tags: ['1964623', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.loongnix.lbrowser`;
    await system.exec(uninstallCmd);
    console.log('5. afterAll: 清理测试套件');
  });
});
