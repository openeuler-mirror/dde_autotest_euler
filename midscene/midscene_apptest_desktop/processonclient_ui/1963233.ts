
/**
 * 用例 PMSID: 1963233
 * 用例标题: 应用商店-ProcessOn流程图安装
 * 生成时间: 2025-12-18 13:18:43
 * 用例编写人：UT000181(刘亚菲)
 */

describe('1963233-应用商店-ProcessOn流程图安装', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963233-应用商店-ProcessOn流程图下载', async ({ device, agent, uos,system }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示");
    await agent.aiAssert("应用商店已打开");
    await agent.aiInput('ProcessOn流程图','搜索框');
    await agent.aiTap("在应用商店搜索输入框中输入ProcessOn流程图");
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiAssert("搜索结果包含ProcessOn流程图相关应用");
    await agent.aiTap("点击第一个ProcessOn流程图（离线版）应用条目右侧的离线安装按钮");
    await agent.aiWaitFor('第一个ProcessOn流程图（离线版）应用条目右侧的已安装已显示', {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    //await agent.aiWaitFor("ProcessOn流程图（离线版）应用条目右侧按钮显示打开");
  
  }, { timeout: 600000, tags: ['1963233', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.processon.processonclient`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
