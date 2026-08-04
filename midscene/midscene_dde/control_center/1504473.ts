/**
 * 用例 PMSID: 1504473
 * 用例标题:【控制中心】【账户】【密码】密码输入框显示
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1504473-【控制中心】【账户】【密码】密码输入框显示', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1504473-密码输入框显示', async ({ device, agent, uos }) => {
        const testPassword = 'test1234';
        const passwordFields = ['当前密码', '新密码', '重复密码'];

        // 步骤1: 启动控制中心-账户-修改密码，检查密码输入框显示
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiWaitFor('系统设置界面已显示', { timeoutMs: 30000 });
        await agent.aiTap('账户');
        await agent.aiTap('密码');
        await agent.aiAssert('修改密码已显示');
        await agent.aiTap('修改密码');
        await agent.aiAssert('进入密码修改界面，显示当前密码、新密码、重复密码、密码提示输入框');
        await agent.aiAssert('当前密码、新密码、重复密码输入框内默认显示必填字样');
  
        // 步骤2: 循环验证每个密码输入框的显示功能    
        for (const field of passwordFields) {
            await agent.aiInput(testPassword, `${field}输入框`);
            
            // 验证默认显示为圆点
            await agent.aiAssert(`${field}输入框默认显示为圆点`);
            
            // 点击明文显示按钮
            await agent.aiTap(`${field}后的明文显示按钮`);
            await agent.aiAssert(`${field}输入框内显示${testPassword}`, {deepthink: true});
            
            // 点击隐藏按钮，关闭明文
            await agent.aiTap(`${field}后的明文隐藏显示按钮`);
            await agent.aiAssert(`${field}输入框内容显示为圆点`);
        } 
    }, { timeout: 600000, tags: ['1504473', 'level1','smoke'] });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭修改密码和控制中心窗口
        await agent.aiTap('修改密码窗口关闭按钮');
        await device.pressKey('Alt', 'F4');
    });
});