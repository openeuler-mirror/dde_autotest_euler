/**
 * 用例 PMSID: 1832579
 * 用例标题: 【启动器】【全屏模式】【键盘方向键】点击键盘左键，应用选择与翻页
 * 生成时间: 2026-04-29
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832579-【启动器】【全屏模式】【键盘方向键】点击键盘左键，应用选择与翻页', () => {
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

    test('1832579-【启动器】【全屏模式】【键盘方向键】点击键盘左键，应用选择与翻页', async ({ device, agent, uos }) => {
        // 步骤 1: 打开启动器，点击左键
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

        console.log('第一次按键盘左键');
        await device.pressKey('Left');
        // await agent.aiWaitFor('启动器全屏模式已显示');
        // 检查 1: 选中当前页的第一个应用，为select状态
        await agent.aiAssert('当前页面的第一个应用图标呈select选中状态');

        // 步骤 2: 继续点击键盘左键
        console.log('第二次按键盘左键');
        await device.pressKey('Left');
       // 检查 2: 切换到上一页
        await agent.aiAssert('启动器界面顶部，页面指示点中，第一个点是灰色（未激活）,第二个点是白色（激活）');
        await agent.aiAssert('当前页面的最后一行的最后一个应用被选中，呈select状态');

    }, { timeout: 600000, tags: ['1832579', 'level3'] });

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