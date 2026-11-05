

/**
 * 用例 PMSID: 2006337
 * 用例标题: 【V25】【钉钉】软件下载安装
 * 生成时间: 2026-05-28
 * 用例编写人：UT003531(钱程)
 */

describe('2006337-【V25】【钉钉】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化卸载钉钉软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.alibabainc.dingtalk`;
    await system.exec(uninstallCmd);
  });

  test('2006337-【V25】【钉钉】软件下载安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiInput('钉钉','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果包含钉钉应用", {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await agent.aiTap("钉钉条目右侧第一个安装按钮");
    await agent.aiWaitFor('钉钉条目右侧的打开按钮已显示', {
      timeoutMs: 600000, // 等待 600 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await agent.aiAssert("桌面出现钉钉图标");
  }, { timeout: 1000000, tags: ['2006337', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.alibabainc.dingtalk`;
    await system.exec(uninstallCmd);
  });
});
