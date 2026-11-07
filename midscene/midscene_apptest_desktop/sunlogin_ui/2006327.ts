
/**
 * 用例 PMSID: 2006327
 * 用例标题: 【V25】【向日葵远程控制】软件打开/关闭
 * 生成时间: 2026-05-28
 * 用例编写人：UT003531(钱程)
 */

describe('2006327-【V25】【向日葵远程控制】软件打开/关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装向日葵远程控制软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.oray.sunlogin.client`;
    await system.exec(installCmd);
  });

  test('2006327-【V25】【向日葵远程控制】软件打开/关闭', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await agent.aiWaitFor('界面存在"搜索"');
    await uos.searchInLauncher('向日葵远程控制');
    await device.pressKey('Enter');
    await agent.aiWaitFor('界面出现远程协助按钮');
    await agent.aiAssert("界面存在'设备列表");
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面不存在'远程协助'");
  }, { timeout: 1200000, tags: ['2006327', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device, system ,env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.oray.sunlogin.client`;
    await system.exec(uninstallCmd);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
