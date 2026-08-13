/**
 * 用例 PMSID: 1506485
 * 用例标题: 【控制中心】【网络】【无线网络】无线网络界面检查
 * 生成时间: 2026-04-24
 * 用例编写人:UT002998(熊林辉)
 */

describe('1506485-【控制中心】【网络】【无线网络】无线网络界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1506485-【控制中心】【网络】【无线网络】无线网络界面检查', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心全屏，进入控制中心--网络--无线网络
        await uos.openApp('控制中心', 2000, 20000, true);
        await agent.aiTap("点击网络");
        await agent.aiTap("无线网络");
        await agent.aiWaitFor('无线网络界面已显示');

        await agent.aiAssert('界面展示"网络 / 无线网络 "菜单');
        await agent.aiAssert('界面展示："其他网络"列表下展示加密WiFi和开放WiFi，无线网络开关为开启');

        await agent.aiScroll('滚动页面到底部', { direction: "down", distance: 500});
        await agent.aiAssert('界面展示：连接到隐藏网络菜单');

    }, { timeout: 600000, tags: ["1506485", "level1", "smoke"] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 还原环境，控制中心窗口还原，关闭
        await agent.aiTap("窗口右上角关闭按钮:X");
        await agent.device.pressKey('Super', 'Down');
        await uos.showDesktop();
    });
});
