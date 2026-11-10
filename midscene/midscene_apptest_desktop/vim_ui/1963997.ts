
/**
 * 用例 PMSID: 1963997
 * 用例标题: 【Vim-文本编辑器】软件打开
 * 生成时间: 2025-12-22 09:09:44
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1963997-【Vim-文本编辑器】软件打开', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install org.vim`;
    await system.exec(installCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1963997-【Vim-文本编辑器】软件打开', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('GVim');
    await agent.aiWaitFor('启动器搜索结果中已显示GVim应用图标', {
      timeoutMs: 180000,
      checkIntervalMs: 3000,
    });
    await device.pressKey('Enter');
    await agent.aiWaitFor('GVim主界面已显示', {
      timeoutMs: 120000,
      checkIntervalMs: 3000,
    });
    await agent.aiAssert("GVim已打开");
  }, { timeout: 600000, tags: ['1963997', 'level2'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall org.vim`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
