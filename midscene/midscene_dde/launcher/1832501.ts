/**
 * 用例 PMSID: 1832501
 * 用例标题: 【启动器】【右键菜单】应用右键菜单功能验证---"发送到任务栏"功能
 * 生成时间: 2026-06-22
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832501-【启动器】【右键菜单】应用右键菜单功能验证---"发送到任务栏"功能', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 清理360安全浏览器，确保环境干净
    const removeResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y com.360.browser-stable'`, 180000);
    if (!removeResult.success) {
      console.error('360安全浏览器清理警告:', removeResult.stderr);
    } else {
      console.log('360安全浏览器清理成功');
    }
  });

  beforeEach(async ({ device, agent, uos, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 安装360安全浏览器
    console.log('安装360安全浏览器...');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    const installResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install -y com.360.browser-stable'`, 180000);
    if (installResult.success) {
      console.log('360安全浏览器安装成功');
    } else {
      console.error('360安全浏览器安装失败:', installResult.stderr);
    }

    const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
    assertTrue(result.success, '读取配置文件失败');

    const content = result.stdout.toString();
    const isFullscreen = content.includes('current_frame=FullscreenFrame');
    const isWindowed = content.includes('current_frame=WindowedFrame');

    if (isFullscreen) {
      console.log('检测到全屏模式，执行ESC确保启动器被关闭...');
      await device.pressKey('ESC');
      console.log('重新打开启动器...');
      await uos.openLauncher();
      console.log('切换启动器全屏模式到窗口模式...');
      await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
        images: [{
          name: '窗口模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
        }],
        deepThink: true,
      });
    }
    if (isWindowed) {
      console.log('检测到窗口模式，无需操作');
    }
    await device.pressKey('ESC');
  });

  test('1832501-【启动器】【右键菜单】应用右键菜单功能验证---"发送到任务栏"功能', async ({ device, agent, uos }) => {
    // 步骤 1: 打开启动器
    await uos.openLauncher();

    // 检查：360安全浏览器已安装
    await agent.aiAssert('启动器界面存在360安全浏览器图标');

    // 步骤 2: 从"我的常用"发送计算器应用到任务栏
    // 先检查任务栏是否有图标，如有则移除
    const taskbarHasIcon = await agent.aiBoolean('任务栏存在计算器图标');
    if (taskbarHasIcon) {
      console.log('任务栏已存在计算器图标，先移除...');
      await agent.aiRightClick('任务栏计算器图标');
      await agent.aiTap('从任务栏上移除');
      await uos.openLauncher();
    }

    await agent.aiRightClick('我的常用模块的计算器应用');
    await agent.aiTap('发送到任务栏');
    await agent.aiAssert('任务栏应用区域存在计算器图标');

    // 步骤 3:先移除任务栏上的计算器图标
    await agent.aiRightClick('任务栏计算器图标');
    await agent.aiTap('移除驻留');
    await uos.openLauncher();

    await agent.aiRightClick('最近安装模块的360安全浏览器');
    await agent.aiTap('发送到任务栏');
    await agent.aiAssert('发送到任务栏成功');
    await agent.aiAssert('任务栏应用区域存在360安全浏览器图标');

    // 步骤 4: 先移除任务栏上的360浏览器图标
    await agent.aiRightClick('任务栏360浏览器图标');
    await agent.aiTap('移除驻留');

  }, { timeout: 600000, tags: ['1832501', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理360安全浏览器
    await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y com.360.browser-stable'`, 180000);
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
      images: [{
        name: '窗口模式小图标',
        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
      }],
      deepThink: true,
    });
    await device.pressKey('esc');
  });
});
