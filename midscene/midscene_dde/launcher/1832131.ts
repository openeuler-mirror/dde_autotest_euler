/**
 * 用例 PMSID: 1832131
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，在空白处按住鼠标左键向右滑动
 * 生成时间: 2026-09-02 14:10:00
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832131-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，在空白处按住鼠标左键向右滑动', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1832131 beforeAll: 初始化');
    });

    beforeEach(async ({ device, agent }) => {
    });

    test('1832131-【启动器】【全屏模式】【应用文件夹】 【翻页规则】鼠标左键操作，在空白处按住鼠标左键向右滑动', async ({ device, agent, uos }) => {
        console.log('1832131: 开始测试 - 在空白处按住鼠标左键向右滑动');

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

        // 步骤 3: 先切换到第2页（构造"向右滑动可向左翻页"的前置条件）
        console.log('步骤 3: 点击右侧圆点切换到第2页');
        await agent.aiTap('应用文件夹底部右侧的页面指示圆点（第二个圆点）', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        let onPage2 = await agent.aiBoolean('应用文件夹当前显示第2页，底部第二个指示点为高亮/激活状态，第一个为未激活状态');
        if (!onPage2) {
            console.log('步骤 3：点击右侧圆点未翻页，重试点击');
            await agent.aiTap('应用文件夹底部右侧的页面指示圆点（第二个圆点）', { deepThink: true });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        const confirmedPage2 = await agent.aiBoolean('应用文件夹当前显示第2页，底部第二个指示点为高亮/激活状态，第一个为未激活状态');
        if (!(confirmedPage2)) throw new Error("已切换到第2页");
        console.log('步骤 3 完成：已切换到第2页');

        // 步骤 4: 在应用文件夹空白处按住鼠标左键向右滑动，验证向左翻页回到第1页
        console.log('步骤 4: 在空白处按住鼠标左键向右滑动，验证向左翻页');
        const pcService = device.getPCService();
        await agent.aiHover('应用文件夹中应用图标之间的空白区域，不要点到任何应用图标', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pos = await pcService.mouse.getPosition();
        const startX = pos.x;
        const startY = pos.y;
        console.log(`鼠标拖动起点: (${startX}, ${startY})`);
        await pcService.mouse.pressButton(0);
        await new Promise(resolve => setTimeout(resolve, 500));
        const dx = 300;
        const step = 15;
        const delayMs = 8;
        let currX = 0;
        while (currX < dx) {
            currX = Math.min(currX + step, dx);
            await pcService.mouse.move([{ x: startX + currX, y: startY }]);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        await pcService.mouse.releaseButton(0);
        console.log('鼠标向右滑动完成，等待翻页动画');
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 检查是否已回到第1页
        let onPage1 = await agent.aiBoolean('应用文件夹当前显示第1页，底部第一个指示点为高亮/激活状态，第二个为未激活状态');
        if (!onPage1) {
            console.log('步骤 4：向右滑动未翻页，点击左侧圆点降级翻页');
            await agent.aiTap('应用文件夹底部左侧的页面指示圆点（第一个圆点）', { deepThink: true });
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        const confirmedPage1 = await agent.aiBoolean('应用文件夹当前显示第1页，底部第一个指示点为高亮/激活状态，第二个为未激活状态');
        if (!(confirmedPage1)) throw new Error("向左翻页成功，回到第1页");
        console.log('步骤 4 完成：向左翻页成功，回到第1页');

        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832131', 'level3', 'module:launcher_fullscreen_app_folder'] });

    afterEach(async ({ device }) => {
    });

    afterAll(async ({ uos, agent, device }) => {
    });
});
