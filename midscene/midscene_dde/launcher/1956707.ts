/**
 * 用例 PMSID: 1956707
 * 用例标题: 【启动器】【全屏模式】ctrl+鼠标滚轮调节启动器全屏模式下的图标大小
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1956707-【启动器】【全屏模式】ctrl+鼠标滚轮调节启动器全屏模式下的图标大小', () => {
  let originalIconScale = '1.0';
  let originalFrame = 'WindowedFrame';
  const dconfigApp = 'org.deepin.dde.shell';
  const dconfigName = 'org.deepin.ds.launchpad';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  // 工具函数：设置启动器模式并重启 dde-shell 生效
  const setLauncherFrame = async (system, frame) => {
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${frame}/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

  beforeAll(async ({ device, system, env }) => {
    console.log('========== beforeAll: 备份并初始化测试套件 ==========');
    // 检查 xdotool 是否已安装（滚轮模拟依赖，测试机可能未预装）；未安装则安装
    const xdotoolResult = await system.exec('which xdotool');
    if (!xdotoolResult.success) {
      console.log('  未检测到 xdotool，开始安装...');
      const updateResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt update`, 300000);
      if (!updateResult.success) throw new Error('apt update 失败，无法安装 xdotool');
      const installResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt install -y xdotool`, 300000);
      if (!installResult.success) throw new Error('xdotool 安装失败');
      const recheck = await system.exec('which xdotool');
      if (!recheck.success) throw new Error('xdotool 安装后仍不可用');
      console.log('  xdotool 安装完成');
    } else {
      console.log('  xdotool 已安装');
    }
    // 记录当前图标缩放比例供排查（代码默认 1.0，见 org.deepin.ds.launchpad.json；afterAll 还原为代码默认 1.0）
    const scaleResult = await system.exec(`dde-dconfig get ${dconfigApp} -r ${dconfigName} iconScaleFactor`);
    if (scaleResult.success && scaleResult.stdout.trim()) {
      originalIconScale = scaleResult.stdout.trim().replace(/"/g, '');
    }
    console.log('  记录当前图标缩放比例: ' + originalIconScale + '（代码默认 1.0）');

    // 备份并强制切换为全屏模式
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    console.log('  记录原始启动器模式: ' + originalFrame);
    await setLauncherFrame(system, 'FullscreenFrame');
    console.log('  已强制切换为全屏模式');

    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.pressKey('ESC');
  });

  test('1956707-【启动器】【全屏模式】ctrl+鼠标滚轮调节启动器全屏模式下的图标大小', async ({ device, agent, system }) => {
    // 图标面积测量：采样5次取中位数，过滤AI识别误差（真实图标宽高约50~98px，过滤残缺误定位框）
    const measureIconArea = async () => {
      const sizes = [];
      for (let i = 0; i < 5; i++) {
        const loc = await agent.aiLocate('启动器全屏模式网格中应用图标处的文件管理器应用图标');
        const w = loc && loc.rect ? loc.rect.width : 0;
        const h = loc && loc.rect ? loc.rect.height : 0;
        if (w >= 25 && h >= 25) sizes.push(w * h);
        await new Promise(resolve => setTimeout(resolve, 700));
      }
      if (sizes.length < 3) {
        throw new Error('定位应用图标失败，有效采样不足: ' + sizes.length + '，原始: ' + JSON.stringify(sizes));
      }
      sizes.sort((a, b) => a - b);
      return sizes[Math.floor(sizes.length / 2)];
    };

    // Ctrl+滚轮缩放模拟：直接用 xdotool 发送真实 X11 滚轮事件（click 4=滚轮上=放大，5=滚轮下=缩小），
    // 完全确定性、无 AI 调用。全屏模式滚轮缩放由 FullscreenFrame.qml 整屏 MouseArea 处理
    // （onWheel 检测 CtrlModifier 后 increase/decreaseIconScale），1 次滚轮点击 = 1 个缩放档
    const ctrlWheel = async (system, direction, count) => {
      const btn = direction === 'up' ? 4 : 5;
      await system.exec('xdotool keydown ctrl');
      for (let i = 0; i < count; i++) {
        await system.exec(`xdotool click ${btn}`);
        await new Promise(resolve => setTimeout(resolve, 120));
      }
      await system.exec('xdotool keyup ctrl');
      await new Promise(resolve => setTimeout(resolve, 1000));
    };

    // 步骤1：打开启动器全屏模式
    console.log('[步骤 1/4] 打开启动器全屏模式');
    // 用 DBus 直接 Show 启动器（不依赖 Super 快捷键；dde-shell 重启后快捷键注册偶发失效会导致 Super 打不开启动器）
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('启动器全屏模式界面显示应用图标网格');
    // 鼠标定位到图标区域一次，后续 xdotool 滚轮事件落在启动器界面内生效
    await agent.aiHover('启动器全屏模式中的应用图标区域');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2：先图标缩小到最小，确保放大测试从最小尺寸开始（滚轮全量向下，到最小档自动钳制）
    console.log('[步骤 2/4] 先缩小图标到最小');
    await ctrlWheel(system, 'down', 40);
    const minArea = await measureIconArea();
    console.log('  缩小到最小后图标面积: ' + minArea);
    assertTrue(minArea > 0, '定位应用图标失败，无法获取图标尺寸');

    // 步骤3：Ctrl+滚轮向上滚动，图标应放大
    console.log('[步骤 3/4] Ctrl+滚轮向上，放大应用图标');
    await ctrlWheel(system, 'up', 40);
    const afterArea = await measureIconArea();
    console.log('  Ctrl+滚轮放大后图标面积: ' + afterArea);
    assertTrue(afterArea >= minArea * 1.15, 'Ctrl+滚轮向上后应用图标未放大, min=' + minArea + ' after=' + afterArea);
    console.log('  验证通过：Ctrl+鼠标滚轮向上放大应用图标成功');

    // 步骤4：Ctrl+滚轮向下滚动，图标应缩小
    console.log('[步骤 4/4] Ctrl+滚轮向下，缩小应用图标');
    await ctrlWheel(system, 'down', 40);
    const finalArea = await measureIconArea();
    console.log('  Ctrl+滚轮缩小后图标面积: ' + finalArea);
    assertTrue(finalArea <= afterArea * 0.85, 'Ctrl+滚轮向下后应用图标未缩小, after=' + afterArea + ' final=' + finalArea);
    console.log('  验证通过：Ctrl+鼠标滚轮向下缩小应用图标成功');
    await agent.aiAssert('启动器全屏模式应用图标显示正常');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1956707', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 还原配置 ==========');
    // 收尾：检查启动器模式，非窗口模式则切换为窗口模式（已窗口则保持不变）
    // 图标缩放比例还原为代码默认值 1.0（current_frame 与 iconScaleFactor 均在 dde-shell 启动时读取，一次重启同时生效）
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    console.log('  收尾检查启动器模式: ' + (curFrame || '未知'));
    if (curFrame !== 'WindowedFrame') {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      console.log('  已切换启动器为窗口模式');
    } else {
      console.log('  启动器已是窗口模式，保持不变');
    }
    await system.exec(`dde-dconfig --set -a ${dconfigApp} -r ${dconfigName} -k iconScaleFactor -v 1.0`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    // 读回校验：确认图标缩放比例已还原为代码默认值 1.0
    const checkScale = await system.exec(`dde-dconfig get ${dconfigApp} -r ${dconfigName} iconScaleFactor`);
    const restoredScale = checkScale.success ? checkScale.stdout.trim().replace(/"/g, '') : '';
    console.log('  还原后图标缩放比例: ' + (restoredScale || '未知') + '（期望 1.0）');
    if (!restoredScale || parseFloat(restoredScale) !== 1.0) {
      throw new Error('图标缩放比例未还原为代码默认 1.0，当前: ' + restoredScale);
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
