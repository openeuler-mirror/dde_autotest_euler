/**
 * 用例 PMSID: 1870703
 * 用例标题:【控制中心】【个性化】【壁纸】纯色壁纸-切换选择纯色壁纸即时生效
 * 生成时间: 2026-04-24
 * 用例编写人:UT005044(王亮)
 */

describe('1870703-【控制中心】【个性化】【壁纸】纯色壁纸-切换选择纯色壁纸即时生效', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870703-【控制中心】【个性化】【壁纸】纯色壁纸-切换选择纯色壁纸即时生效', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 3: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 壁纸");
        await agent.aiAssert("右侧区域的设置项中存在标题：纯色壁纸，第二项开始默认有10张纯色壁纸框");

        // 步骤 4: 点击任意一张纯色壁纸框
        await agent.aiTap("点击纯色壁纸项中的纯红色的壁纸项", { deepThink: true });
        await device.pressKey("Super", "D");

        // 检查 1: 桌面更新为对应纯色壁纸       
        await agent.aiAssert("桌面壁纸更新为对应的纯红色");
        await device.pressKey("Super", "D");

        // 步骤 5: 继续点击任意一张纯色壁纸框
        await agent.aiTap("点击纯色壁纸项中的纯绿色的壁纸项", { deepThink: true });
        await device.pressKey("Super", "D");
    
        // 检查 2: 桌面更新为对应纯色壁纸     
        await agent.aiAssert("桌面壁纸更新为对应的纯绿色");
        await device.pressKey("Super", "D");

        // 步骤 6: 继续点击任意一张纯色壁纸框
        await agent.aiTap("点击纯色壁纸项中的纯黑色的壁纸项", { deepThink: true });
        await device.pressKey("Super", "D");
    
        // 检查 3: 桌面更新为对应纯色壁纸     
        await agent.aiAssert("桌面壁纸更新为对应的纯黑色");
        await device.pressKey("Super", "D");

    }, { timeout: 600000, tags: ["1870703", "level3"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        //还原系统原始配置
        //步骤1：还原设置为默认主题
        await agent.aiTap("点击导航栏上的标题：个性化", { deepThink: true });
        await agent.aiTap("在主题设置区域中，点击名称项：nirvana");
        await agent.aiTap("在主题设置区域中，点击名称项：origin");

        //步骤2：关闭控制中心窗口
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  