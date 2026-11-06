
/**
 * 用例 PMSID: 1971133
 * 用例标题: 【V25】【龙芯浏览器】软件下载安装
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2025-01-22 15:40:28
 */

describe('1971133-【V25】【奇安信可信浏览器】软件启动', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.qianxin.browser-stable`;
    await system.exec(installCmd);
    await uos.openLauncher();
    console.log('已打开启动器');
    await uos.searchInLauncher("奇安信可信浏览器");
    await agent.aiWaitFor("启动器界面出现奇安信可信浏览器应用",{timeoutMs:120000});
    await agent.aiAssert("启动器界面已显示奇安信可信浏览器应用");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1971133-【V25】【奇安信可信浏览器】软件启动', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器界面搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await uos.maximizeWindow();
    await agent.aiAssert("奇安信可信浏览器已打开");
  }, { timeout: 1000000, tags: ['1971133', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
  });
});
