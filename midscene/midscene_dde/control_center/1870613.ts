/**
 * 用例 PMSID: 1870613
 * 用例标题:【控制中心】【个性化】【屏幕保护】屏幕屏保三级界面展示
 * 生成时间: 2025-12-17
 * 用例编写人:UT005044(王亮)
 */

describe('1870613-【控制中心】【个性化】【屏幕保护】屏幕屏保三级界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870613-【控制中心】【个性化】【屏幕保护】屏幕屏保三级界面展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：屏幕保护");

        // 步骤 3: 点击屏幕保护
        await agent.aiTap("屏幕保护", { deepThink: true });

        //检查：屏幕保护菜单界面展示
        await agent.aiAssert("导航栏显示：个性化 / 屏幕保护");
        await agent.aiAssert("右侧区域的设置项中存在标题：屏幕保护");
        await agent.aiAssert("右侧区域的设置项中存在标题：个性化屏保，对应最右侧按钮标题：设置，默认为灰态效果，不可点击");
        await agent.aiAssert("右侧区域的设置项中存在标题：闲置时间，对应最右侧展示状态文案：从不，右侧有下拉箭头标识");
        await agent.aiAssert("右侧区域的设置项中存在标题：恢复时需要密码，相对最右侧为开关按钮，默认为关闭状态，灰色");
        await agent.aiAssert("右侧区域的设置项中存在标题：图片轮播屏保，紧靠下方区域存在一个屏保图片框");
        await agent.aiAssert("右侧区域的设置项中存在标题：系统屏保，紧靠下方区域有多个屏保图片框，第一项有选中态高亮边框");

    }, { timeout: 600000, tags: ["1870613", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  