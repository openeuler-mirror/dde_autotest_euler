/**
 * 用例 PMSID: 1863573
 * 用例标题:【控制中心】【隐私和安全】应用权限管控-”摄像头”应用列表子项关闭和开启需要权限认证
 * 生成时间: 2025-12-18
 * 用例编写人:UT005044(王亮)
 */

describe('1863573-【控制中心】【隐私和安全】应用权限管控-”摄像头”应用列表子项关闭和开启需要权限认证', () => {
    beforeAll(async ({ device, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1863573-【控制中心】【隐私和安全】应用权限管控-”摄像头”应用列表子项关闭和开启需要权限认证', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击隐私和安全
        await agent.aiTap("隐私和安全", { deepThink: true });
        await agent.aiAssert("导航栏显示：隐私和安全");
        await agent.aiAssert("右侧区域的列表菜单项中存在：摄像头");

        // 步骤 3: 点击摄像头
        await agent.aiTap("摄像头", { deepThink: true });
        await agent.aiAssert("导航栏显示：隐私和安全 / 摄像头");
        await agent.aiAssert("应用列表顶部显示说明文案：允许下面的应用访问您的摄像头");
        await agent.aiAssert("应用列表中每行展示各个应用的图标、名称，对应最右侧展示开关项，默认开启状态，活动色效果");

        // 步骤 4: 点击列表任意一项应用的开关，如：'安全中心'
        await agent.aiTap("点击安全中心应用项同一水平线上对应右侧的开关按钮", { deepThink: true });

        //检查1：关闭时弹出授权弹框界面展示
        await agent.aiAssert("窗口最上层弹出授权框，标题文案：修改系统级权限需要认证");
        await agent.aiAssert("授权框中，默认选择了账户名，密码框默认有焦点选中态高亮效果，底色提示文案：请输入密码，底部有取消和确定2个按钮");

        //检查2：授权成功后关闭对应开关项
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await agent.aiAssert("授权框关闭，'安全中心'应用项同一水平线上对应最右侧的开关按钮关闭，更新为灰态效果");

        //步骤 5：关闭控制中心后重新打开
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
        await device.pressKey("Alt", "F4");
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 6: 再次点击打开到隐私和安全-摄像头界面
        await agent.aiTap("隐私和安全", { deepThink: true });
        await agent.aiTap("摄像头", { deepThink: true });
        await agent.aiAssert("导航栏显示：隐私和安全 / 摄像头");
        await agent.aiAssert("安全中心应用行项同一水平线上对应最右侧的开关按钮保持灰态效果");

        // 步骤 7: 点击列表中上述已关闭的应用开关，如：'安全中心'
        await agent.aiTap("点击安全中心应用项同一水平线上最右侧的灰色关闭状态开关按钮", { deepThink: true });

        //检查3：开启时弹出授权弹框界面展示
        await agent.aiAssert("窗口最上层弹出授权框，标题文案：修改系统级权限需要认证");
        await agent.aiAssert("授权框中，默认选择了账户名，密码框默认有焦点选中态高亮效果，底色提示文案：请输入密码，底部有取消和确定2个按钮");

        //检查4：授权成功后开启对应开关项
        await device.typeText(env.testPassword);
        await agent.aiTap("确定按钮", { deepThink: true });
        await agent.aiAssert("授权框关闭，安全中心应用项同一水平线上对应最右侧的开关按钮开启，更新为活动色效果");

    }, { timeout: 600000, tags: ["1863573", "level2", "smoke"] });
  
    afterEach(async ({ device, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey("Esc");
        await device.pressKey("Super", "Down");
        await device.pressKey("Alt", "F4");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //还原环境：确认控制中心是否正常退出，并强制杀掉
        await system.exec(`killall dde-control-center`);
        await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);   
    });
  });
  