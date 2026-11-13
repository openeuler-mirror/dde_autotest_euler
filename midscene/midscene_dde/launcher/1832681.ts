/**
 * 用例 PMSID: 1832681
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】应用图标移入应用文件夹，与文件夹重合度为图标大小的一半及以上不松手，检查应用文件夹
 * 生成时间: 2026/7/17
 * 用例编写人: UT001707(陈慧)
 * 来源用例: 1828361
 */

describe('1832681-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】应用图标移入应用文件夹，与文件夹重合度为图标大小的一半及以上不松手，检查应用文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：应用文件夹有1页应用
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-calculator.desktop, deepin-calendar.desktop, deepin-camera.desktop, deepin-music.desktop
toplevel\\pageItems\\1=deepin-screen-recorder.desktop, deepin-voice-note.desktop, deepin-movie.desktop, deepin-picker.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（应用文件夹含1页）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

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

    test('1832681-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】应用图标移入应用文件夹，与文件夹重合度为图标大小的一半及以上不松手，检查应用文件夹', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiTap('应用文件夹');
        await agent.aiAssert('应用文件夹中存在2个应用')
        await device.pressKey("Esc")

        // 通过 xdotool 直接控制鼠标完成拖拽（不使用 aiDrag / aiAction）
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());

        // ====== 步骤 2：拖动全模式下的应用图标，与应用文件夹重合度 ≥ 50% 时，不松手 ======
        // 源位置：应用图标
        // 目标位置：应用文件夹图标
        const srcX = 435, srcY = 178;
        const tgtX = 270, tgtY = 172;
        const midX = Math.floor((srcX + tgtX) / 2);
        const midY = Math.floor((srcY + tgtY) / 2);
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步移动到目标位置
        await system.exec(`xdotool mousemove ${midX} ${midY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtX} ${tgtY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('步骤2 拖动到文件夹完成（不松手）: (' + srcX + ',' + srcY + ') -> (' + tgtX + ',' + tgtY + ')');
        // 预期: 原应用文件夹的名称被隐藏
        await agent.aiAssert('原应用文件夹的名称被隐藏');

        // ====== 步骤 3：松手 ======
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('步骤3 松手完成');
        // 先打开应用文件夹，查看文件夹内的"浏览器"应用图标
        // 预期: 应用被拖进了应用文件夹
        await agent.aiTap('应用文件夹');
        await agent.aiAssert('应用文件夹内显示3个应用');

        // ====== 步骤 4：从应用文件夹中拖出步骤2中的图标 ======
        


        // 源位置：应用文件夹内第1页第1格的"浏览器"应用图标（约 649, 293）
        // 目标位置：应用文件夹外的启动器页面区域（约 960, 850）
        const srcX2 = 1064, srcY2 = 322;
        const tgtX2 = 1070, tgtY2 = 943;
        const midX2 = Math.floor((srcX2 + tgtX2) / 2);
        const midY2 = Math.floor((srcY2 + tgtY2) / 2);
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX2} ${srcY2}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步移动到目标位置（向下拖出文件夹下边界）
        await system.exec(`xdotool mousemove ${midX2} ${midY2}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtX2} ${tgtY2}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 4) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('步骤4 从文件夹内拖出完成: (' + srcX2 + ',' + srcY2 + ') -> (' + tgtX2 + ',' + tgtY2 + ')');
        // 预期: 退出了应用文件夹，应用图标被拖出
        await agent.aiAssert('退出了应用文件夹');
        // 先打开应用文件夹，查看文件夹内的"浏览器"应用图标
        // 预期: 应用被拖出了应用文件夹
        await agent.aiTap('应用文件夹');
        await agent.aiAssert('应用文件夹内显示2个应用');

    }, { timeout: 600000, tags: ['1832681', 'level3','laptop'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        // 释放可能仍按下的鼠标左键
        await system.exec('xdotool mouseup 1');
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('已确保释放鼠标左键');
        await device.pressKey('esc');

        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        console.log('item-arrangement.ini 已删除');

        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');

        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});
