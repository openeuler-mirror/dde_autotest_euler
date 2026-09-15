/**
 * 用例 PMSID: 1848593
 * 用例标题:【桌面】【锁屏】【网络】锁屏界面的网络面板和右键菜单界面检查
 * 生成时间: 2026-04-24
 * 用例编写人:UT002998(熊林辉)
 */

describe('1848593-【桌面】【锁屏】【网络】锁屏界面的网络面板和右键菜单界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1848593-【桌面】【锁屏】【网络】锁屏界面的网络面板和右键菜单界面检查', async ({ device, agent, uos, system }) => {
        // 步骤 1: 快捷键Super+L进入锁屏界面
        await device.pressKey("Super", "L");
        await agent.aiWaitFor('锁屏界面已显示');

        // 步骤 2: 鼠标右键点击锁屏界面的网络图标
        await agent.aiRightClick('界面的右下角，位于 “CN” 按钮左侧连接器图标的圆形浅蓝色按钮', { deepThink: true });
        await agent.aiWaitFor('网络图标右键菜单已显示');

        // 步骤 3: 通过命令检测有线网络和无线网络设备是否存在
        // 检测有线网络设备
        const wiredResult = await system.exec("nmcli device status | grep ethernet");
        const hasWired = wiredResult.stdout.includes('ethernet');

        // 检测无线网络设备
        const wirelessResult = await system.exec("nmcli device status | grep wifi");
        const hasWireless = wirelessResult.stdout.includes('wifi');

        // 根据网络状态验证右键菜单内容
        if (hasWireless && hasWired) {
            // 存在无线和有线网络
            await agent.aiAssert('右键菜单显示"关闭无线网络"选项');
            await agent.aiAssert('右键菜单显示"关闭有线网络"选项');
        } else if (hasWireless && !hasWired) {
            // 仅存在无线网络
            await agent.aiAssert('右键菜单仅显示"关闭网络"选项');
        } else if (!hasWireless && hasWired) {
            // 仅存在有线网络
            await agent.aiAssert('右键菜单仅显示"关闭网络"选项');
        } else {
            // 未检测到网络
            await agent.aiAssert('右键菜单无网络关闭选项');
        }
    }, { timeout: 600000, tags: ["1848593", "level1", "smoke"] });

    afterEach(async ({ device, agent, env }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 关闭右键菜单
        await device.pressKey("Escape");
        // 锁屏界面输入正确密码后进入桌面
        await device.typeText(env.testPassword);
        await device.pressKey("Enter");
        await agent.aiWaitFor('桌面界面已显示');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.showDesktop();
    });
});
