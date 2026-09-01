/**
 * 用例 PMSID: 1871061
 * 用例标题: 【控制中心】【个性化】【壁纸】纯色壁纸右键菜单展示
 * 生成时间: 2026-02-06
 * 用例编写人:UT005044(王亮)
 */

describe('1871061-【控制中心】【个性化】【壁纸】纯色壁纸右键菜单展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1871061-【控制中心】【个性化】【壁纸】纯色壁纸右键菜单展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 3: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 壁纸;右侧区域的设置项中存在标题：纯色壁纸");

        //检查 1：纯色壁纸项中任意色框的右键菜单展示
        await agent.aiRightClick("纯色壁纸中第2个颜色框区域", { deepThink: true });
        await agent.aiWaitFor("颜色框的右键菜单已显示");
        await agent.aiAssert("当前鼠标处所在位置紧靠下方展示右键菜单框，从上到下展示2个菜单项：设置锁屏、设置桌面，默认无焦点活动色");

        //检查 2：纯色壁纸项中任意色框的右键菜单展示
        await device.pressKey("Esc");
        await agent.aiRightClick("纯色壁纸中第5个颜色框区域", { deepThink: true });
        await agent.aiWaitFor("颜色框的右键菜单已显示");
        await agent.aiAssert("当前鼠标处所在位置紧靠下方展示右键菜单框，从上到下展示2个菜单项：设置锁屏、设置桌面，默认无焦点活动色，上一个位置处的右键菜单框不存在了");

        //检查 3：纯色壁纸项中任意色框的右键菜单展示
        await device.pressKey("Esc");
        await agent.aiRightClick("纯色壁纸中倒数第3个红颜色框区域", { deepThink: true });
        await agent.aiWaitFor("颜色框的右键菜单已显示");
        await agent.aiAssert("当前鼠标处所在位置紧靠下方展示右键菜单框，从上到下展示2个菜单项：设置锁屏、设置桌面，默认无焦点活动色，上一个位置处的右键菜单框不存在了");

        //检查 4：纯色壁纸项中任意色框的右键菜单展示
        await device.pressKey("Esc");
        await agent.aiRightClick("纯色壁纸中第2个颜色框区域", { deepThink: true });
        await agent.aiWaitFor("颜色框的右键菜单已显示");
        await agent.aiAssert("当前鼠标处所在位置紧靠下方展示右键菜单框，从上到下展示2个菜单项：设置锁屏、设置桌面，默认无焦点活动色，上一个位置处的右键菜单框不存在了");


    }, { timeout: 300000, tags: ["1871061", "level3"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  