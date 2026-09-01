/**
 * 用例 PMSID: 1871095
 * 用例标题:【控制中心】【个性化】【壁纸】自动切换壁纸下拉菜单列表展示
 * 生成时间: 2025-12-17
 * 用例编写人:UT005044(王亮)
 */

describe('1871095-【控制中心】【个性化】【壁纸】自动切换壁纸下拉菜单列表展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1871095-【控制中心】【个性化】【壁纸】自动切换壁纸下拉菜单列表展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 2: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 壁纸");
        await agent.aiAssert("右侧区域的设置项中存在标题：自动切换壁纸，对应最右侧展示文案：从不，右侧有下拉箭头标识");

        // 步骤 3: 点击从不
        await agent.aiAction("点击界面右上方“自动切换壁纸”右侧显示“从不”的下拉框");

        //检查：自动切换壁纸下拉菜单列表展示
        await agent.aiAssert("展示下拉菜单列表框，10个菜单项，从上到下依次为：从不、30秒、1分钟、5分钟、10分钟、15分钟、30分钟、1小时、登录时、唤醒时");
        await agent.aiAssert("下拉菜单列表中，默认勾选项：从不，且菜单标题项左侧有对勾标识");

    }, { timeout: 120000, tags: ["1871095", "level2", "smoke"] });
  
    afterEach(async ({ device, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey("Esc");
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  