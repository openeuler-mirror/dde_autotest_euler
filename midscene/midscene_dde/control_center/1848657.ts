/**
 * 用例 PMSID: 1848657
 * 用例标题:统信桌面操作系统 V25(#493) - 【桌面】【登录】注销-进入用户登录界面
 * 生成时间: 2026-05-13
 * 用例编写人: UT002485(卢燕)
 */


describe('1848657-统信桌面操作系统 V25(#493) - 【桌面】【登录】注销-进入用户登录界面', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1848657-注销-进入用户登录界面', async ({ device, agent, uos, env }) => {
        // env中获取测试账号密码
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

        // 执行注销操作
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示');
        await agent.aiTap('注销按钮', { deepThink: true });
        const isInitialized = await agent.aiBoolean('显示以上程序阻止注销');
        if (isInitialized) {
            await agent.aiTap('注销按钮');
        } 
        
        // 进入用户登录界面
        await agent.aiWaitFor('登录界面已显示');
        await agent.aiAssert('用户登录界面显示正常');
        await agent.aiAssert('显示用户名和密码输入框');

        // 账号登录显示桌面
        await agent.aiTap('请输入密码');
        await agent.aiInput(`${passWord}`, '密码输入框');
        await agent.aiTap('解锁按钮');
        await agent.aiWaitFor('桌面已显示');
    }, { timeout: 300000, tags: ['1848657', 'level1','smoke', 'remote'] });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
});
