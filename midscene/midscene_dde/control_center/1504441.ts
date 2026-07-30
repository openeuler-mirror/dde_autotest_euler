/**
 * 用例 PMSID: 1504441
 * 用例标题:【控制中心】【账户】【账户类型】管理员用户可创建管理员用户
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504441-【控制中心】【账户】【账户类型】管理员用户可创建管理员用户', () => {
    const newUserName = 'admin1';
    
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504441-管理员用户可创建管理员用户', async ({ device, agent, uos, env }) => {
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const newUserPassword = 'uostest123';
        
        // 打开控制中心-帐户，在帐户列表点击添加新用户
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiTap('账户');
        await agent.aiTap('添加新用户按钮');
        await agent.aiAssert('显示创建新用户窗口，属性名称有：账户类型、用户名、全名、新密码、重复密码、密码提示');

        // 进行新用户信息设置
        await agent.aiTap('账户类型下拉框');
        await agent.aiTap('管理员');
        await agent.aiTap('用户名输入框');
        await device.typeText(newUserName);
        await agent.aiTap('新密码的输入框');
        await device.typeText(newUserPassword);
        await agent.aiTap('重复密码的输入框');
        await device.typeText(newUserPassword);
        await agent.aiTap('创建用户按钮');
        await agent.aiWaitFor('弹出修改用户数据需要认证对话框');

        // 当前登录账户认证后，完成新用户创建
        await agent.aiTap('密码输入框');
        await device.typeText(`${passWord}`);
        await agent.aiTap('确认按钮');
        await agent.aiWaitFor(`显示${newUserName}、管理员`);
        await agent.aiAssert(`新用户${newUserName}创建成功`);
    }, { timeout: 300000, tags: ['1504441', 'level3', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

        // 恢复测试环境：删除新建用户
        await uos.closeCurrentWindow();
        const deleteUserCmd = `echo '${passWord}' | sudo userdel -r ${newUserName}`;
        await system.exec(deleteUserCmd);
    });
});