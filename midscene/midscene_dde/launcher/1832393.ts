/**
 * 用例 PMSID: 1832393
 * 用例标题: 【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移入应用文件夹，当前页有空位，移入应用图标到当前页，检查应用文件夹
 * 生成时间: 2026-09-09
 * 用例编写人: UT002485（卢燕）
 */

describe('1832393-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移入应用文件夹，当前页有空位，移入应用图标到当前页，检查应用文件夹', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    await system.exec(`cp -f ${iniPath} /tmp/item-arrangement.ini.bak2`);
    const bakIniPath = '/tmp/item-arrangement.ini.bak';
    // 预置：应用文件夹2页应用，第一页当前有空位（留出空位用于移入后自动补位）
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop, dde-computer.desktop, dde-trash.desktop, dde-printer.desktop, dde-calendar.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-boot-maker.desktop, deepin-log-viewer.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, uos-recovery-gui.desktop, org.deepin.dde.control-center.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-manual.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    if (!bakResult.success) {
      console.log('警告: 创建 .bak 文件失败');
    }
    const replaceResult = await system.exec(`tee ${iniPath} < ${bakIniPath} > /dev/null`);
    if (!replaceResult.success) {
      console.log('警告: 替换配置文件失败');
    }

    await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType -v 2');
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
    console.log('dde-shell服务重启成功，配置已生效');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1500));
  });

  test('1832393-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移入应用文件夹，当前页有空位，移入应用图标到当前页，检查应用文件夹', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤1：打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2500));
    const launcherChk = await system.exec(`DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority xdotool search --name launchpad 2>/dev/null || true`);
    if (!(launcherChk.stdout || '').trim()) {
      console.log('启动器窗口未检测到，重试打开');
      await device.pressKey('Super');
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
    await agent.aiAssert('启动器窗口模式已显示');

    // 步骤2：定位源应用图标（顶层应用商店）和目标文件夹图标（系统管理）
    console.log('步骤2：定位源应用图标和目标文件夹图标');
    const pcService = device.getPCService();
    const srcLoc = await agent.aiLocate('启动器窗口模式中顶层的应用商店应用图标');
    const srcX = srcLoc.center[0];
    const srcY = srcLoc.center[1];
    console.log(`源应用图标位置: (${srcX}, ${srcY})`);
    const folderLoc = await agent.aiLocate('启动器窗口模式中名称为系统管理的应用文件夹图标');
    const tgtX = folderLoc.center[0];
    const tgtY = folderLoc.center[1];
    console.log(`目标文件夹图标位置: (${tgtX}, ${tgtY})`);

    // 步骤3：拖动应用商店图标，移入应用文件夹（当前页有空位）
    console.log('步骤3：拖动应用商店图标移入应用文件夹');
    await pcService.mouse.move([{ x: srcX, y: srcY }]);
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressButton();
    await new Promise(resolve => setTimeout(resolve, 500));

    // 分步拖拽到目标文件夹图标中心
    const step = 15;
    const delayMs = 12;
    let x = srcX, y = srcY;
    while (x !== tgtX || y !== tgtY) {
      const dx = Math.abs(tgtX - x);
      const dy = Math.abs(tgtY - y);
      if (dx > step) x += Math.sign(tgtX - x) * step; else x = tgtX;
      if (dy > step) y += Math.sign(tgtY - y) * step; else y = tgtY;
      await pcService.mouse.move([{ x, y }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    await pcService.mouse.move([{ x: tgtX, y: tgtY }]);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 在文件夹图标上释放图标
    await device.releaseButton();
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log(`拖拽完成: (${srcX}, ${srcY}) -> (${tgtX}, ${tgtY})`);

    // 步骤4：验证 应用图标已移入应用文件夹，文件夹从第一页开始自动补位
    console.log('步骤4：验证应用已移入文件夹');
    await agent.aiAssert('应用商店图标已移入系统管理应用文件夹，文件夹内第一页显示应用商店图标（自动补位）');
  }, { timeout: 600000, tags: ['1832393', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    try {
      await system.exec(`tee ${iniPath} < /tmp/item-arrangement.ini.bak2 > /dev/null`);
      console.log('item-arrangement.ini 已恢复');
    } catch (e) {
      console.log('恢复配置文件失败: ' + String(e));
    }
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 5000));
    try {
      await system.exec('rm -f /tmp/item-arrangement.ini.bak /tmp/item-arrangement.ini.bak2');
    } catch {}
  });
});
