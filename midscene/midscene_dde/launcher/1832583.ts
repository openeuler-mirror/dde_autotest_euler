/**
 * 用例 PMSID: 1832583
 * 用例标题: 【启动器】【全屏模式】【背景壁纸】单屏模式下打开启动器全屏，背景壁纸为当前桌面壁纸
 * 生成时间: 2026/8/5
 * 用例编写人: UT002485（卢燕）
 */

const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';
const PRIMARY_MONITOR = 'eDP';

describe('1832583-【启动器】【全屏模式】【背景壁纸】单屏模式下打开启动器全屏，背景壁纸为当前桌面壁纸', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 通过配置文件设置启动器为全屏模式并重启 dde-shell
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 验证配置已生效
    const checkResult = await system.exec(`cat ${configPath}`);
    console.log('重启后配置文件内容:', checkResult.stdout);
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832583-【启动器】【全屏模式】【背景壁纸】单屏模式下打开启动器全屏，背景壁纸为当前桌面壁纸', async ({ device, agent, uos, system }) => {
    // 步骤1：获取当前桌面壁纸路径
    const wallpaperRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'GetCurrentWorkspaceBackgroundForMonitor', [PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    const currentWallpaper = String(wallpaperRes?.result || wallpaperRes?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
    console.log(`当前桌面壁纸: ${currentWallpaper}`);

    // 步骤2：显示桌面后打开启动器全屏
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Super');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor('屏幕显示了应用图标网格列表和底部搜索框', { timeoutMs: 20000 });

    // 检查：启动器全屏背景壁纸为当前桌面壁纸
    await agent.aiAssert('启动器全屏界面已显示，背景为桌面壁纸带有半透明蒙层效果');

    // 关闭启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1832583', 'level3'] });

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
