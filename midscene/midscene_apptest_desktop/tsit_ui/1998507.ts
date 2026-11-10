
/**
 * 用例 PMSID: 1998507
 * 用例标题: 【V25】【泰山办公_玲珑】软件卸载
 * 生成时间: 2026-04-28 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1998507-【V25】【泰山办公_玲珑】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装泰山办公_玲珑软件
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install cn.ts-it.suite`;
    await system.exec(installCmd);
    await uos.openLauncher();
    await agent.aiInput('泰山办公','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果出现'泰山办公'应用", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("桌面空白处");
  });

  test('1998507-【V25】【泰山办公_玲珑】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('泰山办公','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现'泰山办公'应用", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("'泰山办公'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'泰山办公'条目右侧显示已卸载", {
      timeoutMs: 600000, // 等待 600 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有'泰山办公'图标");
    await uos.openLauncher();
    await agent.aiInput('泰山办公','搜索框');
    await agent.aiAssert("不存在'泰山办公'图标");
  }, { timeout: 600000, tags: ['1998507', 'level2', 'smoke'] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const killCmd = `pkill -f 'cn.ts-it.suite'`;
    await system.exec(killCmd);
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall cn.ts-it.suite`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
