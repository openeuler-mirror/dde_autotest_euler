/**
 * 用例 PMSID: 1504465
 * 用例标题:【控制中心】【账户】【账户类型】新建用户默认账户类型
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504465-【控制中心】【账户】【账户类型】新建用户默认账户类型', () => {
    beforeAll(async ({ uos }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504465-新建用户默认账户类型', async ({ agent, uos, device }) => {
        // 步骤1: 打开控制中心-账户，在账户列表点击添加用户按钮
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 30000 });
        await agent.aiTap('账户');
        await agent.aiTap('添加用户按钮');
        await agent.aiWaitFor('进入新建账户界面', { timeoutMs: 30000 });
        await agent.aiAssert('进入新建账户界面');

        // 步骤2: 检查新建账户界面显示
        await agent.aiAssert('账户类型默认显示为标准用户');

        // 步骤3: 点击账户类型下拉框
        await agent.aiTap('账户类型下拉框');
        await agent.aiAssert('有标准用户和管理员');

        // 关闭新建账户窗口
        await device.pressKey('Alt', 'F4');

    }, { timeout: 300000, tags: ['1504465', 'level3'] });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey('Alt', 'F4');
    });
});