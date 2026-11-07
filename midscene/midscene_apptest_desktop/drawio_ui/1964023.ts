
/**
 * 用例 PMSID: 1964023
 * 用例标题: 【draw.io流程图】软件-更多图形窗口打开
 * 生成时间: 2025-12-22 13:08:24
 * 用例编写人：UT000181 （刘亚菲）
 */

describe('1964023-【draw.io流程图】软件-更多图形窗口打开', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install  net.diagrams.drawio`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1964023-【draw.io流程图】软件-更多图形窗口打开', async ({ device, agent,env, uos,system }) => {
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install  net.diagrams.drawio`;
    await system.exec(installCmd);
    await uos.openLauncher();
    await uos.searchInLauncher('drawio');
    await agent.aiTap("启动器中的draw应用图标");
    await device.pressKey('Enter');
    await agent.aiAssert("draw.io");
    await agent.aiTap("左侧 +更多图形按钮");
    await agent.aiAssert("图形窗口界面已显示");
  }, { timeout: 600000, tags: ['1964023', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall  net.diagrams.drawio`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
