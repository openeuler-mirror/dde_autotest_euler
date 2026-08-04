/**
 * 用例 PMSID: 1504467
 * 用例标题:【控制中心】【账户】【密码规则】创建用户密码必填校验
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504467-【控制中心】【账户】【密码规则】创建用户密码必填校验', () => {
    const testUserName = 'testuser';
    const testPassword = 'test1234';
    let authPassword = '';

    beforeAll(async ({ uos, env }) => {
        authPassword = env.testPassword || process.env.TEST_PASSWORD || '';
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504467-创建用户密码必填校验', async ({ device, agent, uos }) => {
        // 步骤1: 启动控制中心-账户-创建账户，输入用户名和全名后，不输入密码，点击创建
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 30000 });
        await agent.aiTap('账户');
        await agent.aiTap('添加新用户按钮');
        await agent.aiWaitFor('进入创建新用户界面', { timeoutMs: 30000 });
        
        await agent.aiInput(testUserName, '用户名输入框');
        await agent.aiInput(testUserName, '全名输入框');
        await agent.aiTap('创建用户按钮');
        await agent.aiAssert('提示密码不能为空');

        // 步骤2: 输入用户名和全名后，输入密码，重复密码不输入，点击创建
        await agent.aiInput(testPassword, '密码输入框');
        await agent.aiTap('创建用户按钮');
        await agent.aiAssert('提示密码不一致');

        // 步骤3: 输入用户名和全名test，输入密码和重复密码一致，点击创建
        await agent.aiInput(testPassword, '重复密码输入框');
        await agent.aiTap('创建按钮');
        await agent.aiWaitFor('弹出授权弹窗，修改用户数据需要认证', { timeoutMs: 30000 });
        await agent.aiInput(authPassword, '密码输入框');
        await agent.aiTap('确认按钮');
        // 关闭账户窗口
        await device.pressKey('Alt', 'F4');
    }, { timeout: 300000, tags: ['1504467', 'level3', 'smoke'] });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 清理：删除可能创建的测试用户
        const deleteUserCmd = `echo '${authPassword}' | sudo userdel -r ${testUserName} 2>/dev/null || true`;
        await system.exec(deleteUserCmd);
    });
});