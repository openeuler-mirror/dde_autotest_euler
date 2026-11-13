/**
 * 用例 PMSID: 1832677
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】【自由拖动排序】任务栏有某应用图标，拖动该应用到任务栏时应用不可驻留
 * 生成时间: 2026/7/17
 * 用例编写人: UT001707(陈慧)
 * 来源用例: 1824807
 */

describe('1832677-【启动器】【全屏模式】【应用文件夹】【自由拖动排序】任务栏有某应用图标，拖动该应用到任务栏时应用不可驻留', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：应用文件夹内只有1页应用，且该页只包含文件管理器和打印管理2个应用
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, dde-printer.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, dde-printer.desktop, deepin-calculator.desktop, deepin-calendar.desktop, deepin-camera.desktop, deepin-music.desktop, deepin-screen-recorder.desktop, deepin-voice-note.desktop, deepin-movie.desktop, deepin-picker.desktop
toplevel\\pageItems\\1=org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（应用文件夹含1页：文件管理器 + 打印管理）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

        // 预置步骤1：构造应用文件夹内有1页应用，直接使用 item-arrangement.ini.22bak 文件替换原 item-arrangement.ini
        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

        // 使用 .22bak 文件覆盖原配置文件
        const replaceCmd = `cp -f ${bakIniPath} ${iniPath}`;
        const replaceResult = await system.exec(replaceCmd);
        assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
        console.log('item-arrangement.ini 已使用 .22bak 文件覆盖（含1页应用的应用文件夹配置）');

        // 修改配置文件后，重启启动器（dde-shell 服务），使新配置生效
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

        console.log('配置文件内容：', content);
        console.log('isFullscreen：', isFullscreen);
        console.log('isWindowed：', isWindowed);

        if (isWindowed) {
            console.log('检测到窗口模式，切换到全屏模式...');
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

    test('1832677-【启动器】【全屏模式】【应用文件夹】【自由拖动排序】任务栏有某应用图标，拖动该应用到任务栏时应用不可驻留', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiAssert('任务栏上文件管理器图标位置显示在第四个');

        // 步骤 2: 打开应用文件夹
        await agent.aiTap('应用列表中的系统管理应用文件夹"图标');
        await agent.aiWaitFor('系统管理应用文件夹已打开');

        // 步骤 3: 拖动应用文件夹中的应用到任务栏（任务栏有该应用时不可驻留）
        // 通过 xdotool 直接控制鼠标完成拖拽（不使用 aiDrag / aiAction）
        // 选择一个任务栏已有的应用（文件管理器），按住并拖动到任务栏
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        // 源位置：应用文件夹内的"文件管理器"应用图标（约 649, 293）
        // 目标位置：任务栏上的"文件管理器"图标位置（约 50, 1020）
        const srcX = 649, srcY = 293;
        const tgtX = 50, tgtY = 1020;
        const midX = Math.floor((srcX + tgtX) / 2);
        const midY = Math.floor((srcY + tgtY) / 2);
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步移动到目标位置（先向下拖出文件夹，再拖到屏幕底部任务栏）
        await system.exec(`xdotool mousemove ${srcX} ${Math.floor((srcY + tgtY) / 3)}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${midX} ${midY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtX} ${tgtY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 4) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('鼠标拖拽完成: (' + srcX + ',' + srcY + ') -> (' + tgtX + ',' + tgtY + ')');
        // 检查: 启动器应用顺序不变
        await agent.aiAssert('底部任务栏上文件管理器图标位置还是显示在第四个，说明无变化');

    }, { timeout: 600000, tags: ['1832677', 'level3','laptop'] });


    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭启动器
        await device.pressKey('esc');

        // 清理预置步骤1：先删除 item-arrangement.ini 文件
        await system.exec('sudo rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        await device.typeText(env.testPassword);
        await device.pressKey("Enter");
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
