/**
 * 用例 PMSID: 1832635
 * 用例标题: 【启动器】【全屏模式】 拖动应用到任务栏（任务栏已有此应用），禁止驻留
 * 生成时间: 2026/7/24
 * 用例编写人: UT001707(陈慧)
 */

describe('1832635-【启动器】【全屏模式】 拖动应用到任务栏（任务栏已有此应用），禁止驻留', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：顶层 1 页 1 个应用（浏览器）
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=1
toplevel\\pageItems\\0=org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（顶层1个应用：浏览器）');
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

    test('1832635-【启动器】【全屏模式】 拖动应用到任务栏（任务栏已有此应用），禁止驻留', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 关闭启动器，暴露任务栏（任务栏默认已驻留"浏览器"应用）
        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiWaitFor('启动器已关闭，任务栏可见（任务栏中已存在"浏览器"应用图标）');

        // 步骤 3: 重新打开启动器
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已重新打开');

        // 步骤 4: 拖动浏览器到任务栏（约 960, 1040 屏幕底部任务栏区域）
        // 通过 xdotool 直接控制鼠标完成拖拽
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        // 源位置：浏览器（约 220, 414）
        // 目标位置：任务栏区域（约 960, 1040）
        const srcX = 220, srcY = 414;
        const taskbarX = 960, taskbarY = 1040;
        const midX = Math.floor((srcX + taskbarX) / 2);
        const midY = Math.floor((srcY + taskbarY) / 2);
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步向下移动到任务栏
        await system.exec(`xdotool mousemove ${midX} ${midY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${taskbarX} ${taskbarY}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已拖动到任务栏停留 1 秒');
        // 4) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('鼠标拖拽完成: (' + srcX + ',' + srcY + ') -> 任务栏 (' + taskbarX + ',' + taskbarY + ') 释放');

        // 检查 1: 关闭启动器，任务栏上"浏览器"应用数量未增加（已有此应用时禁止驻留）
        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiAssert('关闭启动器后，任务栏上的"浏览器"应用数量未增加（任务栏已有此应用，禁止重复驻留）');

    }, { timeout: 600000, tags: ['1832635', 'level3', 'laptop'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 释放可能仍按下的鼠标左键
        await system.exec('xdotool mouseup 1');
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('已确保释放鼠标左键');
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
