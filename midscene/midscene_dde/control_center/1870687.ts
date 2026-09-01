/**
 * 用例 PMSID: 1870687
 * 用例标题:【控制中心】【个性化】【壁纸】纯色壁纸界面展示
 * 生成时间: 2026-02-06
 * 用例编写人:UT005044(王亮)
 */

describe('1870687-【控制中心】【个性化】【壁纸】纯色壁纸界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870687-【控制中心】【个性化】【壁纸】纯色壁纸界面展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 3: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });

        //检查：纯色壁纸设置项界面展示
        await agent.aiAssert("导航栏显示：个性化 / 壁纸");
        await agent.aiAssert("右侧区域的设置项中存在标题：纯色壁纸，第一个位置是带编辑图标的彩虹色框，第二个位置开始有10张不同纯色的壁纸框");
        await agent.aiAssert("纯色壁纸项位置在系统壁纸项的下方");

    }, { timeout: 300000, tags: ["1870687", "level3"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  