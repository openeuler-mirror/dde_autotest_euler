/**
 * 用例 PMSID: 1832127
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标滚轮操作，切换到第一页，向上滑动
 * 生成时间: 2026/7/21
 * 用例编写人: UT005571（王艺桥）
 *
 */

describe('1832127-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标滚轮操作，切换到第一页，向上滑动', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件由模块 launcher_fullscreen_app_folder 统一管理
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 每例前置由模块 launcher_fullscreen_app_folder 统一管理
    });

    test('1832127-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标滚轮操作，切换到第一页，向上滑动', async ({ device, agent, uos }) => {
        console.log('1832127: 开始测试 - 切换到第一页，向上滑动');

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开，显示桌面图标和搜索框');
        await agent.aiAssert('1. 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹，默认显示第1页
        await agent.aiTap('应用列表中的"应用文件夹"图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内第1页应用');
        await agent.aiAssert('2. 应用文件夹已打开，显示第1页应用，底部指示点第一个为白色（激活）');

        // 步骤 3: 在第1页（第一页）向上滑动鼠标滚轮，验证不可翻页
        console.log('1832127 步骤3: 在第一页向上滑动鼠标滚轮，验证不可翻页');
        await agent.aiScroll('应用文件夹中应用图标所在的网格区域', { direction: 'up', distance: 500 });
        await agent.aiWaitFor('应用文件夹界面仍停留在第1页');
        await agent.aiAssert('3. 滑动不再翻页，仍停留在第1页（第一页），底部指示点第一个保持白色（激活）');
    }, { timeout: 600000, tags: ['1832127', 'level3', 'module:launcher_fullscreen_app_folder'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 每例清理由模块 launcher_fullscreen_app_folder 统一管理
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 环境恢复由模块 launcher_fullscreen_app_folder 统一管理
    });
});
