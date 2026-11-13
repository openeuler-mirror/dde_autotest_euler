/**
 * 用例 PMSID: 1921641
 * 用例标题: 【启动器】【窗口模式】【滚动条】设置滚动条"一直显示"，检查Normal、hover、active状态下的滚动条
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1921641-【启动器】【窗口模式】【滚动条】设置滚动条"一直显示"，检查Normal、hover、active状态下的滚动条', () => {
  let originalFrame = 'WindowedFrame';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  // 工具函数：确认启动器为窗口模式，若为全屏则切换为窗口模式并重启 dde-shell 生效
  const ensureWindowedLauncher = async (system) => {
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const currentFrame = frameMatch ? frameMatch[1] : 'WindowedFrame';
    if (currentFrame !== 'WindowedFrame') {
      console.log('  当前为 ' + currentFrame + ' 模式，切换为窗口模式');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  启动器已是窗口模式，无需切换');
    }
    return currentFrame;
  };

  // 工具函数：打开控制中心并最大化
  const openControlCenterMaximized = async (uos, device) => {
    await uos.openApp('ControlCenter');
    await new Promise(resolve => setTimeout(resolve, 2500));
    await device.pressKey('Super', 'Up');
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  // 工具函数：进入 个性化 → 窗口效果
  const navigateToWindowEffect = async (agent) => {
    await agent.aiTap('个性化');
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiTap('窗口效果');
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    originalFrame = await ensureWindowedLauncher(system);

    // 打开控制中心最大化，进入 个性化/窗口效果，检查滚动条默认为"滚动时显示"
    await openControlCenterMaximized(uos, device);
    await navigateToWindowEffect(agent);
    await agent.aiAssert('窗口效果页面中的滚动条设置为"滚动时显示"');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1921641-【启动器】【窗口模式】【滚动条】设置滚动条"一直显示"，检查Normal、hover、active状态下的滚动条', async ({ device, agent, uos, system }) => {
    // 步骤1：点击滚动条下拉框，选择"一直显示"
    await agent.aiTap('滚动时显示');
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiTap('一直显示');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('窗口效果页面中的滚动条设置为"一直显示"');

    // 步骤2：关闭控制中心，重新打开控制中心，检查滚动条仍为"一直显示"（设置已生效）
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await openControlCenterMaximized(uos, device);
    await navigateToWindowEffect(agent);
    await agent.aiAssert('窗口效果页面中的滚动条设置为"一直显示"');

    // 步骤3：打开启动器窗口模式，检查Normal状态下滚动条常驻可见
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2500));
    const normalLoc = await agent.aiLocate('启动器窗口左侧应用列表区域的竖向滚动条');
    if (!normalLoc || !normalLoc.rect || normalLoc.rect.width <= 0) {
      throw new Error('一直显示模式下Normal状态未检测到常驻滚动条');
    }
    console.log('  Normal状态滚动条位置: ' + JSON.stringify(normalLoc.rect));
    await agent.aiAssert('启动器窗口左侧应用列表区域一直显示竖向滚动条（一直显示模式，滚动条常驻可见）');

    // 步骤4：hover滚动条，仍常驻可见（hover状态）
    await agent.aiHover('启动器窗口左侧应用列表区域的竖向滚动条');
    await new Promise(resolve => setTimeout(resolve, 800));
    const hoverLoc = await agent.aiLocate('启动器窗口左侧应用列表区域的竖向滚动条');
    if (!hoverLoc || !hoverLoc.rect || hoverLoc.rect.width <= 0) {
      throw new Error('一直显示模式下hover状态未检测到滚动条');
    }
    console.log('  hover状态滚动条位置: ' + JSON.stringify(hoverLoc.rect));
    await agent.aiAssert('启动器窗口左侧应用列表区域的竖向滚动条一直显示（一直显示模式，hover后滚动条仍常驻）');

    // 步骤5：鼠标滚轮滚动左侧应用列表，滚动条仍常驻显示（active状态）
    await agent.aiHover('启动器窗口左侧的应用列表区域');
    await agent.aiScroll('', { direction: 'down', distance: 200 });
    await new Promise(resolve => setTimeout(resolve, 800));
    const activeLoc = await agent.aiLocate('启动器窗口左侧应用列表区域的竖向滚动条');
    if (!activeLoc || !activeLoc.rect || activeLoc.rect.width <= 0) {
      throw new Error('一直显示模式下滚动后未检测到滚动条');
    }
    console.log('  active状态滚动条位置: ' + JSON.stringify(activeLoc.rect));
    await agent.aiAssert('启动器窗口左侧应用列表区域的竖向滚动条在滚动时仍常驻显示（一直显示模式）');
  }, { timeout: 600000, tags: ['1921641', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('3. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('4. afterAll: 清理测试套件，还原滚动条为滚动时显示并关闭控制中心');
    await device.pressKey('esc');
    await new Promise(resolve => setTimeout(resolve, 500));
    // 控制中心仍打开，将滚动条还原为"滚动时显示"
    await agent.aiTap('个性化');
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiTap('窗口效果');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('一直显示');
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiTap('滚动时显示');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('窗口效果页面中的滚动条设置为"滚动时显示"');

    // 还原控制中心为窗口大小（super+down），再关闭控制中心（alt+F4）
    await device.pressKey('Super', 'Down');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 还原启动器模式（若 beforeAll 切换过）
    if (originalFrame !== 'WindowedFrame') {
      console.log('  还原启动器模式为: ' + originalFrame);
      await system.exec(`sed -i "s/current_frame=.*/current_frame=${originalFrame}/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
  });
});
