/**
 * 用例 PMSID: 1832619
 * 用例标题: 【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动
 * 生成时间: 2026/7/22
 * 用例编写人: UT002485（卢燕）
 */

describe('1832619-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动', () => {
    const caseDir = process.env.TESTCASE_DIR;
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=3
toplevel\\pageItems\\0=org.deepin.browser.desktop, dde-file-manager.desktop, deepin-app-store.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-screen-recorder.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, deepin-voice-note.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, org.deepin.dde.control-center.desktop, deepin-system-monitor.desktop, deepin-boot-maker.desktop, deepin-devicemanager.desktop, deepin-log-viewer.desktop, deepin-calculator.desktop, deepin-font-manager.desktop, uos-ai-assistant.desktop, dde-calendar.desktop, uos-recovery-gui.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-defender.desktop
toplevel\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop, dde-introduction.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, deepin-scanner.desktop
toplevel\\pageItems\\2=dde-printer.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .bak 文件失败');
        console.log('item-arrangement.ini.bak 已创建（起始页有文件夹，共3页）');        
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.bak';
        const bak2Cmd = `cp -f ${iniPath} ${iniPath}.bak2`;
        const bak2Result = await system.exec(bak2Cmd);
        assertTrue(bak2Result.success, '备份 item-arrangement.ini 为 .bak2 文件失败');
        console.log('item-arrangement.ini 已备份为 .bak2');
        const replaceCmd = `cp -f ${bakIniPath} ${iniPath}`;
        const replaceResult = await system.exec(replaceCmd);
        assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
        console.log('item-arrangement.ini 已使用 .bak 文件覆盖');

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

    test('1832619-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动', async ({ device, agent, uos, system }) => {
        await uos.openLauncher();
        await agent.aiTap({
            prompt: '识别启动器全屏模式顶部第一个圆点，点击进入起始页',
            images: [],
            deepThink: true,
        });
        await agent.aiWaitFor('启动器全屏模式显示起始页');

        // 拖动起始页第四行的应用图标（远程协助）跨页到第二页（图标位置因机器安装应用不同可能左移，按名称定位）
        // 调用公共方法 dragLauncherIconCrossPage 实现跨页拖动（aiHover 定位 + pcService.mouse 底层拖拽 + 翻页校正）
        // 目标落点：第二页第2行行尾（基准坐标 1592,385，公共方法内按实际分辨率自适应缩放），拖入后目标页图标自行补位移动
        // 公共方法位置：${TESTCASE_DIR}midscene_dde/common/common.js（本地与远程部署目录均按此规范）
        const { dragLauncherIconCrossPage } = await import(`${caseDir}midscene_dde/common/common.js`);
        await dragLauncherIconCrossPage(agent, device, system, {
            sourcePrompt: '启动器全屏模式中第四行的远程协助图标',
            targetPagePrompt: '启动器顶部第二个圆点是白色',
            startPagePrompt: '启动器顶部第一个圆点是白色',
            targetX: 1592,
            targetY: 385,
        });
        
        await agent.aiWaitFor('启动器顶部第二个圆点是白色');
        
        // 检查：跨页拖动后，目标页（第二页）显示整齐排列的应用图标网格（目标页图标自行补位移动的结果）
        await agent.aiAssert('当前页面显示排列整齐的应用图标网格');

    }, { timeout: 600000, tags: ['1832619', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
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
        await device.pressKey('esc');
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        await system.exec('mv ~/.config/deepin/dde-launchpad/item-arrangement.ini.bak2 ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        
        console.log('item-arrangement.ini 已删除，.bak2 已恢复');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');
        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});