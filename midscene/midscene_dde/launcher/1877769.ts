/**
 * 用例 PMSID: 1877769
 * 用例标题: 【启动器】【全屏模式】打开启动器全屏模式，无法调节启动器的窗口大小
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1877769-【启动器】【全屏模式】打开启动器全屏模式，无法调节启动器的窗口大小', () => {
  let originalFrame = 'WindowedFrame';
  let originalTaskbarHeight = '48';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const dbSet = (prop, val) =>
    `dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:${prop} variant:uint32:${val}`;
  const dbGet = (prop) =>
    `busctl --user get-property org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.deepin.dde.daemon.Dock1 ${prop}`;
  // 任务栏高度（WindowSizeEfficient）合法范围：默认48，最小37，最大100
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
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    console.log('  记录原始启动器模式: ' + originalFrame);

    // 备份原始任务栏高度
    const heightResult = await system.exec(dbGet('WindowSizeEfficient'));
    if (heightResult.success && heightResult.stdout.trim()) {
      const m = heightResult.stdout.match(/(\d+)/);
      if (m) {
        originalTaskbarHeight = m[1];
      }
    }
    console.log('  记录原始任务栏高度: ' + originalTaskbarHeight);

    await setLauncherFrame(system, 'FullscreenFrame');
    console.log('  已强制切换为全屏模式');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.pressKey('ESC');
  });

  test('1877769-【启动器】【全屏模式】打开启动器全屏模式，无法调节启动器的窗口大小', async ({ device, agent, uos, system }) => {
    // 结构验证辅助：通过 wmctrl 读取启动器窗口(dde-shell/launchpad)几何
    const getLaunchpadGeom = async () => {
      const res = await system.exec('wmctrl -lG');
      const line = res.stdout ? res.stdout.split('\n').find((l) => l.includes('launchpad')) : null;
      const m = line ? line.match(/0x[0-9a-f]+\s+-?\d+\s+(-?\d+)\s+(-?\d+)\s+(\d+)\s+(\d+)/) : null;
      if (!m) {
        console.log('  未找到 launchpad 窗口，wmctrl 全量输出: ' + (res.stdout || '').replace(/\n/g, ' | '));
      }
      return m ? { x: parseInt(m[1], 10), y: parseInt(m[2], 10), w: parseInt(m[3], 10), h: parseInt(m[4], 10) } : null;
    };
    const geomEqual = (a, b) => !!a && !!b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

    // 步骤1：打开启动器全屏模式
    console.log('[步骤 1/4] 打开启动器全屏模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('启动器全屏模式已打开');
    const beforeGeom = await getLaunchpadGeom();
    console.log('  初始启动器窗口几何: ' + JSON.stringify(beforeGeom));
    assertTrue(!!beforeGeom, '未找到启动器窗口(dde-shell/launchpad)');

    // 步骤2：通过接口将任务栏高度调节到最高（100），启动器窗口大小不变
    console.log('[步骤 2/4] 通过接口调节任务栏高度为最大 ' + MAX_HEIGHT);
    await system.exec(dbSet('WindowSizeEfficient', MAX_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    const heightResult = await system.exec(dbGet('WindowSizeEfficient'));
    const hMatch = heightResult.stdout ? heightResult.stdout.match(/(\d+)/) : null;
    assertTrue(hMatch && parseInt(hMatch[1], 10) === MAX_HEIGHT, '任务栏高度未调整为最大，当前 ' + (hMatch ? hMatch[1] : '未知'));
    const maxGeom = await getLaunchpadGeom();
    console.log('  最大任务栏高度下启动器窗口几何: ' + JSON.stringify(maxGeom));
    assertTrue(!!maxGeom, '最大任务栏高度下未找到启动器窗口');
    assertTrue(geomEqual(beforeGeom, maxGeom), '调节任务栏高度到最大后，启动器窗口几何发生变化');
    await agent.aiAssert('启动器全屏界面正常显示，界面铺满整个屏幕，应用图标完整无截断');

    // 步骤3：通过接口将任务栏高度调节到最小（37），启动器窗口大小不变
    console.log('[步骤 3/4] 通过接口调节任务栏高度为最小 ' + MIN_HEIGHT);
    await system.exec(dbSet('WindowSizeEfficient', MIN_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    const heightResult2 = await system.exec(dbGet('WindowSizeEfficient'));
    const hMatch2 = heightResult2.stdout ? heightResult2.stdout.match(/(\d+)/) : null;
    assertTrue(hMatch2 && parseInt(hMatch2[1], 10) === MIN_HEIGHT, '任务栏高度未调整为最小，当前 ' + (hMatch2 ? hMatch2[1] : '未知'));
    const minGeom = await getLaunchpadGeom();
    console.log('  最小任务栏高度下启动器窗口几何: ' + JSON.stringify(minGeom));
    assertTrue(!!minGeom, '最小任务栏高度下未找到启动器窗口');
    assertTrue(geomEqual(beforeGeom, minGeom), '调节任务栏高度到最小后，启动器窗口几何发生变化');
    await agent.aiAssert('启动器全屏界面正常显示，界面铺满整个屏幕，应用图标完整无截断');

    // 步骤4：恢复任务栏高度为默认值
    console.log('[步骤 4/4] 恢复任务栏高度为默认 ' + DEFAULT_HEIGHT);
    await system.exec(dbSet('WindowSizeEfficient', DEFAULT_HEIGHT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1877769', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试套件，还原配置 ==========');
    // 还原任务栏高度
    await system.exec(dbSet('WindowSizeEfficient', originalTaskbarHeight));
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
