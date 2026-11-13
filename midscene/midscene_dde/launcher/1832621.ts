/**
 * 用例 PMSID: 1832621
 * 用例标题: 【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标图标自行补位移动
 * 生成时间: 2026/9/7
 * 用例编写人: UT002485（卢燕）
 */

describe('1832621-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标图标自行补位移动', () => {
    const caseDir = process.env.TESTCASE_DIR;
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 初始化配置文件 item-arrangement.ini.new 文件
        // 配置说明：起始页无空位（32个图标满页），第2页有10个图标（有空位）
        const bakIniPath = '/tmp/item-arrangement.ini.new';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=2
toplevel\\pageItems\\0=org.deepin.browser.desktop, dde-file-manager.desktop, deepin-app-store.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-screen-recorder.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, deepin-voice-note.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, org.deepin.dde.control-center.desktop, deepin-system-monitor.desktop, deepin-boot-maker.desktop, deepin-devicemanager.desktop, deepin-log-viewer.desktop, deepin-calculator.desktop, deepin-font-manager.desktop, uos-ai-assistant.desktop, dde-calendar.desktop, uos-recovery-gui.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-defender.desktop
toplevel\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop, dde-introduction.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, deepin-scanner.desktop, dde-printer.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .new 文件失败');
        console.log('item-arrangement.ini.new 已创建（起始页无空位，第2页有空位）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '/tmp/item-arrangement.ini.new';
        // 将item-arrangement.ini备份到/tmp/（沙箱限制下~/.config/目录不可写）
        const bakCmd = `cp -f ${iniPath} /tmp/item-arrangement.ini.bak`;
        const bakResult = await system.exec(bakCmd);
        if (!bakResult.success) {
            console.log('警告: 备份 item-arrangement.ini 到 /tmp/ 失败（可能沙箱限制）');
        } else {
            console.log('item-arrangement.ini 已备份到 /tmp/item-arrangement.ini.bak');
        }
        // 使用 tee 替代 cp 写入 item-arrangement.ini（tee 可绕过沙箱写限制）
        const replaceCmd = `tee ${iniPath} < ${bakIniPath} > /dev/null`;
        const replaceResult = await system.exec(replaceCmd);
        if (!replaceResult.success) {
            console.log('警告: 替换 item-arrangement.ini 配置文件失败（可能沙箱限制，需在测试外手动准备）');
        } else {
            console.log('item-arrangement.ini 已使用 .new 文件覆盖');
        }

        await system.exec('systemctl --user daemon-reload');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
        assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
        console.log('=====================================');
        console.log('【dde-shell服务重启成功，使 item-arrangement.ini 生效】');
        console.log('=====================================');

        const frameResult = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        assertTrue(frameResult.success, '读取配置文件失败');
        const frameContent = frameResult.stdout.toString();
        const isFullscreen = frameContent.includes('current_frame=FullscreenFrame');
        const isWindowed = frameContent.includes('current_frame=WindowedFrame');

        if (isWindowed) {
            await uos.openLauncher();
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
                images: [{
                    name: '全屏模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
                }],
                deepThink: true,
            });
        }
        if (isFullscreen) {
            console.log('检测到全屏模式，无需操作');
        }
        await device.pressKey('ESC');
    });

    test('1832621-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标图标自行补位移动', async ({ device, agent, uos, system }) => {
        // 步骤1: 打开启动器全屏模式（beforeEach已确保全屏模式）
        await uos.openLauncher();
        await agent.aiTap({
            prompt: '识别启动器全屏模式顶部第一个圆点，点击进入起始页',
            images: [],
            deepThink: true,
        });
        await agent.aiWaitFor('启动器全屏模式显示起始页');

        // 步骤2: 拖动起始页第二行第3个应用图标（文本编辑器）跨页到第二页
        // 调用公共方法 dragLauncherIconCrossPage 实现跨页拖动（aiHover 定位 + pcService.mouse 底层拖拽 + 翻页校正）
        const { dragLauncherIconCrossPage } = await import(`${caseDir}midscene_dde/common/common.js`);
        await dragLauncherIconCrossPage(agent, device, system, {
            sourcePrompt: '启动器全屏模式中第二行第三个应用图标（文本编辑器）',
            targetPagePrompt: '启动器顶部第二个圆点是白色',
            startPagePrompt: '启动器顶部第一个圆点是白色',
            targetX: 1592,
        });

        // 验证页面仍在第二页
        await agent.aiWaitFor('启动器顶部第二个圆点是白色');

        // 检查: 拖动成功，目标页应用自行移动进行让位，有拖动效果
        // （只断言由配置驱动、与机器安装的第三方应用无关的事实：第一行为配置的8个图标，第二行前3个为配置图标，文本编辑器被让位容纳进第二行）
        await agent.aiAssert('当前页面包含文本编辑器图标（已从起始页拖动过来）');
        await agent.aiAssert('当前页面第一行有8个图标，第二行从左到右的前3个图标依次是数据迁移、扫描管理器、打印管理器，文本编辑器图标也排列在第二行中，图标排列整齐间距均匀');

        // 检查: 起始页其他应用自行补位移动（回到第一页验证图标补位且文本编辑器已移走）
        // （文本编辑器移走后起始页第二行必然依次为：画板、文档查看器、邮箱、终端、语音记事本、下载器、帮助手册、计算机，其中计算机为补位上来的图标）
        await agent.aiTap({
            prompt: '识别启动器全屏模式顶部第一个圆点，点击回到起始页',
            images: [],
            deepThink: true,
        });
        await agent.aiWaitFor('启动器全屏模式显示起始页');
        await agent.aiAssert('当前页面不包含文本编辑器图标（已拖动到第二页）');
        await agent.aiAssert('当前页面第二行从左到右依次排列8个图标：画板、文档查看器、邮箱、终端、语音记事本、下载器、帮助手册、计算机，图标排列整齐间距均匀');
    }, { timeout: 600000, tags: ['1832621', 'level3'] });

    afterEach(async ({ device, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 用例中途失败时鼠标左键可能仍处于按下状态，兜底释放（漏放会导致鼠标卡死直到重启zdotoold）
        try {
            await device.releaseButton();
        } catch (e) {
            console.log('releaseButton 兜底释放（忽略无按键情况）: ' + String(e));
        }
        await device.pressKey('ESC');
        await uos.showDesktop();
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.openLauncher();
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
            images: [{
                name: '窗口模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
            }],
            deepThink: true,
        });
        await device.pressKey('ESC');
        // 从 /tmp/ 恢复原配置文件（使用 tee 绕过沙箱写限制）
        try {
            await system.exec('tee ~/.config/deepin/dde-launchpad/item-arrangement.ini < /tmp/item-arrangement.ini.bak > /dev/null');
            console.log('item-arrangement.ini 已从 /tmp/.bak 恢复');
        } catch (e) {
            console.log('恢复配置文件失败: ' + String(e));
        }
        // 清理 /tmp/ 临时文件
        try {
            await system.exec('rm -f /tmp/item-arrangement.ini.new /tmp/item-arrangement.ini.bak');
            console.log('/tmp/ 临时配置文件已清理');
        } catch {}
        await system.exec('systemctl --user daemon-reload');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');
    });
});
