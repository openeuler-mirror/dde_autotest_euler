/**
 * 用例 PMSID: 1832365
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动
 * 生成时间: 2026-09-04
 * 用例编写人: UT005044(王亮)
 */

describe('1832365-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹2页，第1页12个应用（占满），第2页3个应用
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-draw.desktop, deepin-editor.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop, deepin-movie.desktop, dde-computer.desktop, deepin-font-manager.desktop, deepin-calculator.desktop, dde-calendar.desktop
1\\pageItems\\1=deepin-app-store.desktop, deepin-compressor.desktop, deepin-music.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹第1页12个应用，第2页3个应用）');
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

  test('1832365-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动', async ({ device, agent, uos, system }) => {
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

    // 步骤 3: 拖动第1页最后一个图标到浮层右侧，等待翻页到第2页后松开鼠标
    console.log('步骤 3: 拖动第1页最后一个图标到浮层右侧，等待翻页到第2页后松开鼠标');
    const pcService = device.getPCService();

    // 使用aiHover定位第1页最后一个图标（右下角），通过PCService获取物理坐标
    console.log('定位文件夹内第1页最后一个应用图标');
    await agent.aiHover('应用文件夹浮层框内第1页最后右下角的应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const pos = await pcService.mouse.getPosition();
    const srcX = pos.x;
    const srcY = pos.y;
    const targetX = srcX + 100;
    console.log(`源图标坐标(物理): (${srcX}, ${srcY}), 目标X: ${targetX}`);

    // 按下鼠标
    console.log('按下鼠标');
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));

    // 缓慢拖到浮层内最右侧
    console.log('缓慢拖拽图标到浮层内最右侧');
    const steps = 30;
    const stepX = (targetX - srcX) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(srcX + stepX * i), y: srcY }]);
      await new Promise(r => setTimeout(r, 25));
    }

    // 悬浮在浮层最右侧，等待1秒翻页到第2页
    console.log('悬浮在浮层最右侧，等待翻页到第2页');
    await pcService.mouse.move([{ x: targetX, y: srcY }]);
    await new Promise(r => setTimeout(r, 1000));

    // 松开鼠标，图标放到第2页
    console.log('释放鼠标');
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));

   // 检查1: 切换第二页面，显示4个应用图标
    await agent.aiAssert('应用文件夹浮层框内的当前页4个应用图标，第4个位置应用图标为：日历');

    // 步骤 4: 点击第2个翻页圆点切换到第2页
    console.log('步骤 4: 切换到第1页');
    await agent.aiTap('应用文件夹浮层框底部第1个翻页圆点', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));

    // 检查2: 第1页少了1个应用图标
    console.log('检查第1页有空位，少了1个应用图标');
    await agent.aiAssert('应用文件夹浮层框内最后的位置为空白，当前页不存在应用图标：日历');

  }, { timeout: 1000000, tags: ['1832365', 'level3'] });

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
