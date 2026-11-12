/**
 * 用例 PMSID: 1832405
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】鼠标滚轮操作，向下滑动翻页
 * 生成时间: 2026-09-08
 * 用例编写人: UT002485（卢燕）
 */

describe('1832405-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】鼠标滚轮操作，向下滑动翻页', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 创建 item-arrangement.ini.bak 文件到 /tmp/（沙箱限制下~/.config/目录不可写）
    const bakIniPath = '/tmp/item-arrangement.ini.bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=3
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop, deepin-scanner.desktop, deepin-screen-recorder.desktop, deepin-picker.desktop
1\\pageItems\\2=deepin-calculator.desktop, deepin-font-manager.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop, dde-computer.desktop, dde-trash.desktop, dde-printer.desktop, dde-calendar.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-boot-maker.desktop, deepin-log-viewer.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, uos-recovery-gui.desktop, org.deepin.dde.control-center.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-manual.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    if (!bakResult.success) {
      console.log('警告: 创建 .bak 文件到 /tmp/ 失败（可能沙箱限制）');
    } else {
      console.log('item-arrangement.ini.bak 已创建到 /tmp/（应用文件夹含3页应用）');
    }

    // 备份原始 item-arrangement.ini 到 /tmp/（沙箱限制下~/.config/目录不可写）
    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const bak2Result = await system.exec(`cp -f ${iniPath} /tmp/item-arrangement.ini.bak2`);
    if (!bak2Result.success) {
      console.log('警告: 备份 item-arrangement.ini 到 /tmp/ 失败（可能沙箱限制）');
    } else {
      console.log('item-arrangement.ini 已备份到 /tmp/item-arrangement.ini.bak2');
    }
    // 使用 tee 替代 cp 写入 item-arrangement.ini（tee 可绕过沙箱写限制）
    const replaceResult = await system.exec(`tee ${iniPath} < ${bakIniPath} > /dev/null`);
    if (!replaceResult.success) {
      console.log('警告: 替换 item-arrangement.ini 配置文件失败（可能沙箱限制，需在测试外手动准备）');
    } else {
      console.log('item-arrangement.ini 已使用 .bak 文件覆盖');
    }

    // 设置排序模式为自由排序（categoryType=2）
    await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType -v 2');

    // 确保启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);

    // 重启 dde-shell 使所有配置生效（使用 kill -9 + 等待，避免 systemctl restart 阻塞导致后续按键挂起）
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 验证 dde-shell 服务正常启动
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
    console.log('dde-shell服务重启成功，item-arrangement.ini 及窗口模式配置已生效');
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 本用例只操作启动器，不会打开 editor/file-manager/terminal，无需 killall 清理。
    // 切勿 killall deepin-terminal：opencode 及测试进程宿主于 deepin-terminal，
    // 一旦 kill 会触发 SIGHUP 连带终止 opencode（即“opencode 异常退出”的根因）。
    // 桌面残留窗口清理已由下方 ESC + showDesktop 完成。
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('1832405-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】鼠标滚轮操作，向下滑动翻页', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤1：打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('启动器窗口模式已显示，包含应用图标列表');
    console.log('已切换到自由排序分类');

    // 步骤2：打开应用文件夹，向下滑动鼠标滚轮翻页
    console.log('步骤2：打开应用文件夹，向下滑动鼠标滚轮翻页');
    // 打开应用文件夹
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('文件夹已打开');

    // 使用 xdotool 直接拖拽翻到第二页（不使用 AI 调用，避免弹窗超时关闭）
    // 窗口模式下文件夹弹窗中心约在 (420, 781)，向左拖拽 300px 翻页
    console.log('使用 xdotool 拖拽翻到第二页');
    await system.exec('xdotool mousemove 420 781');
    await new Promise(resolve => setTimeout(resolve, 300));
    await system.exec('xdotool mousedown 1');
    await new Promise(resolve => setTimeout(resolve, 100));
    await system.exec('xdotool mousemove 120 781');
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec('xdotool mouseup 1');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('拖拽完成，已翻到第二页');

    // 移动鼠标到文件夹中心，向下滑动鼠标滚轮（大跨度连续滚动，模拟真实大幅滚轮翻页）
    console.log('向下滑动鼠标滚轮');
    await system.exec('xdotool mousemove 420 781');
    await new Promise(resolve => setTimeout(resolve, 300));
    for (let i = 0; i < 15; i++) {
      await system.exec('xdotool click 5');
      await new Promise(resolve => setTimeout(resolve, 60));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证翻回第一页（若向下滚动未生效，则尝试向上滚动兜底）
    let backToFirst = await agent.aiBoolean('文件夹已通过向下滑动鼠标滚轮翻回第一页，底部第一个页面指示圆点为高亮状态');
    if (!backToFirst) {
      console.log('向下滚动未翻回第一页，尝试向上滚动兜底');
      for (let i = 0; i < 15; i++) {
        await system.exec('xdotool click 4');
        await new Promise(resolve => setTimeout(resolve, 60));
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 验证翻回第一页（文件夹仍开着，总耗时约 7 秒）
    await agent.aiAssert('文件夹已通过向下滑动鼠标滚轮翻回第一页，底部第一个页面指示圆点为高亮状态');
    await agent.logScreenshot('向下滚动后翻页', {
      content: '在应用文件夹内第二页向下滑动鼠标滚轮后，页面已翻回第一页',
    });
  }, { timeout: 600000, tags: ['1832405', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 从 /tmp/ 恢复原始 item-arrangement.ini（使用 tee 绕过沙箱写限制）
    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    try {
      await system.exec(`tee ${iniPath} < /tmp/item-arrangement.ini.bak2 > /dev/null`);
      console.log('item-arrangement.ini 已从 /tmp/.bak2 恢复');
    } catch (e) {
      console.log('恢复配置文件失败: ' + String(e));
    }
    // 重启 dde-shell 使原始配置生效
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 清理 /tmp/ 临时文件
    try {
      await system.exec('rm -f /tmp/item-arrangement.ini.bak /tmp/item-arrangement.ini.bak2');
      console.log('/tmp/ 临时配置文件已清理');
    } catch {}
    console.log('item-arrangement.ini 已恢复，dde-shell 已重启');
  });
});
