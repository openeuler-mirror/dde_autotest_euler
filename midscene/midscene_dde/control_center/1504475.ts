/**
 * 用例 PMSID: 1504475
 * 用例标题:【控制中心】【账户】【密码】修改当前用户密码
 * 生成时间: 2026-05-14
 * 用例编写人: UT002485(卢燕)
 */

describe('1504475-【控制中心】【账户】【密码】修改当前用户密码', () => {
    const testUserName = 'testuser';
    const testUserPassword = 'test1234';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        
        // 创建测试用户
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const createUserCmd = `echo '${passWord}' | sudo useradd -m ${testUserName} -s /usr/bin/bash`;
        await system.exec(createUserCmd);
        const setPasswordCmd = `echo '${passWord}' | sudo su -c 'echo "${testUserName}:${testUserPassword}" | chpasswd'`;
        await system.exec(setPasswordCmd);
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504475-修改当前用户密码', async ({ device, agent, uos, env }) => {
        // 切换到测试用户登录
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示');
        await agent.aiTap('切换用户按钮');
        await agent.aiWaitFor('登录界面已显示');
        await agent.aiTap(testUserName);
        await agent.aiTap('密码输入框');
        await device.typeText(testUserPassword);
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
        
        // 新用户首次登录关闭欢迎窗口
        try {
            await agent.aiWaitFor('显示桌面介绍欢迎窗口', { timeoutMs: 10000 });
            await agent.aiTap('欢迎窗口右上角关闭按钮');
        } catch (e) {
            // 没有欢迎窗口则跳过
        }
        await uos.closeCurrentWindow();
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });

        // 修改当前用户密码
        const newPassword = testUserPassword + 'uos';
        
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiWaitFor('系统设置界面已显示', { timeoutMs: 30000 });
        await agent.aiTap('账户');
        await agent.aiTap('密码');
        await agent.aiAssert('修改密码已显示');
        await agent.aiTap('修改密码');
        await agent.aiAssert('进入密码修改界面，显示当前密码、新密码、重复密码、密码提示输入框');
        
        await agent.aiTap('当前密码输入框');
        await device.typeText(testUserPassword);
        await agent.aiTap('新密码输入框');
        await device.typeText(newPassword);
        await agent.aiTap('重复密码输入框');
        await device.typeText(newPassword);
        await agent.aiTap('修改密码按钮');
        await agent.aiTap('窗口右上角关闭按钮');

        // 使用修改前的旧密码登录
        await device.pressKey('Super', 'L');
        await agent.aiWaitFor('登录界面已显示');
        await agent.aiTap('密码输入框');
        await device.typeText(`${testUserPassword}`);  
        await agent.aiTap('解锁按钮');
        await agent.aiWaitFor('密码错误');
        await agent.aiAssert('显示登录界面、不能进入桌面');
       
        // 使用修改后的新密码登录
        await agent.aiTap('密码输入框');
        await device.pressKey('LeftCtrl', 'A');
        await device.pressKey('Delete');
        await device.typeText(`${newPassword}`);
        await agent.aiTap('解锁按钮');
        await agent.aiWaitFor('桌面已显示');
        await agent.aiAssert('登录成功');

        // 切换回原用户
        const UserName = env.testUserName || process.env.TEST_USERNAME || 'uos';
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示');
        await agent.aiTap('注销按钮');
        await agent.aiWaitFor('登录界面已显示', { timeoutMs: 30000 });
        await agent.aiTap('右下角的切换用户按钮');
        await agent.aiTap(UserName);
        await agent.aiTap('密码输入框');
        await device.typeText(passWord);
        await agent.aiTap('登录按钮');
        await agent.aiWaitFor('显示桌面', { timeoutMs: 30000 });

    }, { timeout: 600000, tags: ['1504475', 'level1', 'smoke', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        
        // 删除测试用户
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${testUserName}`;
        await system.exec(deleteUserCmd);
    });
});