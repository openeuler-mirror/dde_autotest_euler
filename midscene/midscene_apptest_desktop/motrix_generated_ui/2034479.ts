/**
 * 用例 PMSID: 2034479
 * 用例标题: 【V25】【deb】【Motrix-下载工具】软件打开关闭
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034479- 【V25】【deb】【Motrix-下载工具】软件打开关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y app.motrix`;
    await system.exec(installCmd);
  });

  test('2034479- 【V25】【deb】【Motrix-下载工具】软件打开关闭', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('Motrix');

    await device.pressKey('Enter');
    await agent.aiWaitFor('Motrix主界面已显示', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });
    await agent.aiAssert("界面存在'任务列表'");

    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2034479', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
