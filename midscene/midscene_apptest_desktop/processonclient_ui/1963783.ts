
/**
 * 用例 PMSID: 1963783
 * 用例标题: 【ProcessOn流程图】软件打开
 * 生成时间: 2025-12-18 15:11:32
 * 用例编写人：UT000181(刘亚菲)
 */

describe('1963783-【ProcessOn流程图】软件打开', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.processon.processonclient`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963783-【ProcessOn流程图】软件打开', async ({ device,env,agent,system,uos }) => {
    await uos.openLauncher();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.processon.processonclient`;
    await system.exec(installCmd);
    await uos.searchInLauncher('ProcessOn流程图');
    await agent.aiTap("启动器中的ProcessOn流程图应用图标");
    await device.pressKey('Enter');
    await agent.aiAssert("ProcessOn");
  }, { timeout: 900000, tags: ['1963783', 'level2'] });

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
