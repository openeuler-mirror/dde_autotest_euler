/**
 * 用例 PMSID: 2034493
 * 用例标题: 【V25】【deb】【红莲花安全浏览器】访问中国政府网
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034493- 【V25】【deb】【红莲花安全浏览器】访问中国政府网', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.haitaichina.htbrowser`;
    await system.exec(installCmd);
  });

  test('2034493- 【V25】【deb】【红莲花安全浏览器】访问中国政府网', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('红莲花');

    await agent.aiWaitFor('启动器搜索结果中已显示红莲花安全浏览器应用图标', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await device.pressKey('Enter');
    await agent.aiWaitFor('红莲花安全浏览器主界面已显示', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap('浏览器搜索栏');
    await device.typeText('https://www.gov.cn/', true);
    await device.pressKey('Enter');
    await agent.aiWaitFor('成功访问中国政府网', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2034493', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.haitaichina.htbrowser`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
