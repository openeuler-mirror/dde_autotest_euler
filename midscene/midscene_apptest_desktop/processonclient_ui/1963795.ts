
/**
 * 用例 PMSID: 1963795
 * 用例标题: 【ProcessOn流程图】软件打开后新建流程图
 * 生成时间: 2025-12-18 16:23:21
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1963795-【ProcessOn流程图】软件打开后新建流程图', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.processon.processonclient`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963795-【ProcessOn流程图】软件打开后新建流程图', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('ProcessOn流程图');
    await agent.aiWaitFor("启动器界面出现ProcessOn流程图",{timeoutMs:120000});
    await agent.aiTap("启动器中的ProcessOn流程图应用图标",{deepThink:true});
    await device.pressKey('Enter');
    await agent.aiWaitFor('ProcessOn');
    await agent.aiTap("点击ProcessOn下面的新建按钮");
    await agent.aiAssert("流程图图标已显示");
    await agent.aiTap("点击流程图图标");
    await agent.aiAssert("基础图形已显示");
  }, { timeout: 600000, tags: ['1963795', 'level2'] });

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
