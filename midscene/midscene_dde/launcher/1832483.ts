/**
 * 用例 PMSID: 1832483
 * 用例标题: 【启动器】【窗口模式】窗口自由排序模式和全屏模式来回切换
 * 生成时间: 2026-06-22
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832483-【启动器】【窗口模式】窗口自由排序模式和全屏模式来回切换', () => {
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

    test('1832483-【启动器】【窗口模式】窗口自由排序模式和全屏模式来回切换', async ({ device, agent, uos }) => {
        // 步骤 1: 打开启动器
        await uos.openLauncher();

        for (let i = 1; i <= 2; i++) {
            console.log(`第 ${i} 次切换...`);

            // 步骤 2: 点击"全屏切换"菜单
            console.log('切换启动器窗口模式到全屏模式，确保测试环境正常...');
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器小窗口左下角的全屏模式图标',
                images: [
                    {
                        name: '全屏模式图标',
                        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
                    },
                ],
                deepThink: true,
            });

            // 检查 2: 切换至启动器全屏模式，切换过程流畅
            await agent.aiWaitFor('启动器全屏模式已显示');

            // 步骤 3: 点击"全屏切换"菜单
            console.log('切换启动器全屏模式到窗口模式，确保测试环境正常...');
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器全屏模式右上角的切换图标',
                images: [
                    {
                        name: '自由排序小图标',
                        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
                    },
                ],
                deepThink: true,
            });

            // 检查 3: 切换至启动器窗口，切换过程流畅
            await agent.aiAssert('启动器界面存在我的常用菜单');

            // 步骤 4: 搜索框输入字母"m"，重复步骤2~3，切换启动器模式
            await agent.aiTap('搜索框');
            await device.typeText('m');
            // 步骤 4.1: 点击"全屏切换"菜单
            console.log('切换启动器窗口模式到全屏模式，确保测试环境正常...');
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器小窗口左下角的全屏模式图标',
                images: [
                    {
                        name: '全屏模式图标',
                        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
                    },
                ],
                deepThink: true,
            });
            await agent.aiAssert('启动器已切换至全屏模式');

            // 步骤 5: 点击"全屏切换"菜单
            console.log('切换启动器全屏模式到窗口模式，确保测试环境正常...');
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器全屏模式右上角的切换图标',
                images: [
                    {
                        name: '自由排序小图标',
                        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
                    },
                ],
                deepThink: true,
            });

            // 检查 3: 切换至启动器窗口，切换过程流畅
            await agent.aiAssert('启动器已切换至窗口模式');
        }
    }, { timeout: 600000, tags: ['1832483', 'level3'] });

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
