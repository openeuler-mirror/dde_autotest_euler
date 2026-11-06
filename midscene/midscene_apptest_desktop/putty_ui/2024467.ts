/**
 * 用例 PMSID: 2024467
 * 用例标题: 【V25】【PuTTY-远程登陆】打开Fonts界面
 * 生成时间: 2026-08-04 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2024467-【V25】【PuTTY-远程登陆】打开Fonts界面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装PuTTY-远程登陆软件
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install org.chiark.putty`;
    await system.exec(installCmd);
  });

  test('2024467-【V25】【PuTTY-远程登陆】打开Fonts界面', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('Putty');
    await agent.aiWaitFor('出现"Putty"图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await agent.aiTap('"Putty"图标');
    await agent.aiWaitFor('界面出现"Session"');
    await agent.aiAssert("界面存在'Session'");
    await agent.aiTap('Fonts');
    await agent.aiAssert("界面存在'Change'");
    await uos.closeCurrentWindow();
  }, { timeout: 1200000, tags: ['2024467', 'level3', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
      const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall org.chiark.putty`;
      await system.exec(uninstallCmd);
  });
});
