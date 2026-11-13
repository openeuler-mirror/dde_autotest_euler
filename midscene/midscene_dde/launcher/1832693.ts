/**
 * 用例 PMSID: 1832693
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】应用图标移出应用文件夹，从文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹
 * 生成时间: 2026/7/17
 * 用例编写人: UT001707(陈慧)
 * 来源用例: 1828361
 */

describe('1832693-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】应用图标移出应用文件夹，从文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：应用文件夹有2页应用，两页均有空位
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop
1\\pageItems\\1=deepin-terminal.desktop, downloader.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, internal/folders/2, org.deepin.browser.desktop, deepin-calculator.desktop, deepin-calendar.desktop, deepin-camera.desktop, deepin-music.desktop
toplevel\\pageItems\\1=deepin-screen-recorder.desktop, deepin-voice-note.desktop, deepin-movie.desktop, deepin-picker.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（含2个应用文件夹，每个2页且均有空位）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

        // 预置步骤1：使用 .22bak 文件替换原 item-arrangement.ini
        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

        const replaceCmd = `cp -f ${bakIniPath} ${iniPath}`;
        const replaceResult = await system.exec(replaceCmd);
        assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
        console.log('item-arrangement.ini 已使用 .22bak 文件覆盖');

        await system.exec('systemctl --user daemon-reload');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
        assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
        console.log('=====================================');
        console.log('【dde-shell服务重启成功，使 item-arrangement.ini 生效】');
        console.log('=====================================');

        // 预置步骤2：确保启动器为全屏模式
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        assertTrue(result.success, '读取配置文件失败');

        const content = result.stdout.toString();
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        const isWindowed = content.includes('current_frame=WindowedFrame');

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

    test('1832693-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】应用图标移出应用文件夹，从文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹1
        await agent.aiTap('应用列表中的第一个"应用文件夹"图标');
        await agent.aiWaitFor('第一个应用文件夹已打开，界面显示文件夹内第1页应用');

        // 步骤 3: 从应用文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹（第二个应用文件夹）
        // 通过 xdotool 直接控制鼠标完成拖拽（不使用 aiDrag / aiAction）
        // 源位置：第一个应用文件夹内的"文件管理器"应用图标
        // 目标位置：第二个应用文件夹的图标位置
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        // 源位置：第一个应用文件夹内的"文件管理器"应用图标（约 649, 293）
        // 目标位置：第二个应用文件夹（约 1380, 410）
        const srcX = 649, srcY = 293;
        const tgtX = 1489, tgtY = 385;
        const midX = Math.floor((srcX + tgtX) / 2);
        const midY = Math.floor((srcY + tgtY) / 2);
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步移动到目标位置（模拟真实拖拽过程：先向左拖出文件夹边界，再向右移到第二个文件夹）
        await system.exec(`xdotool mousemove 500 ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${midX} ${midY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtX} ${tgtY}`);
        // 4) 到达目标位置后停留 1 秒钟，再释放鼠标
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已在目标位置停留 5 秒: (' + tgtX + ',' + tgtY + ')');
        // 5) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('鼠标拖拽完成: (' + srcX + ',' + srcY + ') -> (' + tgtX + ',' + tgtY + ')');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 检查: 文件夹关闭，显示启动器页面，应用被移出当前应用文件夹，移动到了目标应用文件夹
        await agent.aiAssert('显示启动器页面，显示有两个“系统管理”文件夹')
        await agent.aiTap('应用列表中的第二个"系统管理"文件夹');
        await agent.aiAssert('应用文件夹中存在文件管理器')

    }, { timeout: 600000, tags: ['1832693', 'level3','laptop'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        // 切换回窗口模式
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
            images: [{
                name: '窗口模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
            }],
            deepThink: true,
        });
        await device.pressKey('esc');

        // 清理预置步骤1：先删除 item-arrangement.ini 文件
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        console.log('item-arrangement.ini 已删除');

        // 然后重启 dde-shell 服务
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');

        // 最后执行 daemon-reload
        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});
