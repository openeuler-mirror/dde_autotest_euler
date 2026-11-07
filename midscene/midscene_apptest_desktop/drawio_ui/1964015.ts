
/**
 * 用例 PMSID: 1964015
 * 用例标题: 【draw.io流程图】软件编辑菜单
 * 生成时间: 2025-12-22 10:46:42
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1964015-【draw.io流程图】软件编辑菜单', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install  net.diagrams.drawio`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1964015-【draw.io流程图】软件编辑菜单', async ({ device, agent, uos,env,system }) => {
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install  net.diagrams.drawio`;
    await system.exec(installCmd);
    await uos.openLauncher();
    await uos.searchInLauncher('drawio');
    await agent.aiTap("启动器中的draw应用图标");
    await device.pressKey('Enter');
    await agent.aiAssert("draw.io");
    await agent.aiTap("编辑菜单");
    await agent.aiAssert("全选菜单已显示");
  }, { timeout: 600000, tags: ['1964015', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall  net.diagrams.drawio`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
