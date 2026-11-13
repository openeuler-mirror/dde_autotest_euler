/**
 * 用例 PMSID: 1832629
 * 用例标题: 【启动器】【全屏模式】【自由拖动排序】跨页间拖动，拖动图标到最后一页时继续向右拖动且松手，新建页成功
 * 生成时间: 2026/7/24
 * 用例编写人: UT001707(陈慧)
 */

describe('1832629-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，拖动图标到最后一页时继续向右拖动且松手，新建页成功', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：顶层只有1页（最后一页），1个应用（浏览器）
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=1
toplevel\\pageItems\\0=org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（顶层1页1个应用：浏览器）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

        // 预置步骤1：确保启动器为全屏模式
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

    test('1832629-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，拖动图标到最后一页时继续向右拖动且松手，新建页成功', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 跨页间拖动浏览器（当前页唯一应用），拖到屏幕右边缘外侧（继续向右拖动）并停留1秒后松手
        // 通过 xdotool 直接控制鼠标完成拖拽
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        // 源位置：浏览器（第1个应用，约 220, 414）
        // 目标位置：屏幕右边缘外侧（约 1900, 414，1920x1080）—— 继续向右拖动
        const srcX = 1698, srcY = 175;
        const rightEdgeX = 1905, rightEdgeY = 255;
        const midX = Math.floor((srcX + rightEdgeX) / 2);
        const midY = Math.floor((srcY + rightEdgeY) / 2);
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步向右移动到屏幕右边缘（触发新建页特效）
        await system.exec(`xdotool mousemove ${srcX + 200} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${midX} ${midY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${rightEdgeX - 100} ${rightEdgeY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${rightEdgeX} ${rightEdgeY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 4) 在右边缘停留1秒（触发新建页效果）
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('已在右边缘停留 1 秒，触发新建页');
        // 5) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('鼠标拖拽完成: (' + srcX + ',' + srcY + ') -> (' + rightEdgeX + ',' + rightEdgeY + ') 释放');

        // 检查 1: 新建页成功
        await agent.aiAssert('应用区域仅显示当前拖动的一个应用图标,启动器顶部从2个翻页圆点变为3个翻页圆点,说明新建页成功，下方展示搜索框');

    }, { timeout: 600000, tags: ['1832629', 'level3', 'laptop'] });

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

        // 清理：先删除 item-arrangement.ini 文件
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
