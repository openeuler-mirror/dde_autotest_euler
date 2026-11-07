
/**
 * 用例 PMSID: 1998545
 * 用例标题: 【V25】【Master PDF编辑器_玲珑】软件打开、关闭
 * 生成时间: 2026-04-28 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1998545-【V25】【Master PDF编辑器_玲珑】软件打开、关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件'); 
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装Master PDF编辑器软件
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install net.code_industry.MasterPDFEditor`;
    await system.exec(installCmd);
  });

  test('1998545-【V25】【Master PDF编辑器_玲珑】软件打开、关闭', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('Master PDF');
    await device.pressKey('Enter');
    await agent.aiWaitFor('界面出现"File"按钮');
    await agent.aiAssert('界面存在"Master PDF Editor"');
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1998545', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device, system ,env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall net.code_industry.MasterPDFEditor`;
    await system.exec(uninstallCmd);
  });
});
