/**
 * 用例 PMSID: 1877767
 * 用例标题: 【启动器】【全屏模式】调节任务栏高度，打开启动器全屏模式，启动器界面显示正常
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1877767-【启动器】【全屏模式】调节任务栏高度，打开启动器全屏模式，启动器界面显示正常', () => {
  let originalFrame = 'WindowedFrame';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const dbSet = (prop, val) =>
    `dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:${prop} variant:uint32:${val}`;
  const dbGet = (prop) =>
    `busctl --user get-property org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.deepin.dde.daemon.Dock1 ${prop}`;
  // 任务栏高度（WindowSizeEfficient）合法范围：默认48，最小37，最大100（控制中心滑块 from:37, to:100）
  const MIN_HEIGHT = 37;
  const MAX_HEIGHT = 100;
  const DEFAULT_HEIGHT = 48;

  // 工具函数：设置启动器模式并重启 dde-shell 生效
  const setLauncherFrame = async (system, frame) => {
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${frame}/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 备份并初始化测试套件 ==========');
    // 备份原始启动器模式
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    console.log('  记录原始启动器模式: ' + originalFrame);

    // 确保任务栏在底部 + 全屏模式
    await system.exec(dbSet('Position', 2));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await setLauncherFrame(system, 'FullscreenFrame');
    console.log('  已确保任务栏在底部并切换为全屏模式');

    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.pressKey('ESC');
  });

  test('1877767-【启动器】【全屏模式】调节任务栏高度，打开启动器全屏模式，启动器界面显示正常', async ({ device, agent, uos, system }) => {
    const checkDisplay = async (label, expected) => {
      // DBus 读回校验任务栏高度确实生效
      const checkResult = await system.exec(dbGet('WindowSizeEfficient'));
      const m = checkResult.stdout ? checkResult.stdout.match(/(\d+)/) : null;
      assertTrue(m && parseInt(m[1], 10) === expected, `任务栏高度未生效，期望 ${expected}，当前 ${m ? m[1] : '未知'}`);
      console.log(`  ${label}: DBus 校验通过，当前高度 ${m ? m[1] : ''}`);
      await uos.openLauncher();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert('启动器全屏模式界面显示正常，应用图标完整无截断，间距合理，界面无异常');
      console.log(`  ${label}: 启动器全屏模式界面显示正常`);
      await device.pressKey('ESC');
      await new Promise(resolve => setTimeout(resolve, 800));
    };

    // 步骤1：调节任务栏高度为最大值（100）
    console.log('[步骤 1/3] 调节任务栏高度为最大 ' + MAX_HEIGHT);
    await system.exec(dbSet('WindowSizeEfficient', MAX_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkDisplay('任务栏高度100', MAX_HEIGHT);

    // 步骤2：调节任务栏高度为最小值（37）
    console.log('[步骤 2/3] 调节任务栏高度为最小 ' + MIN_HEIGHT);
    await system.exec(dbSet('WindowSizeEfficient', MIN_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkDisplay('任务栏高度37', MIN_HEIGHT);

    // 步骤3：恢复默认高度（48）后再检查一次
    console.log('[步骤 3/3] 恢复任务栏高度为默认 ' + DEFAULT_HEIGHT);
    await system.exec(dbSet('WindowSizeEfficient', DEFAULT_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkDisplay('任务栏高度48', DEFAULT_HEIGHT);
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1877767', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 还原配置 ==========');
    // 还原任务栏高度为默认值
    await system.exec(dbSet('WindowSizeEfficient', DEFAULT_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 收尾：检查启动器模式，非窗口模式则切换为窗口模式（已窗口则保持不变）
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    console.log('  收尾检查启动器模式: ' + (curFrame || '未知'));
    if (curFrame !== 'WindowedFrame') {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
      console.log('  已切换启动器为窗口模式');
    } else {
      console.log('  启动器已是窗口模式，保持不变');
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
