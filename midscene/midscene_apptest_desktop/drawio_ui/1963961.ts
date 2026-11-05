/**
 * 用例 PMSID: 1963961
 * 用例标题: 【draw.io流程图】软件下载安装
 * 生成时间: 2025-12-19 16:37:53
 * 用例编写人：UT000181 (刘亚菲)
 */

describe('1963961-【draw.io流程图】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963961-【draw.io流程图】软件下载安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示");
    await agent.aiAssert("应用商店已打开");
    await agent.aiInput('draw.io','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiAssert("搜索结果包含draw.io流程图应用");
    await agent.aiTap("deb")
    await agent.aiTap("点击draw.io流程图应用条目右侧的安装按钮");
    await agent.aiWaitFor('draw.io流程图应用条目右侧的显示打开按钮', {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
  }, { timeout: 600000, tags: ['1963961', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y net.diagrams.drawio`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
