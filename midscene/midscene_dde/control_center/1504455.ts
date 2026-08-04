/**
 * 用例 PMSID: 1504455
 * 用例标题:【控制中心】【账户】删除账户保留目录再新建同名账户时给出通知提示
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504455-【控制中心】【账户】删除账户保留目录再新建同名账户时给出通知提示', () => {
    let authPassword = '';
    const testUserName = 'testuserA';
    const testPassword = 'test1234';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        authPassword = env.testPassword || process.env.TEST_PASSWORD || '';
        await device.pressKey('Super', 'M');
        await agent.aiTap('通知中心窗口左上角按钮，清除全部');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504455-删除账户保留目录再新建同名账户时给出通知提示', async ({ device, agent, uos, system }) => {
        // 步骤1: 新建一个帐户A
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiTap('账户');
        await agent.aiTap('添加新用户按钮');
        await agent.aiInput(testUserName, '用户名输入框');
        await agent.aiInput(testUserName, '全名输入框');
        await agent.aiInput(testPassword, '新密码输入框');
        await agent.aiInput(testPassword, '重复密码输入框');
        await agent.aiTap('创建用户按钮');
        await agent.aiInput(authPassword, '密码输入框');
        await agent.aiTap('确认按钮');
        await agent.aiWaitFor('其他账号下显示testuserA', { timeoutMs: 60000 });
        await agent.aiAssert('已添加他账号testuserA');

        // 步骤2: 删除帐户A，保留帐户目录
        await agent.aiTap('其他账户下的testuserA');
        await agent.aiWaitFor('账户信息');
        await agent.aiTap('删除当前账户按钮');
        await agent.aiTap('删除账户目录');
        await agent.aiWaitFor('删除账户目录前的复选框显示去勾选');
        await agent.aiTap('删除按钮');
        // 删除用户需要授权
        const hasDeleteAuthDialog = await agent.aiBoolean('是否显示授权弹窗');
        if (hasDeleteAuthDialog) {
            await agent.aiInput(authPassword, '密码输入框');
            await agent.aiTap('确认按钮');
        }
        await agent.aiWaitFor('没有显示其他账户', { timeoutMs: 30000 });
        await agent.aiAssert('没有其他账户');

        // 步骤3: 再次重复新建帐户A
        await agent.aiTap('添加新用户按钮');
        await agent.aiInput(testUserName, '用户名输入框');
        await agent.aiInput(testUserName, '全名输入框');
        await agent.aiInput(testPassword, '新密码输入框');
        await agent.aiInput(testPassword, '重复密码输入框');
        await agent.aiTap('创建用户按钮');
        // 创建用户授权处理
        const hasSecondCreateAuthDialog = await agent.aiBoolean('是否显示授权弹窗');
        if (hasSecondCreateAuthDialog) {
            await agent.aiInput(authPassword, '密码输入框');
            await agent.aiTap('确认按钮');
        }
        await agent.aiWaitFor('其他账号下显示testuserA', { timeoutMs: 30000 });
        await agent.aiAssert('已添加testuserA用户');
        await device.pressKey('Super', 'M');
        await agent.aiWaitFor('通知中心提示"testuserA"用户为之前已存在的用户，原数据已同步');
        await agent.aiAssert('通知中心提示"testuserA"用户为之前已存在的用户，原数据已同步');
    }, { timeout: 600000, tags: ['1504455', 'level3', 'smoke','remote'] });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 清理：删除测试用户及关闭窗口
        const deleteUserCmd = `echo '${authPassword}' | sudo userdel -r ${testUserName}`;
        await system.exec(deleteUserCmd);
        await device.pressKey('Super', 'M');
        await device.pressKey('Alt', 'F4');
    });
});
