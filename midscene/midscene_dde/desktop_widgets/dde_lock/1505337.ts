
/**
 * 用例 PMSID: 1505337
 * 用例标题:【控制中心】【账户】【无密码登录】锁屏界面无密码登录
 * 生成时间: 2026-01-22
 * 用例编写人: UT005044(王亮)
 */
describe('1505337-【控制中心】【账户】【无密码登录】锁屏界面无密码登录', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
    test('1505337-【控制中心】【账户】【无密码登录】锁屏界面无密码登录', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);
        // 步骤 2: 点击一级菜单：账户
        await agent.aiTap("账户", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户，且右侧区域中存在设置项标题：免密登录，对应最右侧展示开关按钮，默认关闭状态，灰色效果");
        // 步骤 3: 点击开关项：免密登录
        await agent.aiAction("点击“免密登录”设置项最右侧的灰色开关按钮", { cacheable: true });
        await agent.aiAssert("窗口最上层弹出授权框，标题文案：开启免密登录需要认证，且默认选择了当前系统账户名，密码框默认有焦点选中态高亮效果，底色提示文案：请输入密码，底部有取消和确定2个按钮");
        //检查1：授权框输入密码，开启免密登录成功
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await agent.aiAssert("授权框关闭，“免密登录”设置项对应最右侧的开关按钮开启，更新为活动色高亮效果");
        //检查2：进入锁屏界面，免密登录状态
        await device.pressKey("Super", "L");
        await agent.aiAssert("锁屏界面中的中央位置处，账户名称下方没有密码框，存在锁形图案的高亮按钮");
        //检查3：直接回车，进入桌面后，可直接检查当前桌面的窗口为账户界面
        await device.pressKey("Enter");
        await agent.aiAssert("导航栏显示：账户，且右侧区域中存在设置项标题：免密登录，对应最右侧展示开关按钮，已开启状态，高亮效果");
    }, { timeout: 600000, tags: ["1505337", "level2", "smoke"] });
  
    afterEach(async ({ device, agent}) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        //还原环境：恢复免密登录开关状态
        await system.exec(`echo ${env.testPassword} | sudo -S dbus-send --system --dest=org.deepin.dde.Accounts1 --print-reply /org/deepin/dde/Accounts1/User1000 org.deepin.dde.Accounts1.User.EnableNoPasswdLogin variant:boolean:false`);

        //还原环境：确认控制中心是否正常退出，并强制杀掉
        await system.exec(`killall dde-control-center`);
    });
  });
  