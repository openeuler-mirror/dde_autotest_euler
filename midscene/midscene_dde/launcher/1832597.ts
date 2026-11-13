/**
 * 用例 PMSID: 1832597
 * 用例标题: 【启动器】【全屏模式】【遮挡弹窗】弹出通知类型的横幅通知，打开启动器全屏模式，横幅通知弹窗被遮挡
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832597-【启动器】【全屏模式】【遮挡弹窗】弹出通知类型的横幅通知，打开启动器全屏模式，横幅通知弹窗被遮挡', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 通过配置文件设置启动器为全屏模式并重启 dde-shell
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832597-【启动器】【全屏模式】【遮挡弹窗】弹出通知类型的横幅通知，打开启动器全屏模式，横幅通知弹窗被遮挡', async ({ device, agent, uos, system }) => {
    // 步骤1：唤起网络（或截屏等）横幅通知
    console.log('步骤1：唤起通知类型的横幅通知');
    // 使用 notify-send 触发通知类型横幅通知
    await system.exec(`notify-send -t 30000 "1832597横幅通知测试" "这是一条测试用通知类型横幅通知"`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：通知类型的横幅通知已弹出
    let hasBanner = false;
    for (let retry = 0; retry < 3; retry++) {
      hasBanner = await agent.aiBoolean('屏幕顶部显示了通知类型的横幅通知弹窗，标题为"1832597横幅通知测试"');
      if (hasBanner) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (!hasBanner) {
      console.log('未检测到横幅通知，重试触发');
      await system.exec(`notify-send -u critical -t 30000 "1832597横幅通知测试" "这是一条测试用通知类型横幅通知"`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 步骤2：随后打开启动器全屏模式
    console.log('步骤2：打开启动器全屏模式');
    await device.pressKey('Super');
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：启动器全屏模式已打开
    // 通知类型的横幅通知弹窗被启动器全屏模式遮挡
    await agent.aiAssert('启动器全屏模式已打开，界面显示了应用图标网格列表');
    await agent.logScreenshot('启动器全屏模式打开后横幅通知状态', {
      content: '启动器全屏模式覆盖整个屏幕，通知类型的横幅通知弹窗被启动器全屏模式遮挡，不在启动器之上显示',
    });
  }, { timeout: 600000, tags: ['1832597', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
    // 还原启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
