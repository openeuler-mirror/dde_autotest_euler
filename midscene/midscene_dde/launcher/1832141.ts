/**
 * 用例 PMSID: 1832141
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，点击应用文件夹内非应用图标区域，启动器不响应
 * 生成时间: 2026/7/21
 * 用例编写人: UT005571（王艺桥）
 *
 */

describe('1832141-【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，点击应用文件夹内非应用图标区域，启动器不响应', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件由模块 launcher_fullscreen_app_folder 统一管理
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 每例前置由模块 launcher_fullscreen_app_folder 统一管理
    });

    test('1832141-【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，点击应用文件夹内非应用图标区域，启动器不响应', async ({ device, agent, uos }) => {
        console.log('1832141: 开始测试 - 点击应用文件夹内非应用图标区域，启动器不响应');

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开，显示桌面图标和搜索框');
        await agent.aiAssert('1. 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹
        await agent.aiTap('应用列表中的"应用文件夹"图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表');
        await agent.aiAssert('2. 应用文件夹已开启，显示文件夹内应用');

        // 步骤 3: 点击应用文件夹内的标题区域（非应用图标区域，位于文件夹弹窗内顶部）
        await agent.aiTap('应用文件夹弹窗顶部的标题文字区域，不要点击应用图标');
        await agent.aiWaitFor('应用文件夹弹窗仍保持开启状态');
        await agent.aiAssert('3. 启动器不响应，应用文件夹弹窗仍保持开启状态，未收起、未翻页');
    }, { timeout: 600000, tags: ['1832141', 'level3', 'module:launcher_fullscreen_app_folder'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 每例清理由模块 launcher_fullscreen_app_folder 统一管理
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 环境恢复由模块 launcher_fullscreen_app_folder 统一管理
    });
});
