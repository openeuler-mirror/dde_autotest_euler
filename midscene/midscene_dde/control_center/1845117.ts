/**
 * 用例 PMSID: 1845117
 * 用例标题:【控制中心】【账户】【自动登录】自动登录开启生效正常
 * 生成时间: 2026-04-29
 * 用例编写人:UT005044(王亮)
 */

describe('1845117-【控制中心】【账户】【自动登录】自动登录开启生效正常', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1845117-【控制中心】【账户】【自动登录】自动登录开启生效正常', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击账户
        await agent.aiTap("账户", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户");
        await agent.aiAssert("右侧区域中存在设置项标题：自动登录，对应最右侧展示开关项，默认关闭状态，灰色效果");

        // 步骤 3: 点击自动登录的开关项
        await agent.aiAction("点击“自动登录”设置项同一水平线上右侧的开关按钮", { cacheable: true });

        //检查1：自动登录开启时弹出授权弹框界面展示
        await agent.aiAssert("窗口最上层弹出授权框，标题文案：开启自动登录需要认证");
        await agent.aiAssert("授权框中，默认选择了当前系统账户名，密码框默认有焦点选中态高亮效果，底色提示文案：请输入密码，底部有取消和确定2个按钮");

        //检查2：关闭授权框后状态展示
        await agent.aiTap("取消按钮", { deepThink: true });
        await agent.aiAssert("授权框关闭，“自动登录”设置项对应最右侧的开关按钮关闭，恢复为灰态效果");

        //步骤 4：再次开启自动登录时弹出授权弹框界面展示
        await agent.aiAction("再次点击“自动登录”设置项同一水平线上右侧的灰色开关按钮区域", { cacheable: true });
        await agent.aiAssert("窗口最上层弹出授权框，标题文案：开启自动登录需要认证");

        //检查3：授权框输入密码开启自动登录成功
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await agent.aiAssert("授权框关闭，“自动登录”设置项同一水平线上右侧的开关按钮开启，更新为活动色高亮效果");

    }, { timeout: 600000, tags: ["1845117", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');

        //还原环境1：还原自动登录为默认关闭状态
        await device.pressKey("Esc");
        await system.exec(`echo ${env.testPassword} | sudo -S dbus-send --system --dest=org.deepin.dde.Accounts1 --print-reply /org/deepin/dde/Accounts1/User1000 org.deepin.dde.Accounts1.User.SetAutomaticLogin variant:boolean:false`);
        
        //还原环境2：关闭打开的应用      
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //还原环境：确认控制中心是否正常退出，并强制杀掉
        await system.exec(`killall dde-control-center`);
    });
  });
  