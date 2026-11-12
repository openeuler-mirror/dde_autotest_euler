/**
 * 用例 PMSID: 1832397
 * 用例标题: 【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移出应用文件夹，从文件夹下方拖动图标离开文件夹边界，不松手
 * 生成时间: 2026-09-09
 * 用例编写人: UT002485（卢燕）
 */

describe('1832397-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移出应用文件夹，从文件夹下方拖动图标离开文件夹边界，不松手', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    await system.exec(`cp -f ${iniPath} /tmp/item-arrangement.ini.bak2`);
    const bakIniPath = '/tmp/item-arrangement.ini.bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop, deepin-scanner.desktop, deepin-screen-recorder.desktop, deepin-picker.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop, dde-computer.desktop, dde-trash.desktop, dde-printer.desktop, dde-calendar.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-boot-maker.desktop, deepin-log-viewer.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, uos-recovery-gui.desktop, org.deepin.dde.control-center.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-manual.desktop
toplevel\\pageItems\\1=deepin-calculator.desktop, deepin-font-manager.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop
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

  test('1832397-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移出应用文件夹，从文件夹下方拖动图标离开文件夹边界，不松手', async ({ device, agent, uos, system }) => {
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

    // 步骤2：打开应用文件夹
    console.log('步骤2：打开应用文件夹');
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 步骤3：从文件夹下方拖动图标离开文件夹边界，不松手（检查界面状态）
    console.log('步骤3：从文件夹下方拖动图标离开文件夹边界，不松手');
    // 定位文件夹内第二行第一个应用图标（系统监视器）作为拖动源
    await agent.aiHover('应用文件夹弹窗内第二行第一个应用图标（系统监视器）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const pcService = device.getPCService();
    const pos = await pcService.mouse.getPosition();
    const srcX = pos.x;
    const srcY = pos.y;
    console.log(`源图标位置: (${srcX}, ${srcY})`);

    // 按下鼠标左键（不松手）
    await device.pressButton();
    await new Promise(resolve => setTimeout(resolve, 500));

    // 从文件夹下方向下拖动，离开文件夹边界（不松手）
    const targetY = srcY + 200;
    const targetX = srcX;
    const step = 15;
    const delayMs = 15;
    let currY = srcY;
    while (currY < targetY) {
      currY = Math.min(currY + step, targetY);
      await pcService.mouse.move([{ x: srcX, y: currY }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    await pcService.mouse.move([{ x: targetX, y: targetY }]);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 不松手，验证此时文件夹已关闭、显示启动器页面
    console.log('不松手，检查界面状态');
    await agent.aiAssert('当前不松手状态下，应用文件夹弹窗已关闭，显示启动器窗口页面');

    // 松开鼠标左键
    await device.releaseButton();
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`拖拽完成: (${srcX}, ${srcY}) -> (${targetX}, ${targetY})`);

    // 步骤4：验证应用已移出文件夹，显示启动器页面
    console.log('步骤4：验证应用已移出文件夹');
    await agent.aiAssert('应用文件夹弹窗已关闭，显示启动器窗口页面');
  }, { timeout: 600000, tags: ['1832397', 'level3'] });

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
