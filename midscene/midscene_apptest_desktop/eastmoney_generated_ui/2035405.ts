/**
 * 用例 PMSID: 2035405
 * 用例标题: 【V25】【deb】【东方财富】软件卸载
 * 生成时间: 2026-09-17 09:25:31
 * 用例编写人：UT003531(钱程)
 */

describe('2035405- 【V25】【deb】【东方财富】软件卸载', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.eastmoney.emapp`;
    await system.exec(installCmd);
  });

  test('2035405- 【V25】【deb】【东方财富】软件卸载', async ({ device, agent, uos, system, env }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });

    await agent.aiTap("应用管理");

    await agent.aiInput('东方财富','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果已显示", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("东方财富条目右侧第一个卸载按钮");
    try {
      await agent.aiTap('确认卸载弹窗中的确定按钮');
    } catch (e) {
      console.log('无确认卸载弹窗');
    }
    await agent.aiWaitFor("东方财富条目右侧的已卸载", {
      timeoutMs: 600000,
      checkIntervalMs: 5000,
    });
  }, { timeout: 1200000, tags: ['2035405', 'level1', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
