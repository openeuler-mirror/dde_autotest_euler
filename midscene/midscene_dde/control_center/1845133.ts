/**
 * 用例 PMSID: 1845133
 * 用例标题:【控制中心】【账户】【无密登录】无密登录开启后，锁屏界面可无密码登录
 * 生成时间: 2025-12-23
 * 用例编写人:UT005044(王亮)
 */

describe('1845133-【控制中心】【账户】【无密登录】无密登录开启后，锁屏界面可无密码登录', () => {
    beforeAll(async ({ device, uos, env, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1845133-【控制中心】【账户】【无密登录】无密登录开启后，锁屏界面可无密码登录', async ({ device, agent, uos, env, system }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击账户
        await agent.aiTap("账户", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户，且右侧区域中存在设置项标题：免密登录，对应最右侧展示开关按钮，默认关闭状态，灰色效果");

        // 步骤 3: 点击免密登录的开关项
        await agent.aiTap("免密登录项同一水平线上对应右侧的第三个开关按钮", { deepThink: true });

        //检查1：免密登录开启时弹出授权弹框界面展示
        await agent.aiAssert("窗口最上层弹出授权框，标题文案：开启免密登录需要认证");

        //检查2：授权框输入密码，开启免密登录成功后的状态
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiAssert("授权框关闭，“免密登录”项对应最右侧的第三个开关按钮开启，为活动色高亮效果");

        //检查3：进入锁屏界面免密登录状态
        await device.pressKey("Super", "L");
        await new Promise(resolve => setTimeout(resolve, 3000));
        await agent.aiAssert("锁屏界面中的中央位置处，账户名称下方没有密码框，存在锁形图案的高亮按钮");

        //检查4：点击锁形登录按钮直接进入桌面
        await agent.aiTap("点击锁形图案的高亮按钮", { deepThink: true });
        await agent.aiAssert("导航栏显示：账户，免密登录项同一水平线上对应最右侧第三个开关按钮开启状态，高亮效果");

    }, { timeout: 600000, tags: ["1845133", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, uos, env, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        //还原环境1：恢复免密登录开关状态
        await system.exec(`echo ${env.testPassword} | sudo -S dbus-send --system --dest=org.deepin.dde.Accounts1 --print-reply /org/deepin/dde/Accounts1/User1000 org.deepin.dde.Accounts1.User.EnableNoPasswdLogin variant:boolean:false`);

        //还原环境2：恢复窗口大小，并关闭
        await device.pressKey("Esc");
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //还原环境：确认控制中心是否正常退出，并强制杀掉
        await system.exec(`killall dde-control-center`);
        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
    });
  });
  