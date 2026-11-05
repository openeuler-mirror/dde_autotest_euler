/**
 * 用例 PMSID: 1963963
 * 用例标题: 【draw.io流程图】软件打开
 * 生成时间: 2025-12-19 17:00:15
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1963963-【draw.io流程图】软件打开', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install net.diagrams.drawio`;
    await system.exec(installCmd);
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963963-【draw.io流程图】软件打开', async ({ device, agent, uos,env,system }) => {
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install -y net.diagrams.drawio`;
    await system.exec(installCmd);
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器界面搜索框', { deepThink: true });
    await device.typeText('drawio 流程图',true);
    await agent.aiWaitFor("drawio 流程图界面已显示");
    await uos.maximizeWindow();
    await agent.aiAssert("drawio 流程图已打开");
  }, { timeout: 600000, tags: ['1963963', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall net.diagrams.drawio`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
