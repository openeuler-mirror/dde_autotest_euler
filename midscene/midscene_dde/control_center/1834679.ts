/**
 * 用例 PMSID: 1834679
 * 用例标题:【登录】【新用户】切换用户-登录新账户正常
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1834679-【登录】【新用户】切换用户-登录新账户正常', () => {
    const testUsers = ['uosA', 'uosB'];
    const testuserPassword = 'test1234';

    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1834679-切换用户-登录新账户正常', async ({ device, agent, uos, system, env }) => {
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const originalUserName = env.testUserName || process.env.TEST_USER_NAME || 'uos';

        //准备：新建多个用户
        for (const userName of testUsers) {
            const createUserCmd = `echo '${passWord}' | sudo useradd -m ${userName} -s /usr/bin/bash`;
            await system.exec(createUserCmd);
            const setPasswordCmd = `echo '${passWord}' | sudo su -c 'echo "${userName}:${testuserPassword}" | chpasswd'`;
            await system.exec(setPasswordCmd);
        }
        //用户uosA登录验证
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('切换用户按钮');
        await agent.aiWaitFor('登录界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('uosA');
        await agent.aiTap('密码输入框');
        await device.typeText(testuserPassword);
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
        await agent.aiAssert('uosA用户进入桌面');
        //切换用户uosB登录验证
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('注销按钮');
        await agent.aiWaitFor('登录界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('切换用户按钮');
        await agent.aiTap('uosB');
        await agent.aiTap('密码输入框');
        await device.typeText(testuserPassword);
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('显示桌面介绍欢迎窗口', { timeoutMs: 60000 });
        await agent.aiTap('关闭欢迎窗口');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
        await agent.aiAssert('uosB用户进入桌面');

        // 验证鼠标左键操作，右键菜单功能
        await agent.aiRightClick('当前桌面窗口最底部的任务栏');
        await agent.aiWaitFor('任务栏右键菜单项显示任务栏设置');
        await agent.aiAssert('右键功能操作正常');
        await device.pressKey('ESC');
        await agent.aiTap('左下角的启动器按钮');
        await agent.aiWaitFor('启动器菜单显示', { timeoutMs: 15000 });
        await agent.aiAssert('左键功能操作正常');

        //uosB用户注销登录，原用户登录进入桌面
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('注销按钮');
        await agent.aiWaitFor('登录界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('右下角的切换用户按钮');
        await agent.aiWaitFor(`显示用户${originalUserName}、uosA、uosB`, { timeoutMs: 60000 });
        await agent.aiTap(originalUserName);
        await agent.aiTap('密码输入框');
        await device.typeText(`${passWord}`);
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
    }, { timeout: 600000, tags: ['1834679', 'level1',  'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        for (const deleteUserName of testUsers) {
            const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${deleteUserName}`;
            await system.exec(deleteUserCmd);
        }
    });
});