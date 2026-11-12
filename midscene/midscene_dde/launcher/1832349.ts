/**
 * 用例 PMSID: 1832349
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】拖动同类应用图标，重合度大于一半到小于一半时释放图标，检查应用文件夹
 * 生成时间: 2026-08-31
 * 用例编写人: UT005044(王亮)
 */

describe('1832349-【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】拖动同类应用图标，重合度大于一半到小于一半时释放图标，检查应用文件夹', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 读取配置文件，检查启动器模式
    const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
    assertTrue(result.success, '读取配置文件失败');
    const content = result.stdout.toString();
    const isFullscreen = content.includes('current_frame=FullscreenFrame');
    const isWindowed = content.includes('current_frame=WindowedFrame');
    if (isFullscreen) {
      console.log('检测到全屏模式，切换到窗口模式...');
      await device.pressKey('ESC');
      await uos.openLauncher();
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

  test('1832349-【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】拖动同类应用图标，重合度大于一半到小于一半时释放图标，检查应用文件夹', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 拖动同类应用图标，重合度由大于一半到小于一半时释放图标
    console.log('步骤 2: 拖动同类应用图标，重合度由大于一半到小于一半时释放图标');
    const pcService = device.getPCService();

    // 定位源图标
    console.log('定位源图标: 浏览器');
    const srcLoc = await agent.aiLocate('启动器界面左侧区域中的文件管理器图标');
    let srcX = srcLoc.center[0];
    let srcY = srcLoc.center[1];

    // 定位目标图标
    console.log('定位目标图标: 应用商店');
    const tgtLoc = await agent.aiLocate('启动器界面左侧区域中的应用商店图标');
    let tgtX = tgtLoc.center[0];
    let tgtY = tgtLoc.center[1];

    // 获取物理屏幕分辨率用于坐标转换
    const env = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority';
    const geoResult = await system.exec(`${env} xdotool getdisplaygeometry`);
    const geoMatch = geoResult.stdout.toString().trim().match(/(\d+)\s+(\d+)/);
    const physWidth = geoMatch ? parseInt(geoMatch[1]) : 1920;
    const physHeight = geoMatch ? parseInt(geoMatch[2]) : 1080;

    // 坐标缩放处理（aiLocate返回截图坐标空间，可能需要转换到物理坐标）
    if (srcX > physWidth || srcY > physHeight || tgtX > physWidth || tgtY > physHeight) {
      const scale = Math.max(
        srcX > physWidth ? srcX / physWidth : 1,
        tgtX > physWidth ? tgtX / physWidth : 1,
        srcY > physHeight ? srcY / physHeight : 1,
        tgtY > physHeight ? tgtY / physHeight : 1
      );
      srcX = Math.round(srcX / scale);
      srcY = Math.round(srcY / scale);
      tgtX = Math.round(tgtX / scale);
      tgtY = Math.round(tgtY / scale);
    }
    srcX = Math.max(0, Math.min(srcX, physWidth - 1));
    srcY = Math.max(0, Math.min(srcY, physHeight - 1));
    tgtX = Math.max(0, Math.min(tgtX, physWidth - 1));
    tgtY = Math.max(0, Math.min(tgtY, physHeight - 1));
    console.log(`源坐标: (${srcX}, ${srcY}), 目标坐标: (${tgtX}, ${tgtY})`);

    // 拖拽: 先拖到目标位置(重合度>50%)，再拉回到重合度<50%处释放
    // 1. 移动到源图标并按下鼠标左键
    console.log('移动到源图标并按下鼠标');
    await pcService.mouse.move([{ x: srcX, y: srcY }]);
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));

    // 2. 分步拖到目标位置(完全重合，重合度>50%)
    console.log('拖拽到目标位置（重合度大于一半）');
    const steps = 10;
    const stepX = (tgtX - srcX) / steps;
    const stepY = (tgtY - srcY) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(srcX + stepX * i), y: Math.round(srcY + stepY * i) }]);
      await new Promise(r => setTimeout(r, 16));
    }
    // 悬停等待（重合度>50%，应显示文件夹特效）
    await new Promise(r => setTimeout(r, 1000));

    // 3. 拉回到重合度<50%的位置（源和目标之间约30%处）
    console.log('拉回到重合度小于一半的位置');
    const pullBackX = Math.round(srcX + (tgtX - srcX) * 0.3);
    const pullBackY = Math.round(srcY + (tgtY - srcY) * 0.3);
    const pullSteps = 5;
    const pullStepX = (pullBackX - tgtX) / pullSteps;
    const pullStepY = (pullBackY - tgtY) / pullSteps;
    for (let i = 1; i <= pullSteps; i++) {
      await pcService.mouse.move([{ x: Math.round(tgtX + pullStepX * i), y: Math.round(tgtY + pullStepY * i) }]);
      await new Promise(r => setTimeout(r, 16));
    }
    // 悬停等待（重合度<50%，文件夹特效应消失）
    await new Promise(r => setTimeout(r, 1000));

    // 4. 释放鼠标
    console.log('释放鼠标');
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已拖动应用图标，重合度由大于一半到小于一半并释放');

    // 检查1: 图标保持在原位置，无变化（未创建文件夹）
    await agent.aiAssert('启动器界面中的文件管理器图标保持在原位置，未创建应用文件夹');

  }, { timeout: 600000, tags: ['1832349', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
    // 清理环境：删除相关配置文件，重新加载
    await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
    console.log('item-arrangement.ini 已删除');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    console.log('dde-shell 服务已重启');

    await system.exec('systemctl --user daemon-reload');
    console.log('systemctl --user daemon-reload 已执行');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
