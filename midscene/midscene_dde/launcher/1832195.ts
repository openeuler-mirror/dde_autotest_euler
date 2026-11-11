/**
 * 用例 PMSID: 1832195
 * 用例标题: 【启动器】【全屏模式】【键盘交互规则】点击tab键切换到右上角切换图标，select状态验证
 * 生成时间: 2026-07-21
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832195-【启动器】【全屏模式】【键盘交互规则】点击tab键切换到右上角切换图标，select状态验证', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        assertTrue(result.success, '读取配置文件失败');

        const content = result.stdout.toString();
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        const isWindowed = content.includes('current_frame=WindowedFrame');

        console.log('配置文件内容：', content);
        console.log('isFullscreen：', isFullscreen);
        console.log('isWindowed：', isWindowed);

        if (isFullscreen) {
            console.log('检测到全屏模式，执行ESC确保启动器被关闭...');
            await device.pressKey('ESC');
            console.log('重新打开启动器...');
            await uos.openLauncher();
            console.log('切换启动器全屏模式到窗口模式...');
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
                images: [{
                    name: '窗口模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
                }],
                deepThink: true,
            });
        }
        if (isWindowed) {
            console.log('检测到窗口模式，无需操作');
        }
        await device.pressKey('ESC');
    });

    test('1832195-【启动器】【全屏模式】【键盘交互规则】点击tab键切换到右上角切换图标，select状态验证', async ({ device, agent, uos }) => {
        console.log('1832195: 开始测试 - tab键切换到右上角切换图标，select状态验证');

        // 步骤 1: 打开启动器并切换到全屏模式
        await uos.openLauncher();
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
            images: [{
                name: '全屏模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
            }],
            deepThink: true,
        });
        await agent.aiWaitFor('启动器全屏模式已显示');

        // 步骤 2: 点击tab键切换至右上角切换图标（Tab1→切换图标）
        console.log('按Tab键切换到右上角切换图标');
        await device.pressKey('Tab');
        await agent.aiAssert('右上角切换图标呈选中状态，四周有蓝色边框');

        // 步骤 3: 点击空格，由全屏模式切换到窗口模式
        console.log('按空格键，切换到窗口模式');
        await device.pressKey('Space');
        await agent.aiWaitFor('启动器以窗口形式显示，没有铺满整个屏幕，右下角有全屏模式切换按钮');
        await agent.aiAssert('启动器当前处于窗口模式，启动器窗口只占据屏幕左侧部分区域，没有铺满整个屏幕，右下角显示"全屏模式"切换按钮');

        // 步骤 4: 切换回全屏模式（窗口模式下焦点已丢失，点击全屏模式图标切换回全屏）
        console.log('点击全屏模式图标，切换回全屏模式');
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
            images: [{
                name: '全屏模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
            }],
            deepThink: true,
        });
        await agent.aiWaitFor('启动器已切换到全屏模式，应用图标铺满整个屏幕');
        await agent.aiAssert('启动器已切换回全屏模式，界面顶部有页面指示圆点，应用图标以网格形式排列在屏幕上');

    }, { timeout: 600000, tags: ['1832195', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 读取当前模式，确保恢复到窗口模式并关闭启动器
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        const content = result.success ? result.stdout.toString() : '';
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        if (isFullscreen) {
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
                images: [{
                    name: '窗口模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
                }],
                deepThink: true,
            });
        }
        await device.pressKey('esc');
    });
});
