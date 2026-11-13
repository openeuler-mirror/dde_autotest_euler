/**
 * 用例 PMSID: 1832617
 * 用例标题: 【启动器】【全屏模式】【自由拖动排序】同页内拖动应用或文件夹，图标自行补位移动
 * 生成时间: 2026/7/22
 * 用例编写人: UT002485（卢燕）
 */

describe('1832617-【启动器】【全屏模式】【自由拖动排序】同页内拖动应用或文件夹，图标自行补位移动', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=deepin-calculator.desktop, dde-calendar.desktop
toplevel\\pageCount=3
toplevel\\pageItems\\0=org.deepin.browser.desktop, dde-file-manager.desktop, deepin-app-store.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-screen-recorder.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-mail.desktop, deepin-terminal.desktop, deepin-voice-note.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, org.deepin.dde.control-center.desktop, deepin-system-monitor.desktop, deepin-boot-maker.desktop, deepin-devicemanager.desktop, deepin-log-viewer.desktop, deepin-font-manager.desktop, uos-ai-assistant.desktop, uos-recovery-gui.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-defender.desktop, internal/folders/1
toplevel\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-editor.desktop, deepin-diskmanager.desktop, dde-introduction.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, deepin-scanner.desktop
toplevel\\pageItems\\2=dde-printer.desktop
MIDSCEOF`;

        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .bak 文件失败');
        console.log('item-arrangement.ini.bak 已创建');        
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

    test('1832617-【启动器】【全屏模式】【自由拖动排序】同页内拖动应用或文件夹，图标自行补位移动', async ({ device, agent, uos, system }) => {
        await uos.openLauncher();
        await agent.aiTap({
            prompt: '识别启动器全屏模式顶部第一个圆点，点击进入起始页',
            images: [],
            deepThink: true,
        });
        await agent.aiWaitFor('启动器全屏模式显示起始页');

        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        
        const screenSize = screenInfo.stdout.trim().split('x');
        const actualWidth = parseInt(screenSize[0]);
        const actualHeight = parseInt(screenSize[1]);
        const baseWidth = 1920;
        const baseHeight = 1080;
        const scaleX = actualWidth / baseWidth;
        const scaleY = actualHeight / baseHeight;
        console.log(`分辨率自适应: ${actualWidth}x${actualHeight}, 缩放比例: x=${scaleX.toFixed(2)}, y=${scaleY.toFixed(2)}`);

        // ========== 步骤一：同页内拖动应用图标 ==========
        // 网格坐标：列间距160，行间距125；列中心 324/484/644/804/964/1124/1284/1444，行中心 260/385/510/635
        // 源位置：第2行第3列应用图标；目标位置：第2行第5列（向右拖2格）
        const baseAppSrcX = 644, baseAppSrcY = 385;
        const baseAppTgtX = 964, baseAppTgtY = 385;
        const appSrcX = Math.floor(baseAppSrcX * scaleX), appSrcY = Math.floor(baseAppSrcY * scaleY);
        const appTgtX = Math.floor(baseAppTgtX * scaleX), appTgtY = Math.floor(baseAppTgtY * scaleY);
        console.log(`步骤一 - 拖动应用图标: 源位置(${appSrcX},${appSrcY}), 目标(${appTgtX},${appTgtY})`);

        await system.exec(`xdotool mousemove ${appSrcX} ${appSrcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        for (let x = appSrcX; x <= appTgtX; x += 50) {
            await system.exec(`xdotool mousemove ${x} ${appSrcY}`);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        await system.exec(`xdotool mousemove ${appTgtX} ${appTgtY}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('步骤一 - 已在目标位置停留 1 秒: (' + appTgtX + ',' + appTgtY + ')');
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('步骤一 - 鼠标拖拽完成: (' + appSrcX + ',' + appSrcY + ') -> (' + appTgtX + ',' + appTgtY + ')');
        await agent.aiAssert('当前页面应用图标排列整齐，没有错位');
        console.log('步骤一 - 应用图标拖动验证通过');

        // ========== 步骤二：同页内拖动文件夹 ==========
        // 文件夹位于第4行第6列（page0第30个元素，internal/folders/1）
        // 源位置：第4行第6列文件夹；目标位置：第4行第4列（向左拖2格）
        const baseFolderSrcX = 1124, baseFolderSrcY = 635;
        const baseFolderTgtX = 804, baseFolderTgtY = 635;
        const folderSrcX = Math.floor(baseFolderSrcX * scaleX), folderSrcY = Math.floor(baseFolderSrcY * scaleY);
        const folderTgtX = Math.floor(baseFolderTgtX * scaleX), folderTgtY = Math.floor(baseFolderTgtY * scaleY);
        console.log(`步骤二 - 拖动文件夹: 源位置(${folderSrcX},${folderSrcY}), 目标(${folderTgtX},${folderTgtY})`);

        await system.exec(`xdotool mousemove ${folderSrcX} ${folderSrcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        for (let x = folderSrcX; x >= folderTgtX; x -= 50) {
            await system.exec(`xdotool mousemove ${x} ${folderSrcY}`);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        await system.exec(`xdotool mousemove ${folderTgtX} ${folderTgtY}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('步骤二 - 已在目标位置停留 1 秒: (' + folderTgtX + ',' + folderTgtY + ')');
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('步骤二 - 鼠标拖拽完成: (' + folderSrcX + ',' + folderSrcY + ') -> (' + folderTgtX + ',' + folderTgtY + ')');
        await agent.aiAssert('当前页面应用图标排列整齐，没有错位');
        console.log('步骤二 - 文件夹拖动验证通过');

    }, { timeout: 600000, tags: ['1832617', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
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