/**
 * 用例 PMSID: 1832139
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【翻页规则】启动器应用文件夹有两页，页签圆点热区检查
 * 生成时间: 2026/7/21
 * 用例编写人: UT005571（王艺桥）
 *
 */

describe('1832139-【启动器】【全屏模式】【应用文件夹】 【翻页规则】启动器应用文件夹有两页，页签圆点热区检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件由模块 launcher_fullscreen_app_folder 统一管理
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 每例前置由模块 launcher_fullscreen_app_folder 统一管理
    });

    test('1832139-【启动器】【全屏模式】【应用文件夹】 【翻页规则】启动器应用文件夹有两页，页签圆点热区检查', async ({ device, agent, uos }) => {
        console.log('1832139: 开始测试 - 页签圆点热区检查');

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开，显示桌面图标和搜索框');
        await agent.aiAssert('1. 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹，确认底部显示2个页签圆点
        await agent.aiTap('应用列表中的"应用文件夹"图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内第1页应用');
        await agent.aiAssert('2. 应用文件夹已打开，底部显示2个页签圆点，当前第一个圆点为白色（激活），第二个为灰色');

        // 步骤 3: 点击左边的圆点，验证切换到第1页
        await agent.aiTap('应用文件夹底部左边的圆点');
        await agent.aiWaitFor('应用文件夹界面显示第1页应用');
        await agent.aiAssert('3. 切换到第1页，底部指示点第一个为白色（激活）');

        // 步骤 4: 点击右边的圆点，验证切换到第2页
        await agent.aiTap('应用文件夹底部右边的圆点');
        await agent.aiWaitFor('应用文件夹界面已更新到第2页');
        await agent.aiAssert('4. 切换到第2页，底部指示点第二个为白色（激活）');
    }, { timeout: 600000, tags: ['1832139', 'level3', 'module:launcher_fullscreen_app_folder'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 每例清理由模块 launcher_fullscreen_app_folder 统一管理
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 环境恢复由模块 launcher_fullscreen_app_folder 统一管理
    });
});
