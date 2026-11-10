/**
 * 用例 PMSID: 2034095
 * 用例标题: 【V25】【玲珑】【TextSeek文本搜索工具】软件卸载
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034095- 【V25】【玲珑】【TextSeek文本搜索工具】软件卸载', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install net.textseek`;
    await system.exec(installCmd);
  });

  test('2034095- 【V25】【玲珑】【TextSeek文本搜索工具】软件卸载', async ({ device, agent, uos, system, env }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });

    await agent.aiTap("应用管理");

    await agent.aiInput('TextSeek','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果已显示", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("TextSeek条目右侧第一个卸载按钮");
    await agent.aiWaitFor("TextSeek条目右侧的已卸载", {
      timeoutMs: 600000,
      checkIntervalMs: 5000,
    });
  }, { timeout: 1200000, tags: ['2034095', 'level1', 'smoke'] });

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
