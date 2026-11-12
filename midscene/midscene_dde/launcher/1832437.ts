/**
 * 用例 PMSID: 1832437
 * 用例标题: 【启动器】【窗口模式】应用右键菜单检查
 * 生成时间: 2026/7/17
 * 用例编写人: UT002485（卢燕）
 */

describe('1832437-【启动器】【窗口模式】应用右键菜单检查', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 确保启动器为窗口模式
    const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    const result = await system.exec(`cat ${DDE_SHELL_CONFIG_PATH}`);
    const content = result.stdout.toString();
    if (content.includes('current_frame=FullscreenFrame')) {
      await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${DDE_SHELL_CONFIG_PATH}`);
      await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log('安装看图应用...');
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y deepin-image-viewer`;
    await system.exec(installCmd, 120000);
  });

  beforeEach(async ({ device, uos, env, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`rm -f /home/${env.testUsername}/Desktop/org.deepin.browser.desktop`);
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('1832437-【启动器】【窗口模式】应用右键菜单检查', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示');

    await uos.searchInLauncher('浏览器');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('启动器搜索结果显示浏览器应用');
    await agent.aiRightClick('搜索结果中名称为浏览器的应用图标', { deepThink: true });
    await agent.aiWaitFor('右键菜单已显示');
    const isDocked = await agent.aiBoolean('右键菜单中显示"从任务栏上移除"选项');
    if (!isDocked) {
      console.log('浏览器不在任务栏上，添加到任务栏...');
      await agent.aiTap('发送到任务栏');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiRightClick('搜索结果中名称为浏览器的应用图标', { deepThink: true });
      await agent.aiWaitFor('右键菜单已显示');
    }
    await agent.aiAssert('右键菜单显示：打开、发送到桌面、从任务栏上移除、开机自动启动、卸载');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('ESC');
    await agent.aiAssert('右键菜单已关闭');

    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示');
    await agent.aiTap('启动器窗口左上角排序模式按钮');
    await agent.aiWaitFor('排序模式菜单已显示');
    await agent.aiTap('自由排序');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiRightClick('启动器应用列表中名称为看图的应用图标', { deepThink: true });
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiAssert('右键菜单显示：打开、发送到桌面、发送到任务栏、开机自动启动、卸载等选项');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('ESC');
    await agent.aiAssert('右键菜单已关闭');
  }, { timeout: 500000, tags: ["1832437", "level4"] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
  });

  afterAll(async ({ uos, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await system.exec(`cp /usr/share/applications/org.deepin.browser.desktop /home/${env.testUsername}/Desktop/ 2>/dev/null || true`);
    console.log('卸载看图应用...');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y deepin-image-viewer`;
    await system.exec(uninstallCmd, 120000);
  });
});