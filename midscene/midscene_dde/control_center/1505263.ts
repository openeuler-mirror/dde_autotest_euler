/**
 * 用例 PMSID: 1505263
 * 用例标题:【控制中心】【账户】单用户设置自动登录
 * 生成时间: 2026-05-15
 * 用例编写人: UT002485(卢燕)
 */

describe('1505263-【控制中心】【账户】单用户设置自动登录', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1505263-单用户设置自动登录', async ({ device, agent, uos, env }) => {
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const UserName = env.testUserName || process.env.TEST_USER_NAME || 'uos';
        
        // 步骤1: 启动控制中心-账户-点击账户列表，检查自动登录开关
        await uos.openApp('控制中心', { maximizeWindow: true });
        await agent.aiTap('账户');
        await agent.aiAssert('自动登录开关默认是关闭状态');

        // 步骤2: 点击打开自动登录开关
        await agent.aiTap('自动登录右侧的开关');
        await agent.aiAssert('弹出密码授权框，开启自动登录需要认证');

        // 步骤3: 输入密码，点击授权
        await agent.aiInput(passWord, '密码输入框');
        await agent.aiTap('确认按钮');
        await agent.aiAssert('自动登录开关已打开');
        await agent.aiTap('窗口右上角关闭按钮');

        // 步骤4: 重启电脑，检查用户是否自动登录
        await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
        await agent.aiWaitFor('电源管理界面已显示', { timeoutMs: 300000 });
        await agent.aiTap('重启按钮');
        await agent.aiWaitFor('桌面已显示', { timeoutMs: 300000 });
        await agent.aiAssert('用户自动登录到桌面');

        // 步骤5: 检查配置文件
        await device.pressKey("Ctrl+Alt+T");
        await agent.aiTap("终端的中间");
        await agent.aiAssert("显示终端");
        await agent.aiInput('cat /etc/lightdm/lightdm.conf |grep autologin',"终端");
        await device.pressKey('Enter');
        await agent.aiAssert(`终端中显示autologin-user=${UserName}`);
        await agent.aiTap('关闭终端');
    }, { timeout: 300000, tags: ['1505263', 'level1', 'smoke', 'remote'] });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭自动登录
        const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
        const disableCmd = `echo '${passWord}' | sudo dbus-send --system --dest=com.deepin.daemon.Accounts --print-reply /com/deepin/daemon/Accounts/User1000 com.deepin.daemon.Accounts.User.SetAutomaticLogin variant:boolean:false`;
        await system.exec(disableCmd);
    });
});