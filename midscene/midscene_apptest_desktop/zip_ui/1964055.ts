
/**
 * 用例 PMSID: 1964055
 * 用例标题: 【7-Zip】软件卸载
 * 生成时间: 2025-12-22 13:23:26
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1964055-【7-Zip】软件卸载', () => {
  beforeAll(async ({ device, uos, agent,system,env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y org.7-zip.deepin`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1964055-【7-Zip】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('7-Zip','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现7-Zip", {
      timeoutMs: 3000000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    // await agent.aiTap("点击包格式后面的如意玲珑")
    await agent.aiTap("'7-Zip'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'7-Zip'条目右侧显示已卸载", {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器界面搜索框', { deepThink: true });
    await device.typeText('7-Zip',true);
    await agent.aiAssert("左侧启动器中无搜索结果"); 
  
  }, { timeout: 600000, tags: ['1964055', 'level2'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
