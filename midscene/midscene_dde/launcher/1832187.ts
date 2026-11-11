/**
 * 用例 PMSID: 1832187
 * 用例标题: 【启动器】【全屏模式】【搜索规则】支持英文名称的简写搜索
 * 生成时间: 2026-08-31 11:00:00
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832187-【启动器】【全屏模式】【搜索规则】支持英文名称的简写搜索', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 读取 dde-shell 配置，判断当前启动器模式
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        assertTrue(result.success, '读取配置文件失败');

        const content = result.stdout.toString();
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        const isWindowed = content.includes('current_frame=WindowedFrame');

        console.log('配置文件内容：', content);
        console.log('isFullscreen：', isFullscreen);
        console.log('isWindowed：', isWindowed);

        // 若当前为全屏模式，先切换到窗口模式，保证用例从窗口模式切入
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

    test('1832187-【启动器】【全屏模式】【搜索规则】支持英文名称的简写搜索', async ({ device, agent, uos }) => {
        console.log('1832187: 开始测试 - 支持英文名称的简写搜索');

        // 步骤 1: 打开启动器全屏模式
        console.log('步骤 1: 打开启动器全屏模式');
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
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤 1 完成：启动器全屏模式已打开');

        // 步骤 2: 搜索框输入as（app store 应用商店）
        console.log('步骤 2: 搜索框输入as（app store 应用商店）');
        await agent.aiTap('启动器全屏模式底部的搜索输入框');
        await device.typeText('as');
        await agent.aiWaitFor('底部中央的搜索输入框，呈矩形，内有放大镜图标和字符：as', { timeoutMs: 15000 });
        // 等待应用商店图标显示在界面上
        await agent.aiWaitFor('界面上显示了应用商店图标', { timeoutMs: 15000 });
        // 预期 2: 支持英文名称的简写搜索，搜素到应用商店
        await agent.aiAssert('搜索框显示as，界面上显示了应用商店图标');
        console.log('步骤 2 完成：输入as搜索到应用商店');

        // 步骤 3: 搜索框输入wb（Web Broswer 系统浏览器）
        console.log('步骤 3: 搜索框输入wb（Web Broswer 系统浏览器）');
        await agent.aiTap('搜索框中右侧的x按钮', { deepThink: true });
        await agent.aiAssert('启动器的搜索框中为空');
        await agent.aiTap('启动器全屏模式底部的搜索输入框');
        await device.typeText('wb');
        await agent.aiWaitFor('底部中央的搜索输入框，呈矩形，内有放大镜图标和字符：wb', { timeoutMs: 15000 });
        // 等待浏览器图标显示在界面上
        await agent.aiWaitFor('界面上显示了浏览器图标', { timeoutMs: 15000 });
        // 预期 3: 支持英文名称的简写搜索，搜素到系统浏览器
        await agent.aiAssert('搜索框显示wb，界面上显示了浏览器图标');
        console.log('步骤 3 完成：输入wb搜索到浏览器');

        // 收尾：按 ESC 关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832187', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件，恢复启动器为窗口模式');
        await device.pressKey('esc');
        // 恢复启动器为窗口模式：打开启动器，若为全屏则切换到窗口模式
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        const content = result.success ? result.stdout.toString() : '';
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        console.log('afterAll 检测启动器模式：', isFullscreen ? '全屏模式' : '窗口模式');
        if (isFullscreen) {
            console.log('afterAll: 当前为全屏模式，切换回窗口模式');
            await uos.openLauncher();
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
                images: [{
                    name: '窗口模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
                }],
                deepThink: true,
            });
            await device.pressKey('ESC');
        }
        await uos.showDesktop();
        console.log('afterAll: 启动器已恢复为窗口模式');
    });
});
