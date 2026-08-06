/**
 * 用例 PMSID: 1505265
 * 用例标题:【控制中心】【账户】单用户无密码登录
 * 生成时间: 2026-05-12
 * 用例编写人: UT002485(卢燕)
 */
       
describe('1505265-【控制中心】【账户】单用户无密码登录', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, env, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1505265-【控制中心】【账户】单用户无密码登录', async ({ device, agent, uos, env, system }) => {
        // 获取密码
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

        // 打开控制中心-账户页面
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiTap('账户');
        await agent.aiAssert('账户信息已显示');

        // 免密登录设置使能
        await agent.aiTap('免密登录右侧的使能按钮');
        await agent.aiAssert('开启无密码登录需要认证');
        await agent.aiTap('密码输入框');
        await device.typeText(`${passWord}`);
        await agent.aiTap('蓝色确认按钮');
        await agent.aiAssert('无密码登录开关已开启', { deepThink: true });
        await device.pressKey('alt', 'F4');

        // 验证账户免密登录正确性
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示');
        await agent.aiTap('锁屏按钮', { deepThink: true });
        await agent.aiWaitFor('登录界面已显示');
        await agent.aiAssert('密码输入框不可见');

        // 点击登录按钮直接进入系统
        await agent.aiTap('锁定按钮');
        await agent.aiWaitFor('UOS桌面已显示');

    }, { timeout: 300000, tags: ['1505265','level1','smoke','remote'] });  

    afterAll(async ({ uos, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
         // 测试环境还原--免密登录设置为去使能
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const disableCmd = `echo '${passWord}' | sudo dbus-send --system --dest=com.deepin.daemon.Accounts --print-reply /com/deepin/daemon/Accounts/User1000 com.deepin.daemon.Accounts.User.EnableNoPasswdLogin variant:boolean:false`;
        await system.exec(disableCmd);
        await uos.closeCurrentWindow();
    });
});
