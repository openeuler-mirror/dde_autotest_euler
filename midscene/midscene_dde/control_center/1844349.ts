/**
 * 用例 PMSID: 1844349
 * 用例标题:【控制中心】【账户】新建账户首次登录后，桌面显示正常
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1844349-【控制中心】【账户】新建账户首次登录后，桌面显示正常', () => {
    const testUserName = 'testuser';
    const testuserPassword = 'test1234';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 前置条件：创建新账户并设置密码
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const createUserCmd = `echo '${passWord}' | sudo useradd -m ${testUserName} -s /usr/bin/bash`;
        await system.exec(createUserCmd);
        const setPasswordCmd = `echo '${passWord}' | sudo su -c 'echo "${testUserName}:${testuserPassword}" | chpasswd'`;
        await system.exec(setPasswordCmd);
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1844349-新建账户首次登录后桌面显示正常', async ({ device, agent, uos, system, env }) => {
        // 步骤 1: 新账户登录
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示');
        await agent.aiTap('切换用户按钮');
        await agent.aiWaitFor('登录界面已显示');
        await agent.aiTap(testUserName);
        await agent.aiTap('密码输入框');
        await device.typeText(testuserPassword);
        await agent.aiTap('登录按钮');
        
        // 新账号登录后，验证桌面显示正常
        await agent.aiWaitFor('显示桌面介绍欢迎窗口', { timeoutMs: 60000 });
        await agent.aiTap('欢迎窗口右上角关闭按钮');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });
        await agent.aiAssert('正确进入桌面');
        await agent.aiWaitFor('底部显示任务栏');
        await agent.aiAssert('任务栏显示正常', { deep: true });
        await agent.aiAssert('应用图标显示正常', { deep: true });
        await agent.aiAssert('桌面壁纸显示正常', { deep: true });
        await agent.aiAssert('桌面图标显示正常', { deep: true });

        // 验证鼠标操作
        await agent.aiRightClick('当前桌面窗口最底部的任务栏');
        await agent.aiWaitFor('任务栏右键菜单项显示任务栏设置');
        await agent.aiAssert('鼠标右键功能操作正常');
        await device.pressKey('ESC');
        await agent.aiTap('任务栏最左端的启动器按钮，hover提示为启动器', { deep: true });
        await agent.aiWaitFor('启动器菜单显示', { timeoutMs: 60000 });
        await agent.aiAssert('鼠标左键功能操作正常');
        await device.pressKey('ESC');

        //注销当前登录用户
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示');
        await agent.aiTap('注销按钮');
        // 切换回原用户登录
        const UserName = env.testUserName || process.env.TEST_USERNAME || 'uos';
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        await agent.aiWaitFor('登录界面已显示', { timeoutMs: 60000 });
        await agent.aiTap('右下角的切换用户按钮');        
        await agent.aiTap(UserName);
        await agent.aiTap('密码输入框');
        await device.typeText(`${passWord}`);
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
    }, { timeout: 600000, tags: ['1844349', 'level1', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

        // 恢复测试环境：删除新增的用户
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${testUserName}`;
        await system.exec(deleteUserCmd);
    });
});