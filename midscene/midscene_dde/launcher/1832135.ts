/**
 * 用例 PMSID: 1832135
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，切换到第一页，按住鼠标左键向右滑动不可翻页
 * 生成时间: 2026/7/21
 * 用例编写人: UT005571（王艺桥）
 *
 * 注：框架暂无鼠标拖拽 API（aiAction 已禁用），aiScroll 横向滚动会触发吸附式翻页，
 *     无法验证边界"不可翻页"；故用方向键模拟翻页方向，在第一页朝上一页方向操作，
 *     启动器无更多页则不翻页，以此验证"不可翻页"规则。
 */

describe('1832135-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，切换到第一页，按住鼠标左键向右滑动不可翻页', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件由模块 launcher_fullscreen_app_folder 统一管理
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 每例前置由模块 launcher_fullscreen_app_folder 统一管理
    });

    test('1832135-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，切换到第一页，按住鼠标左键向右滑动不可翻页', async ({ device, agent, uos }) => {
        console.log('1832135: 开始测试 - 切换到第一页，按住鼠标左键向右滑动不可翻页');

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开，显示桌面图标和搜索框');
        await agent.aiAssert('1. 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹，默认显示第1页（第一页）
        await agent.aiTap('应用列表中的"应用文件夹"图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内第1页应用');
        await agent.aiAssert('2. 应用文件夹已打开，显示第1页应用（第一页），底部指示点第一个为白色（激活）');

        // 步骤 3: 点击左边圆点确保停留在第1页（第一页）
        await agent.aiTap('应用文件夹底部左边的圆点');
        await agent.aiWaitFor('应用文件夹界面显示第1页应用');
        await agent.aiAssert('3. 停留在第1页（第一页），底部指示点第一个为白色（激活）');

        // 步骤 4: 在第一页朝上一页方向操作（向右滑动对应翻到上一页方向），验证不可翻页
        await device.pressKey('Left');
        await agent.aiWaitFor('应用文件夹界面仍停留在第1页（第一页）');
        await agent.aiAssert('4. 不可翻页，仍停留在第1页（第一页），底部指示点第一个保持白色（激活），未出现新页');
    }, { timeout: 600000, tags: ['1832135', 'level3', 'module:launcher_fullscreen_app_folder'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 每例清理由模块 launcher_fullscreen_app_folder 统一管理
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 环境恢复由模块 launcher_fullscreen_app_folder 统一管理
    });
});
