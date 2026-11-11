/**
 * 用例 PMSID: 1832205
 * 用例标题: 【启动器】【全屏模式】【键盘交互规则】键盘的方向键切换应用及翻页---待定
 * 生成时间: 2026-07-21
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832205-【启动器】【全屏模式】【键盘交互规则】键盘的方向键切换应用及翻页---待定', () => {
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

    test('1832205-【启动器】【全屏模式】【键盘交互规则】键盘的方向键切换应用及翻页---待定', async ({ device, agent, uos }) => {
        console.log('1832205: 开始测试 - 键盘方向键切换应用及翻页');

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

        // 步骤 2: 首次点击方向键，选中应用
        console.log('首次按方向键Down，选中应用');
        await device.pressKey('Down');
        await agent.aiAssert('有应用图标呈选中状态，四周有蓝色边框');

        // 步骤 3: 点击键盘上下键切换至当前页面最后一行，再次点击下键，焦点切换至搜索框
        console.log('连续按Down键切换至最后一行，再按Down键焦点切换至搜索框');
        // 最多尝试10次Down键，每次检查搜索框是否被激活
        for (let i = 0; i < 10; i++) {
            await device.pressKey('Down');
            const isSearchFocused = await agent.aiBoolean('底部搜索框呈选中/聚焦状态，四周有蓝色边框');
            console.log(`第${i + 1}次按Down键，搜索框是否聚焦：${isSearchFocused}`);
            if (isSearchFocused) {
                break;
            }
        }

        // 检查: 焦点切换至搜索框，搜索框被激活
        await agent.aiAssert('底部搜索框呈选中/聚焦状态，四周有蓝色边框，搜索框被激活');

    }, { timeout: 600000, tags: ['1832205', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
            images: [{
                name: '窗口模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
            }],
            deepThink: true,
        });
        await device.pressKey('esc');
    });
});
