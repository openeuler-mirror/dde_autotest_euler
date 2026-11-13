/**
 * 用例 PMSID: 1832585
 * 用例标题: 【启动器】【全屏模式】【背景壁纸】单屏切换桌面壁纸后打开启动器全屏，背景壁纸同步更新
 * 生成时间: 2026/8/5
 * 用例编写人: UT002485（卢燕）
 */

const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';
const PRIMARY_MONITOR = 'eDP';
// 系统壁纸中的第三张壁纸（用于更换桌面壁纸），与原壁纸明显不同
const NEW_WALLPAPER_URI = 'file:///usr/share/wallpapers/deepin/Colorful-Abstraction03.jpg';

// 记录原始壁纸，便于 afterAll 还原（模块级变量在 beforeAll/test/afterAll 间共享）
let originWallpaper = '';

describe('1832585-【启动器】【全屏模式】【背景壁纸】单屏切换桌面壁纸后打开启动器全屏，背景壁纸同步更新', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 通过配置文件设置启动器为全屏模式并重启 dde-shell
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -x dde-shell) 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    const checkResult = await system.exec(`cat ${configPath}`);
    console.log('重启后配置文件内容:', checkResult.stdout);

    // 记录原始壁纸，便于 afterAll 还原
    const originRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'GetCurrentWorkspaceBackgroundForMonitor', [PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    originWallpaper = String(originRes?.result || originRes?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
    console.log(`原始桌面壁纸: ${originWallpaper}`);
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832585-【启动器】【全屏模式】【背景壁纸】单屏切换桌面壁纸后打开启动器全屏，背景壁纸同步更新', async ({ device, agent, uos, system }) => {
    // 步骤1：通过 D-Bus 接口切换桌面壁纸为新的系统壁纸
    const setRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'SetCurrentWorkspaceBackgroundForMonitor', [NEW_WALLPAPER_URI, PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    console.log('设置新壁纸返回:', JSON.stringify({ success: setRes?.success, exitCode: setRes?.exitCode }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 校验壁纸已更换为新壁纸
    const checkRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'GetCurrentWorkspaceBackgroundForMonitor', [PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    const newWallpaper = String(checkRes?.result || checkRes?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
    console.log(`更换后桌面壁纸: ${newWallpaper}`);
    if (newWallpaper !== NEW_WALLPAPER_URI) {
      throw new Error(`桌面壁纸更换失败，期望 ${NEW_WALLPAPER_URI}，实际 ${newWallpaper}`);
    }
    console.log('桌面壁纸已切换为新的系统壁纸');

    // 步骤2：显示桌面后打开启动器全屏
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Super');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor('屏幕显示了应用图标网格列表和底部搜索框', { timeoutMs: 20000 });

    // 检查：启动器全屏背景壁纸为切换后的彩色壁纸（Colorful-Abstraction03）
    await agent.aiAssert('启动器全屏界面背景壁纸为彩色抽象图案，带有半透明蒙层效果');

    // 关闭启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1832585', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 还原原始桌面壁纸
    if (originWallpaper) {
      try {
        await system.queryDBus(
          APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
          'SetCurrentWorkspaceBackgroundForMonitor', [originWallpaper, PRIMARY_MONITOR],
          { bus: 'session', timeout: 10000 },
        );
        console.log(`已还原原始桌面壁纸: ${originWallpaper}`);
      } catch (e) {
        console.log(`还原原始桌面壁纸失败: ${(e).message}`);
      }
    }

    // 还原启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -x dde-shell) 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
