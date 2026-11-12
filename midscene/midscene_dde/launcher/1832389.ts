/**
 * 用例 PMSID: 1832389
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】应用图标移入应用文件夹，与文件夹重合度为图标大小的一半及以上释放图标，检查应用文件夹
 * 生成时间: 2026-09-04
 * 用例编写人: UT005044(王亮)
 */

describe('1832389-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】应用图标移入应用文件夹，与文件夹重合度为图标大小的一半及以上释放图标，检查应用文件夹', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹1页3个应用，启动器顶层有文件夹和浏览器
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-draw.desktop, deepin-editor.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop, deepin-movie.desktop, dde-computer.desktop, deepin-font-manager.desktop, deepin-calculator.desktop, dde-calendar.desktop, deepin-music.desktop
1\\pageItems\\1=deepin-app-store.desktop, deepin-mail.desktop, dde-printer.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹1页3个应用）');
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

  test('1832389-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】应用图标移入应用文件夹，与文件夹重合度为图标大小的一半及以上释放图标，检查应用文件夹', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 拖动浏览器图标到应用文件夹上（重合度一半以上），释放图标
    console.log('步骤 2: 拖动浏览器图标到应用文件夹上，释放图标');
    const pcService = device.getPCService();

    // 使用aiHover定位浏览器图标（启动器列表中的应用）
    console.log('定位启动器列表中的浏览器图标');
    await agent.aiHover('启动器左侧列表中的浏览器图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const appPos = await pcService.mouse.getPosition();
    const appX = appPos.x;
    const appY = appPos.y;
    console.log(`浏览器图标坐标(物理): (${appX}, ${appY})`);

    // 使用aiHover定位应用文件夹图标（启动器列表中的文件夹）
    console.log('定位启动器列表中的系统管理应用文件夹图标');
    await agent.aiHover('启动器左侧列表中名称为系统管理的应用文件夹图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const folderPos = await pcService.mouse.getPosition();
    const folderX = folderPos.x;
    const folderY = folderPos.y;
    console.log(`应用文件夹图标坐标(物理): (${folderX}, ${folderY})`);

    // 按下鼠标并缓慢拖动浏览器图标到文件夹图标上（重合度100%，大于一半）
    console.log('按下鼠标并拖动浏览器图标到文件夹上');
    await pcService.mouse.move([{ x: appX, y: appY }]);
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));

    const steps = 15;
    const stepX = (folderX - appX) / steps;
    const stepY = (folderY - appY) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(appX + stepX * i), y: Math.round(appY + stepY * i) }]);
      await new Promise(r => setTimeout(r, 50));
    }

    // 悬浮在文件夹上1秒，等待文件夹高亮特效
    console.log('悬浮在文件夹上，等待高亮特效');
    await new Promise(r => setTimeout(r, 1000));

    // 释放鼠标，浏览器图标加入应用文件夹
    console.log('释放鼠标，浏览器图标加入应用文件夹');
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));

    // 检查1: 拖动的图标已移入，存在系统管理应用文件夹内第二页
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiAssert('应用文件夹浮层框内当前页占满，保持12个应用图标，不存在应用图标：浏览器，底部有2个翻页圆点');

    await agent.aiTap('应用文件夹浮层框底部的第2个翻页圆点', { deepThink: true });
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiAssert('应用文件夹浮层框内当前页有4个应用图标，第4个位置上显示应用图标：浏览器，');

  }, { timeout: 600000, tags: ['1832389', 'level3'] });

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
