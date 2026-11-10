
/**
 * 用例 PMSID: 2006351
 * 用例标题: 【V25】【腾讯会议】软件卸载
 * 生成时间: 2026-05-28
 * 用例编写人：UT003531(钱程)
 */

describe('2006351-【V25】【腾讯会议】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装腾讯会议软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.qq.wemeet`;
    await system.exec(installCmd);
  });

  test('2006351-【V25】【腾讯会议】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('腾讯会议','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现腾讯会议应用", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("'腾讯会议'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'腾讯会议'条目右侧显示已卸载", {
      timeoutMs: 600000, // 等待 600 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有腾讯会议图标");
    await uos.openLauncher();
    await agent.aiInput('腾讯会议','搜索框');
    await agent.aiAssert("不存在腾讯会议应用图标");
  }, { timeout: 600000, tags: ['2006351', 'level1', 'smoke'] });

  afterEach(async ({ uos, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
    await uos.closeCurrentWindow();
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system ,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qq.wemeet`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
