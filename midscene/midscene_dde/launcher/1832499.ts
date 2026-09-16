/**
 * 用例 PMSID: 1832499
 * 用例标题: 【启动器】【右键菜单】应用右键菜单功能验证---"发送到桌面"功能
 * 生成时间: 2026-06-22
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832499-【启动器】【右键菜单】应用右键菜单功能验证---"发送到桌面"功能', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
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

  test('1832499-【启动器】【右键菜单】应用右键菜单功能验证---"发送到桌面"功能', async ({ device, agent, uos, system, env }) => {
    // ========== 步骤 1: 窗口模式-按分类-发送浏览器到桌面 ==========
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');

    // 切换到按分类模式
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器小窗口左上角的排序模式图标',
      images: [{
        name: '按分类小图标',
        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832207.png',
      }],
      deepThink: true,
    });
    await agent.aiTap("按分类");
    await agent.aiAssert('启动器界面存在分类：网络应用');

    // 从左侧应用区右键点击浏览器，点击"发送到桌面"
    await agent.aiRightClick('左侧应用区的浏览器应用');
    await agent.aiTap('发送到桌面');

    // ========== 步骤 2: 我的常用-发送计算器到桌面 ==========
    await agent.aiRightClick('我的常用模块的计算器应用');
    await agent.aiTap('发送到桌面');

    await device.pressKey('esc');
    await agent.aiAssert('桌面存在计算器和浏览器应用图标');
  }, { timeout: 600000, tags: ['1832499', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.openLauncher();
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器小窗口左上角的排序模式图标',
      images: [{
        name: '按分类小图标',
        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832209-1.png',
      }],
      deepThink: true,
    });
    await agent.aiTap("自由排序");
    await device.pressKey('esc');

    // ========== 步骤 3: 收尾-检查并删除桌面图标 ==========
    // 动态获取当前用户名和桌面路径
    const whoamiResult = await system.exec('whoami');
    const currentUser = whoamiResult.stdout.trim();
    const desktopPath = `/home/${currentUser}/Desktop`;
    console.log(`当前用户: ${currentUser}, 桌面路径: ${desktopPath}`);

    // 删除浏览器桌面图标
    const browserDesktop1 = '/usr/share/applications/org.deepin.browser.desktop';
    const browserCheck1 = await system.exec(`test -f ${browserDesktop1} && echo "exists" || echo "not exists"`);
    if (browserCheck1.stdout.includes('exists')) {
      console.log('删除浏览器桌面图标...');
      await system.exec(`echo "${env.testPassword}" | sudo -S rm -f ${desktopPath}/org.deepin.browser.desktop`);
    }

    // 删除计算器桌面图标
    const calcDesktop2 = '/usr/share/applications/deepin-calculator.desktop';
    const calcCheck2 = await system.exec(`test -f ${calcDesktop2} && echo "exists" || echo "not exists"`);
    if (calcCheck2.stdout.includes('exists')) {
      console.log('删除计算器桌面图标...');
      await system.exec(`echo "${env.testPassword}" | sudo -S rm -f ${desktopPath}/deepin-calculator.desktop`);
    }
  });
});
