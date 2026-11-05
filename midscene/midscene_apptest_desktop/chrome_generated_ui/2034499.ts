/**
 * 用例 PMSID: 2034499
 * 用例标题: 【V25】【玲珑】【chrome-谷歌浏览器】新增页签
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034499- 【V25】【玲珑】【chrome-谷歌浏览器】新增页签', () => {
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
  });

  test('2034499- 【V25】【玲珑】【chrome-谷歌浏览器】新增页签', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('chrome');

    await device.pressKey('Enter');
    await agent.aiWaitFor('chrome主界面已显示', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("浏览器顶部'+'按钮");
    await agent.aiWaitFor('新增一个标签页', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2034499', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const killCmd = `pkill -f 'cn.google.chrome' || true`;
    await system.exec(killCmd);
    await uos.showDesktop();
  });
});
