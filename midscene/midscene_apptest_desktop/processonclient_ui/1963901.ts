/**
 * 用例 PMSID: 1963901
 * 用例标题: 【ProcessOn流程图】软件打开后新建网络拓扑图页面
 * 生成时间: 2025-12-19 14:25:42
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1963901-【ProcessOn流程图】软件打开后新建网络拓扑图页面', () => {
  beforeAll(async ({ device, uos, agen,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.processon.processonclient`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963901-【ProcessOn流程图】软件打开后新建网络拓扑图页面', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('ProcessOn流程图');
    await agent.aiWaitFor("启动器界面出现ProcessOn流程图",{timeoutMs:120000});
    await agent.aiTap("启动器中的ProcessOn流程图应用图标",{deepThink:true});
    await device.pressKey('Enter');
    await agent.aiAssert("ProcessOn");
    await agent.aiTap("点击ProcessOn下面的新建按钮");
    await agent.aiAssert("网络拓扑图图标已显示");
    await agent.aiTap("点击网络拓扑图");
    await agent.aiAssert("Network已显示");
  }, { timeout: 600000, tags: ['1963901', 'level2'] });

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
