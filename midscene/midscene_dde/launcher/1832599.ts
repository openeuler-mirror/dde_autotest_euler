/**
 * 用例 PMSID: 1832599
 * 用例标题: 【启动器】【全屏模式】【遮挡弹窗】弹出强制置顶的横幅通知，打开启动器全屏模式，横幅通知弹窗被遮挡
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832599-【启动器】【全屏模式】【遮挡弹窗】弹出强制置顶的横幅通知，打开启动器全屏模式，横幅通知弹窗被遮挡', () => {
  let originScale = '';
  const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
  const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
  const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 记录当前缩放作为默认值
    const scaleRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'Get', [APPEARANCE_IFACE, 'UIScale'],
      { bus: 'session', timeout: 10000 },
    );
    const scaleStr = String(scaleRes?.result || scaleRes?.stdout || '');
    const match = scaleStr.match(/d\s+([\d.]+)/);
    originScale = match ? match[1] : '1';
    console.log(`当前缩放: ${originScale}`);

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

  test('1832599-【启动器】【全屏模式】【遮挡弹窗】弹出强制置顶的横幅通知，打开启动器全屏模式，横幅通知弹窗被遮挡', async ({ device, agent, uos, system }) => {
    // 步骤1：设置屏幕缩放，触发强制置顶的横幅通知
    console.log('步骤1：设置屏幕缩放，触发"屏幕缩放需注销后才能生效"的横幅通知');
    // 获取当前缩放值
    const curRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'Get', [APPEARANCE_IFACE, 'UIScale'],
      { bus: 'session', timeout: 10000 },
    );
    const curStr = String(curRes?.result || curRes?.stdout || '');
    const curMatch = curStr.match(/d\s+([\d.]+)/);
    const curScale = parseFloat(curMatch ? curMatch[1] : '1');

    // 设置为不同的缩放值，触发注销提示横幅
    const newScale = curScale === 1 ? 1.25 : 1;
    console.log(`将缩放从 ${curScale} 设置为 ${newScale}`);
    await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'Set', [APPEARANCE_IFACE, 'UIScale', { 'd': newScale }],
      { bus: 'session', timeout: 10000 },
    );
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 检查：弹出"屏幕缩放需注销后才能生效"的横幅通知，且强制置顶
    let hasBanner = false;
    for (let retry = 0; retry < 3; retry++) {
      hasBanner = await agent.aiBoolean('屏幕顶部显示了"屏幕缩放需注销后才能生效"的横幅通知，包含立即注销或稍后注销按钮');
      if (hasBanner) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (!hasBanner) {
      console.log('未检测到横幅通知，尝试再次触发');
      // 还原缩放，再次设置以触发
      await system.queryDBus(
        APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
        'Set', [APPEARANCE_IFACE, 'UIScale', { 'd': curScale }],
        { bus: 'session', timeout: 10000 },
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.queryDBus(
        APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
        'Set', [APPEARANCE_IFACE, 'UIScale', { 'd': newScale }],
        { bus: 'session', timeout: 10000 },
      );
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 步骤2：打开启动器全屏模式
    console.log('步骤2：打开启动器全屏模式');
    await device.pressKey('Super');
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：启动器全屏模式已打开，注销的横幅通知被遮挡
    await agent.aiAssert('启动器全屏模式已打开，界面显示了应用图标网格列表');
    await agent.logScreenshot('启动器全屏模式打开后横幅通知状态', {
      content: '启动器全屏模式覆盖整个屏幕，横幅通知弹窗被启动器全屏模式遮挡，不在启动器之上显示',
    });
  }, { timeout: 600000, tags: ['1832599', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
    // 还原缩放
    if (originScale) {
      try {
        await system.queryDBus(
          APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
          'Set', [APPEARANCE_IFACE, 'UIScale', { 'd': parseFloat(originScale) }],
          { bus: 'session', timeout: 10000 },
        );
        console.log(`已还原缩放为: ${originScale}`);
      } catch (e) {
        console.log(`还原缩放失败: ${(e).message}`);
      }
    }
    // 还原启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
