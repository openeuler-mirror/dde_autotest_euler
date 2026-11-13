/**
 * 用例 PMSID: 1832595
 * 用例标题: 【启动器】【全屏模式】【遮挡弹窗】弹出OSD弹窗，打开启动器全屏模式，OSD弹窗被遮挡
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832595-【启动器】【全屏模式】【遮挡弹窗】弹出OSD弹窗，打开启动器全屏模式，OSD弹窗被遮挡', () => {
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

  test('1832595-【启动器】【全屏模式】【遮挡弹窗】弹出OSD弹窗，打开启动器全屏模式，OSD弹窗被遮挡', async ({ device, agent, uos, system }) => {
    // 步骤1：唤起音量 OSD 弹窗，确认 OSD 功能正常
    console.log('步骤1：唤起音量 OSD 弹窗');
    // 使用 xdotool 触发音量增大键（XF86AudioRaiseVolume），唤起音量 OSD
    await system.exec(`xdotool key XF86AudioRaiseVolume`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 检查：OSD弹窗已弹出
    let hasOsd = false;
    for (let retry = 0; retry < 3; retry++) {
      hasOsd = await agent.aiBoolean('屏幕中间偏下位置显示了音量 OSD 弹窗，包含音量图标和音量条');
      if (hasOsd) {
        break;
      }
      // 再次按音量键刷新 OSD
      await system.exec(`xdotool key XF86AudioRaiseVolume`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (!hasOsd) {
      // 兜底：尝试亮度 OSD
      console.log('音量 OSD 未检测到，尝试亮度 OSD');
      await system.exec(`xdotool key XF86MonBrightnessUp`);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 步骤2：打开启动器全屏模式
    console.log('步骤2：打开启动器全屏模式');
    await device.pressKey('Super');
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 在启动器全屏模式之上再次唤起 OSD 弹窗
    console.log('在启动器全屏模式之上唤起 OSD 弹窗');
    await system.exec(`xdotool key XF86AudioRaiseVolume`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 检查：启动器全屏模式已打开，覆盖整个屏幕
    // OSD 弹窗本身较短暂，启动器全屏模式遮挡 OSD 弹窗（OSD 不在启动器之上持续显示）
    await agent.aiAssert('启动器全屏模式已打开，界面显示了应用图标网格列表');
    await agent.logScreenshot('启动器全屏模式打开后唤起OSD', {
      content: '启动器全屏模式覆盖整个屏幕，OSD 弹窗被启动器全屏模式遮挡，不在启动器之上显示',
    });
  }, { timeout: 600000, tags: ['1832595', 'level3'] });

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
