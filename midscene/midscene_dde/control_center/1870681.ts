/**
 * 用例 PMSID: 1870681
 * 用例标题:【控制中心】【个性化】【壁纸】系统壁纸右键菜单功能-设置桌面
 * 生成时间: 2025-12-22
 * 用例编写人:UT005044(王亮)
 */

describe('1870681-【控制中心】【个性化】【壁纸】系统壁纸右键菜单功能-设置桌面', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870681-【控制中心】【个性化】【壁纸】系统壁纸右键菜单功能-设置桌面', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 3: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 壁纸");
        await agent.aiAssert("右侧区域的设置项中存在设置项标题：纯色壁纸");

        // 步骤 4: 右键点击自定义纯色壁纸框
        await agent.aiRightClick("“纯色壁纸”项中的第二项纯黑色壁纸框区域");
        await agent.aiAssert("弹出右键菜单框，存在2个菜单项标题为：设置锁屏，设置桌面");

        // 步骤 5: 点击右键菜单项：设置桌面
        await agent.aiTap("点击右键菜单项：设置桌面", { deepThink: true });

        //检查1：新添加的纯色壁纸成功后桌面展示
        await agent.aiAssert("右键菜单框消失，当前壁纸框有选中态高亮边框");
        await device.pressKey("Super", "D");
        await agent.aiAssert("桌面上的应用窗口全部隐藏，桌面的壁纸已更新为新设置的纯色壁纸");

        //检查2：新添加的纯色壁纸成功后锁屏展示
        await device.pressKey("Super", "L");
        await agent.aiAssert("锁屏界面中，背景壁纸无变化，未更新为新设置的纯黑色");

    }, { timeout: 600000, tags: ["1870681", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');
        //还原系统原始配置
        // 还原环境，登录到桌面
        await device.typeText(env.testPassword);
        await device.pressKey("Enter");

        //步骤1：先激活控制中心窗口，删除新添加的纯色壁纸
        await uos.openApp("控制中心");
        await agent.aiTap("鼠标点击系统壁纸区域中的第一个位置壁纸框");

        //步骤2：还原设置为默认主题origin
        await agent.aiTap("点击导航栏上的标题：个性化", { deepThink: true });
        await agent.aiTap("在主题设置区域中，点击名称项：nirvana");
        await agent.aiTap("在主题设置区域中，点击名称项：origin");

        //步骤3：关闭控制中心窗口
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  