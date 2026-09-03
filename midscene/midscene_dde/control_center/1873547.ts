/**
 * 用例 PMSID: 1873547
 * 用例标题:【控制中心】【搜索】搜索框支持输入中文搜索，全包含或不连续
 * 生成时间: 2025-12-23
 * 用例编写人:UT005044(王亮)
 */

describe('1873547-【控制中心】【搜索】搜索框支持输入中文搜索，全包含或不连续', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1873547-【控制中心】【搜索】搜索框支持输入中文搜索，全包含或不连续', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击搜索框，并输入关键字
        await agent.aiTap("左上角的搜索框", { deepThink: true });
        await device.typeText("账");

        //检查1：搜索到包含“账”字的所有的菜单项
        await agent.aiAssert("即时展示搜索结果列表框，一直展示，默认第一行有高亮底色");
        await agent.aiAssert("搜索结果列表框中有多行搜索结果，每行展示相关设置项的图标、全路径");
        await agent.aiAssert("每行的搜索结果设置项全路径中，包含“账”关键字，且高亮显示");

        // 步骤 3: 点击搜索框，并输入连续的关键字
        await agent.aiTap("点击左上角搜索框右侧的“X”关闭按钮", { deepThink: true });
        await device.typeText("网络");

        //检查2：搜索到包含“个性化”关键字的所有的菜单项
        await agent.aiAssert("搜索结果列表框中有搜索结果，每行的搜索结果设置项全路径字符中，存在不同的层级，且同时包含“网”，“络”2个关键字");

        // 步骤 4: 点击搜索框，并输入不连续的关键字
        await agent.aiTap("点击左上角搜索框右侧的“X”关闭按钮", { deepThink: true });
        await device.typeText("网属");

        //检查2：搜索到包含“网属”关键字的所有的菜单项
        await agent.aiAssert("搜索结果列表框中有搜索结果，每行的搜索结果设置项全路径字符中，都同时包含“网”，“属”2个关键字");

    }, { timeout: 300000, tags: ["1873547", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  });
  