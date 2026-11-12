/**
 * 用例 PMSID: 1832435
 * 用例标题: 【启动器】【窗口模式】【我的常用】多次点击卸载后新安装的应用，"我的常用"中最后一个应用被新安装的应用取代
 * 生成时间: 2026-09-08
 * 用例编写人: UT002485（卢燕）
 */

describe('1832435-【启动器】【窗口模式】【我的常用】多次点击卸载后新安装的应用，"我的常用"中最后一个应用被新安装的应用取代', () => {
  const APP_NAME = '360安全浏览器';
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 确保启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('已设置启动器为窗口模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832435-【启动器】【窗口模式】【我的常用】多次点击卸载后新安装的应用，"我的常用"中最后一个应用被新安装的应用取代', async ({ device, agent, uos, system, env }) => {
    // 步骤0：确保 360安全浏览器已安装（通过 apt 安装）
    console.log('步骤0：确保 360安全浏览器已安装');
    const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install -y com.360.browser-stable"`;
    await system.exec(installCmd);
    console.log('360安全浏览器已安装');

    // 多次打开 360安全浏览器，使其在"我的常用"中靠前展示
    for (let i = 0; i < 3; i++) {
      await device.pressKey('ESC');
      await uos.showDesktop();
      await new Promise(resolve => setTimeout(resolve, 500));

      await device.pressKey('Win');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap('启动器中搜索框');
      await device.pressKey('Ctrl', 'A');
      await device.typeText(APP_NAME, true);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await uos.closeCurrentWindow();
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    console.log('360安全浏览器已多次打开，使用频率靠前');

    // 步骤1：打开启动器窗口模式，卸载360安全浏览器
    console.log('步骤1：打开启动器窗口模式，卸载360安全浏览器');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证360安全浏览器在"我的常用"中靠前展示
    await agent.aiAssert(`启动器窗口模式"我的常用"模块中存在${APP_NAME}`);
    await agent.logScreenshot('卸载前"我的常用"模块', {
      content: '卸载前，360安全浏览器在"我的常用"模块中靠前展示',
    });

    // 关闭启动器，通过 apt 卸载360安全浏览器
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.360.browser-stable`;
    await system.exec(uninstallCmd);
    console.log('360安全浏览器已卸载');
    await agent.logScreenshot('360安全浏览器卸载成功', {
      content: '360安全浏览器已通过 apt 卸载',
    });

    // 检查1：360安全浏览器卸载成功
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：通过 apt 重新安装360安全浏览器，多次点击新安装的应用
    console.log('步骤2：通过 apt 重新安装360安全浏览器');
    const reinstallCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.360.browser-stable`;
    await system.exec(reinstallCmd);
    console.log('360安全浏览器已重新安装');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 多次点击新安装的360安全浏览器，使其使用频率高于"我的常用"中最后一个应用使用频率
    console.log('多次点击新安装的360安全浏览器');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('ESC');
      await uos.showDesktop();
      await new Promise(resolve => setTimeout(resolve, 500));

      await device.pressKey('Win');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap('启动器中搜索框');
      await device.pressKey('Ctrl', 'A');
      await device.typeText(APP_NAME, true);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await uos.closeCurrentWindow();
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    console.log('已多次点击新安装的360安全浏览器');

    // 检查2："我的常用"中最后一个应用被新安装的应用取代
    console.log('检查："我的常用"中最后一个应用被新安装的应用取代');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    await agent.aiAssert(`启动器窗口模式"我的常用"模块中存在${APP_NAME}`);
    await agent.logScreenshot('多次点击后"我的常用"模块', {
      content: '多次点击新安装的360安全浏览器后，"我的常用"中最后一个应用被新安装的应用（360安全浏览器）取代',
    });
  }, { timeout: 1200000, tags: ['1832435', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 卸载360安全浏览器
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.360.browser-stable`;
    await system.exec(uninstallCmd);
    console.log('360安全浏览器已卸载');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
