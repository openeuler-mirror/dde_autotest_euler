/**
 * 用例 PMSID: 1873565
 * 用例标题:【【控制中心】【搜索】搜索结果列表框界面展示
 * 生成时间: 2025-12-16
 * 用例编写人:UT005044(王亮)
 */

describe('1873565-【控制中心】【搜索】搜索结果列表框界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1873565-【控制中心】【搜索】搜索结果列表框界面展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击搜索框，并输入关键字
        await agent.aiTap("左上角的搜索框", { deepThink: true });
        await device.typeText("账户");

        //检查：搜索结果项列表框
        await agent.aiAssert("即时展示搜索结果列表框，一直展示，默认第一行有焦点底色");
        await agent.aiAssert("搜索结果列表框中有多行搜索结果，每行展示相关设置项的图标、全路径");
        await agent.aiAssert("每行的搜索结果设置项全路径中，包含关键字部分显示红色");

    }, { timeout: 300000, tags: ["1873565", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  });
  