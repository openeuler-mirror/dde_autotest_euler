/**
 * 用例 PMSID: 1832613
 * 用例标题: 【启动器】【全屏模式】【展示规则】检查预装应用列表的排列顺序
 * 生成时间: 2026-08-25
 * 用例编写人: UT002485（卢燕）
 */

describe('1832613-【启动器】【全屏模式】【展示规则】检查预装应用列表的排列顺序', () => {
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

    test('1832613-【启动器】【全屏模式】【展示规则】检查预装应用列表的排列顺序', async ({ device, agent, uos }) => {
        console.log('1832613: 开始测试 - 检查预装应用列表的排列顺序');

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

        // 检查1: 启动器全屏模式已打开，显示第1页
        await agent.aiAssert('启动器全屏模式已打开，显示第1页应用列表，顶部页面指示点第一个为白色（激活）');

        // 步骤 2: 检查预装应用列表的排列顺序
        // 预装应用按字母/分类顺序排列，图标排列整齐
        await agent.aiAssert('启动器全屏模式下，预装应用图标排列整齐，应用名称清晰可见');

        // 检查2: 验证预装应用列表存在，应用按从左到右、从上到下的顺序排列
        await agent.aiAssert('启动器全屏模式下，预装应用图标按行列顺序整齐排列，应用名称在图标下方居中显示');

        // 步骤 3: 检查翻页指示圆点存在，验证多页列表的展示规则
        await agent.aiAssert('启动器界面顶部存在页面指示圆点，用于多页应用列表的翻页');

    }, { timeout: 600000, tags: ['1832613', 'level3'] });

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
