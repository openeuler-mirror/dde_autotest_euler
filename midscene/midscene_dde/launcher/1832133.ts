/**
 * 用例 PMSID: 1832133
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，切换到最后一页，按住鼠标左键向左滑动不可翻页
 * 生成时间: 2026-09-03 09:40:00
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832133-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，切换到最后一页，按住鼠标左键向左滑动不可翻页', () => {
    beforeAll(async ({ device, uos, agent }) => {
    });

    beforeEach(async ({ device, agent }) => {
    });

    test('1832133-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，切换到最后一页，按住鼠标左键向左滑动不可翻页', async ({ device, agent, uos }) => {
        console.log('1832133: 开始测试 - 切换到最后一页，按住鼠标左键向左滑动不可翻页');

        // 步骤 1: 打开启动器全屏模式
        console.log('步骤 1: 打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤 1 完成：启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹，默认显示第1页
        console.log('步骤 2: 打开应用文件夹');
        await agent.aiTap('启动器全屏模式下应用列表中的应用文件夹图标，该图标是文件夹样式（与其他单个应用图标不同），通常显示在应用列表中靠前位置');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表', { timeoutMs: 30000 });
        console.log('步骤 2 完成：应用文件夹已打开，显示第1页');

        // 步骤 3: 切换到第2页（最后一页）
        console.log('步骤 3: 切换到第2页（最后一页）');
        await agent.aiTap('应用文件夹底部右侧的页面指示圆点（第二个圆点）', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        let onPage2 = await agent.aiBoolean('应用文件夹当前显示第2页，底部第二个指示点为高亮/激活状态，第一个为未激活状态');
        if (!onPage2) {
            console.log('步骤 3：点击右侧圆点未翻页，使用aiScroll降级');
            await agent.aiScroll('应用文件夹内应用图标列表区域', { direction: 'down', distance: 500 });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        const confirmedPage2 = await agent.aiBoolean('应用文件夹当前显示第2页，底部第二个指示点为高亮/激活状态，第一个为未激活状态');
        if (!(confirmedPage2)) throw new Error("已切换到第2页（最后一页）");
        console.log('步骤 3 完成：已切换到第2页（最后一页）');

        // 步骤 4: 在最后一页继续向左滑动，验证不可翻页
        console.log('步骤 4: 在最后一页继续向左滑动，验证不可翻页');
        await agent.aiScroll('应用文件夹内应用图标列表区域', { direction: 'down', distance: 500 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        const stillLastPage = await agent.aiBoolean('应用文件夹当前仍停留在第2页（最后一页），底部第二个指示点保持高亮/激活状态，未出现第三个指示点');
        if (!(stillLastPage)) throw new Error("不可翻页，仍停留在第2页（最后一页）");
        console.log('步骤 4 完成：滑动不再翻页，仍停留在最后一页');

        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832133', 'level3', 'module:launcher_fullscreen_app_folder'] });

    afterEach(async ({ device }) => {
    });

    afterAll(async ({ uos, agent, device }) => {
    });
});
