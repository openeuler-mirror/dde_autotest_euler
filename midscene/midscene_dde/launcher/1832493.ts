/**
 * 用例 PMSID: 1832493
 * 用例标题: 【启动器】【全屏模式】退出启动器全屏模式
 * 生成时间: 2026-06-22
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832493-【启动器】【全屏模式】退出启动器全屏模式', () => {
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

  test('1832493-【启动器】【全屏模式】退出启动器全屏模式', async ({ device, agent, uos }) => {
    // 步骤 1: 打开启动器，切换到全屏模式
    await uos.openLauncher();
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器窗口模式右下角的全屏模式图标',
      images: [{
        name: '全屏模式小图标',
        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
      }],
      deepThink: true,
    });
    await agent.aiWaitFor('启动器全屏模式已显示');

    // 步骤 2: 点击应用图标启动应用
    await agent.aiTap('任意计算器应用图标');

    // 检查：退出启动器全屏模式
    await agent.aiAssert('启动器全屏模式已退出');

    // 步骤 3: 打开启动器全屏模式，点击任意空白处
    await uos.openLauncher();
    await agent.aiTap('任务栏应用去空白区域');

    // 检查：退出启动器全屏模式
    await agent.aiAssert('启动器全屏模式已退出');
  }, { timeout: 600000, tags: ['1832493', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 5.1 关闭计算器进程
    const pidResult = await system.exec('pidof deepin-calculator');
    if (pidResult.success && pidResult.stdout) {
      const pid = pidResult.stdout.trim();
      if (pid) {
        console.log(`关闭计算器进程，PID: ${pid}`);
        await system.exec(`kill ${pid}`);
      }
    }
    // 5.2 切换启动器全屏到窗口模式
    await uos.openLauncher();
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
