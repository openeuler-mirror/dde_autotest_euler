/**
 * 用例 PMSID: 1504471
 * 用例标题:【控制中心】【账户】【账户头像】修改其它账户的头像需要授权
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504471-【控制中心】【账户】【账户头像】修改其它账户的头像需要授权', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        // 前置条件：创建testuser用户
        const createUserCmd = `echo '${passWord}' | sudo useradd -m testuser -s /usr/bin/bash`;
        await system.exec(createUserCmd);
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504471-修改其它账户的头像需要授权', async ({ device, agent, uos, env }) => {
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

        // 启动控制中心-账户，选择当前登录账户，修改头像
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 30000 });
        await agent.aiTap('账户');
        await agent.aiTap('当前登录账户');
        await agent.aiTap('编辑头像', { deepinthink: true });
        await agent.aiTap('表情符号');
        await agent.aiTap('钢琴键图标');
        await agent.aiTap('保存按钮');
        await agent.aiWaitFor('显示钢琴键头像', { timeoutMs: 30000 });
        await agent.aiAssert('显示修改后的钢琴键头像，不会弹出密码授权');

        // 不能修改其他账户testuser头像
        await agent.aiTap('其他账户下的testuser');
        await agent.aiTap('testuser左边的图标', { deepinthink: true });
        await agent.aiTap('动物');
        await agent.aiTap('卡通兔子图标');
        await agent.aiTap('保存按钮');
        
        // 等待并验证密码授权窗口弹出
        await agent.aiWaitFor('弹出密码授权窗口', { timeoutMs: 30000 });
        await agent.aiAssert('弹出密码授权窗口');
        await agent.aiTap('取消按钮');
        await agent.aiAssert('没有修改为显示卡通兔子头像');
        
        // 重新编辑头像并输入密码授权
        await agent.aiTap('testuser左边的图标', { deepinthink: true });
        await agent.aiTap('动物');
        await agent.aiTap('卡通兔子图标');
        await agent.aiTap('保存按钮');
        await agent.aiWaitFor('弹出密码授权窗口', { timeoutMs: 30000 });
        await agent.aiInput(passWord, '密码输入框');
        await agent.aiTap('确认按钮');
        await agent.aiAssert('显示修改后的卡通兔子头像');
    }, { timeout: 300000, tags: ['1504471', 'level1', 'smoke', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        //变更当前用户头像设置
        await agent.aiTap('左侧账户菜单');
        await agent.aiTap('编辑头像', { deepinthink: true });
        await agent.aiTap('头像列表中第二排第一个');
        await agent.aiTap('保存按钮');
        await agent.aiWaitFor('显示头像', { timeoutMs: 30000 });
        
        // 删除testuser用户
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r testuser`;
        await system.exec(deleteUserCmd);
        await uos.closeCurrentWindow();
    });
});