/**
 * 用例 PMSID: 1877773
 * 用例标题: 【启动器】【窗口模式】打开启动器窗口模式，鼠标点击任务栏等非启动器位置，启动器自动关闭
 * 生成时间: 2026/5/26
 * 用例编写人: UT002998(熊林辉)
 */

describe('1877773-【启动器】【窗口模式】打开启动器窗口模式，鼠标点击任务栏等非启动器位置，启动器自动关闭', () => {
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

    test('1877773-【启动器】【窗口模式】打开启动器窗口模式，鼠标点击任务栏等非启动器位置，启动器自动关闭', async ({ device, agent, uos }) => {
        // 步骤 1: 打开启动器窗口模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器窗口模式已显示');
        await agent.aiAssert('启动器页面存在：我的常用');

        // 步骤 2: 鼠标点击任务栏等非启动器位置
        await agent.aiTap('任务栏的中间区域');
        await agent.aiWaitFor('启动器页面已关闭');

        // 检查: 启动器自动关闭
        await agent.aiAssert('启动器页面已关闭');
        await agent.aiAssert('界面不存在：我的常用');

    }, { timeout: 600000, tags: ['1877773', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey('esc');
    });
});