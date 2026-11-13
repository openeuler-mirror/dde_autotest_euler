/**
 * 用例 PMSID: 1832565
 * 用例标题: 【启动器】【全屏模式】【翻页规则】鼠标左键操作，切换到最后一页，按住鼠标左键向左滑动不可翻页
 * 生成时间: 2026-07-21
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832565-【启动器】【全屏模式】【翻页规则】鼠标左键操作，切换到最后一页，按住鼠标左键向左滑动不可翻页', () => {
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

    test('1832565-【启动器】【全屏模式】【翻页规则】鼠标左键操作，切换到最后一页，按住鼠标左键向左滑动不可翻页', async ({ device, agent, uos }) => {
        console.log('1832565: 开始测试 - 切换到最后一页，按住鼠标左键向左滑动不可翻页');

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

        // 检查1: 默认显示第1页，顶部圆点第一个为白色（激活）
        await agent.aiAssert('启动器界面顶部，页面指示点中，第一个点是白色（激活），第二个点是灰色（未激活）');

        // 步骤 2: 点击右边圆点切换到最后一页（第2页）
        await agent.aiTap('启动器界面顶部右边的圆点');
        await agent.aiWaitFor('启动器全屏模式已显示');

        // 检查2: 已切换到最后一页（第2页）
        await agent.aiAssert('启动器界面顶部，页面指示点中，第一个点是灰色（未激活），第二个点是白色（激活）');

        // 步骤 3: 在最后一页空白处按住鼠标左键向左滑动，验证不可翻页
        await agent.aiScroll('启动器应用列表空白区域按住鼠标左键向左滑动，不要点到应用图标', { direction: 'left', distance: 500 });
        await agent.aiWaitFor('启动器全屏模式已显示');

        // 检查3: 不可翻页，仍停留在最后一页（第2页），未出现第3页
        await agent.aiAssert('启动器界面顶部，页面指示点中，第一个点是灰色（未激活），第二个点保持白色（激活），只有两个圆点，未出现第三个圆点');

    }, { timeout: 600000, tags: ['1832565', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 切换回窗口模式并关闭启动器，恢复环境
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
