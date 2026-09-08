/**
 * 用例 PMSID: 1830137
 * 用例标题:【任务栏】【模式】任务栏模式设置入口
 * 生成时间: 2026-04-29
 * 用例编写人: UT002485(卢燕)
 */

describe('1830137-【任务栏】【模式】任务栏模式设置入口', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1830137-【任务栏】【模式】任务栏模式设置入口', async ({ device, agent, uos }) => {
        // 任务栏任务空白处，右键点击展示菜单
        await agent.aiRightClick('底部任务栏空白处', { deepThink: true });
        await agent.aiAssert('展示菜单项：模式');
        await agent.aiHover('模式');
        await agent.aiAssert('展示菜单项：经典模式、居中模式');

        // 打开控制中心-个性化-任务栏界面
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiTap('个性化');
        await agent.aiTap('桌面和任务栏');
        await agent.aiAssert('有设置项：模式');
        await agent.aiAssert('显示可选性：经典模式、居中模式');

    }, { timeout: 300000, tags: ['1830137', 'level1'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('alt', 'F4');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
});
