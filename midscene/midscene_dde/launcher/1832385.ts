/**
 * 用例 PMSID: 1832385
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】往右拖动第一页应用图标，离开文件夹内边界（隐藏边界）
 * 生成时间: 2026-09-04
 * 用例编写人: UT005044(王亮)
 */

describe('1832385-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】往右拖动第一页应用图标，离开文件夹内边界（隐藏边界）', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹2页，每页3个应用
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-draw.desktop, deepin-editor.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop, deepin-movie.desktop, dde-computer.desktop, deepin-font-manager.desktop, deepin-calculator.desktop, dde-calendar.desktop, deepin-music.desktop
1\\pageItems\\1=deepin-diskmanager.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹2页，每页3个应用）');
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const replaceResult = await system.exec(`cp -f ${bakIniPath} ${iniPath}`);
    assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
    console.log('item-arrangement.ini 已使用 .22bak 文件覆盖');

    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
    console.log('dde-shell 服务已重启，item-arrangement.ini 已生效');

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

  test('1832385-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】往右拖动第一页应用图标，离开文件夹内边界（隐藏边界）', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 打开应用文件夹
    console.log('步骤 2: 打开应用文件夹');
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 1000));

    // 步骤 3: 拖动第1页第一个图标到浮层右侧，等待翻页到第2页后松开鼠标
    console.log('步骤 3: 拖动第1页第一个图标到浮层右侧，等待翻页到第2页');
    const pcService = device.getPCService();

    // 使用aiHover定位第一个图标
    console.log('定位文件夹内第四个应用图标');
    await agent.aiHover('应用文件夹浮层框内的第四个应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const pos = await pcService.mouse.getPosition();
    const srcX = pos.x;
    const srcY = pos.y;
    // 向右拖动300px到达浮层右边界
    const targetX = srcX + 60;
    console.log(`源图标坐标(物理): (${srcX}, ${srcY}), 目标X: ${targetX}`);

    // 按下鼠标
    console.log('按下鼠标');
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 1000));
    // 悬浮在浮层右侧，等待1秒翻页到第2页
    console.log('悬浮在浮层右侧，等待翻页到第2页');
    await pcService.mouse.move([{ x: targetX, y: srcY }]);
    await new Promise(r => setTimeout(r, 1000));
    
    // 缓慢拖到浮层右侧
    console.log('缓慢拖拽图标到浮层右侧');
    const steps = 40;
    const stepX = (targetX - srcX) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(srcX + stepX * i), y: srcY }]);
      await new Promise(r => setTimeout(r, 50));
    }

    // 期间做微小移动保持拖拽状态活跃，总等待2秒
    console.log('悬浮在浮层最右侧，等待新建页触发（保持按住不放，微小移动）');
    // for (let i = 0; i < 4; i++) {
    //   await pcService.mouse.move([{ x: targetX + (i % 2 === 0 ? 0 : 2), y: srcY }]);
    //   await new Promise(r => setTimeout(r, 500));
    // }
    await pcService.mouse.move([{ x: (srcX - 100), y: srcY }]);
    await new Promise(r => setTimeout(r, 1000));

    // 松开鼠标，图标移到第2页
    console.log('释放鼠标');
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 1000));
    console.log('已释放鼠标，预期图标已移动到第2页');

    // 检查1: 目标文件夹显示应用图标
    await agent.aiAssert('应用文件夹浮层框内存在应用图标：相册，右侧没有应用图标');

  }, { timeout: 600000, tags: ['1832385', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
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
