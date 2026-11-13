/**
 * 用例 PMSID: 1832545
 * 用例标题: 【启动器】【全屏模式】快捷键"Ctrl -"缩小应用图标
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832545-【启动器】【全屏模式】快捷键"Ctrl -"缩小应用图标', () => {
  let originalIconScale = '1.0';
  let originalFrame = 'WindowedFrame';
  const dconfigApp = 'org.deepin.dde.shell';
  const dconfigName = 'org.deepin.ds.launchpad';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  // 工具函数：设置启动器模式（FullscreenFrame/WindowedFrame）并重启 dde-shell 生效
  // 说明：current_frame 由 LauncherController 在 dde-shell 启动时读取（launchercontroller.cpp），
  // 用配置方式切换比 AI 点击模式图标更确定，且不依赖外部参考图片
  const setLauncherFrame = async (system, frame) => {
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${frame}/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

  beforeAll(async ({ device, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 跑测前检查图标缩放比例（iconScaleFactor，默认1.0），记录以便跑测后还原
    const scaleResult = await system.exec(`dde-dconfig get ${dconfigApp} -r ${dconfigName} iconScaleFactor`);
    if (scaleResult.success && scaleResult.stdout.trim()) {
      originalIconScale = scaleResult.stdout.trim().replace(/"/g, '');
    }
    console.log('  记录原始图标缩放比例: ' + originalIconScale);

    // 记录原始启动器模式，并强制切换为全屏模式（Ctrl+/- 仅在全屏模式生效）
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
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832545-【启动器】【全屏模式】快捷键"Ctrl -"缩小应用图标', async ({ device, agent, uos }) => {
    // 图标面积测量：多次采样取中位数，过滤AI识别误差
    const measureIconArea = async () => {
      const sizes = [];
      for (let i = 0; i < 3; i++) {
        const loc = await agent.aiLocate('启动器全屏模式中的文件管理器应用图标');
        const w = loc.rect ? loc.rect.width : 0;
        const h = loc.rect ? loc.rect.height : 0;
        if (w > 0 && h > 0) sizes.push(w * h);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      sizes.sort((a, b) => a - b);
      return sizes[Math.floor(sizes.length / 2)];
    };

    // 步骤1：打开启动器全屏模式
    // openLauncher 内部已校验启动器打开（verifyLauncherOpen），此处固定等待渲染完成后由 aiAssert 兜底
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('启动器全屏模式界面显示应用图标网格');

    // 前置：先将图标放大到最大尺寸，确保缩小测试从最大尺寸开始
    for (let i = 0; i < 15; i++) {
      await device.pressKey('Ctrl', '+');
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    const maxArea = await measureIconArea();
    console.log('放大到最大后图标面积: ' + maxArea);
    if (maxArea <= 0) {
      throw new Error('定位应用图标失败，无法获取图标尺寸');
    }

    // 步骤2：点击快捷键Ctrl -，缩小应用图标
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Ctrl', '-');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    const afterArea = await measureIconArea();
    console.log('Ctrl- 后图标面积: ' + afterArea);
    if (afterArea >= maxArea * 0.85) {
      throw new Error('Ctrl - 后应用图标未缩小, max=' + maxArea + ' after=' + afterArea);
    }
    console.log('验证通过：Ctrl - 缩小应用图标成功');
    await agent.aiAssert('启动器全屏模式中的应用图标网格正常显示，文件管理器图标显示正常（Ctrl - 缩小后界面无异常）');

    // 步骤3：继续点击快捷键Ctrl -，图标变为第五号尺寸时不能再被缩小
    for (let i = 0; i < 25; i++) {
      await device.pressKey('Ctrl', '-');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    const minArea = await measureIconArea();
    console.log('缩小到最小后图标面积: ' + minArea);
    for (let i = 0; i < 3; i++) {
      await device.pressKey('Ctrl', '-');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    const finalArea = await measureIconArea();
    console.log('继续缩小后图标面积: ' + finalArea);
    if (finalArea < minArea * 0.92) {
      throw new Error('图标已到最小尺寸仍可缩小, min=' + minArea + ' final=' + finalArea);
    }
    console.log('验证通过：图标缩小到最小尺寸后不可再缩小');
    await agent.aiAssert('启动器全屏模式应用图标已缩小到最小尺寸，图标网格显示完整正常');
  }, { timeout: 600000, tags: ['1832545', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 清理测试套件，还原图标缩放比例与启动器模式');
    // 还原启动器模式为跑测前记录值
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${originalFrame}/" ${settingsIni}`);
    // 还原图标缩放比例（iconScaleFactor 在 dde-shell 启动时读取，需重启生效）
    console.log('  还原图标缩放比例为: ' + originalIconScale);
    await system.exec(`dde-dconfig --set -a ${dconfigApp} -r ${dconfigName} -k iconScaleFactor -v ${originalIconScale}`);
    // 一次性重启 dde-shell，使模式与缩放比例同时生效
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
