/**
 * 用例 PMSID: 1506487
 * 用例标题: 【控制中心】【网络】【DSL】DSL菜单界面检查
 * 生成时间: 2026-04-24
 * 用例编写人:UT002998(熊林辉)
 */

describe('1506487-【控制中心】【网络】【DSL】DSL菜单界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1506487-【控制中心】【网络】【DSL】DSL菜单界面检查', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心全屏，进入控制中心--网络--DSL
        await uos.openApp('控制中心');
        await agent.aiTap("点击网络");
        await agent.aiTap("DSL");
        await agent.aiWaitFor('DSL界面已显示');

        // 步骤 2: 点击"添加PPPoE连接"按钮
        await agent.aiTap("添加PPPoE连接");
        await agent.aiAssert('界面存在"PPPoE连接 1网络属性"');

        // 步骤 3: 点击保存，用户名右侧的输入框变成粉色
        console.log('切换控制中心到小窗口模式，规避按钮被遮挡')
        await device.pressKey('Super', 'Down');
        console.log('点击DSL的保存按钮')
        await agent.aiTap("保存");
        await agent.aiAssert('用户名右侧的输入框变成粉色');

        // 步骤 4: 点击取消，界面展示"添加PPPoE连接"按钮
        await agent.aiTap("取消");
        await agent.aiAssert('界面展示"添加PPPoE连接"按钮');

    }, { timeout: 600000, tags: ["1506487", "level2", "smoke"] });

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
