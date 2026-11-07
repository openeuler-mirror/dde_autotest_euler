
/**
 * 用例 PMSID: 1998903
 * 用例标题: 【V25】【绿页阅读器_玲珑】软件打开、关闭
 * 生成时间: 2026-04-28 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1998903-【V25】【绿页阅读器_玲珑】软件打开、关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件'); 
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装绿页阅读器软件
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install cn.greenpaper.reader`;
    await system.exec(installCmd);
  });

  test('1998903-【V25】【绿页阅读器_玲珑】软件打开、关闭', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('绿页阅读器');
    await device.pressKey('Enter');
    await agent.aiWaitFor('界面出现主页按钮');
    await agent.aiAssert("界面存在'绿页阅读器");
    await agent.aiTap('注释');
    await agent.aiWaitFor('界面出现"手型工具"菜单');
    await agent.aiAssert('界面存在批注按钮');
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1998903', 'level3'] });

  afterEach(async ({ uos, agent, device, system ,env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall cn.greenpaper.reader`;
    await system.exec(uninstallCmd);
  });
});
