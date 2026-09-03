/**
 * 用例 PMSID: 1873637
 * 用例标题:【控制中心】【隐私和安全】“文件和文件夹”三级菜单展示
 * 生成时间: 2025-12-16
 * 用例编写人:UT005044(王亮)
 */

describe('1873637-【控制中心】【隐私和安全】“文件和文件夹”三级菜单展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1873637-【控制中心】【隐私和安全】“文件和文件夹”三级菜单展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击隐私和安全
        await agent.aiTap("隐私和安全", { deepThink: true });
        await agent.aiAssert("导航栏显示：隐私和安全");
        await agent.aiAssert("右侧区域的列表菜单项中存在：文件和文件夹");

        // 步骤 3: 点击文件和文件夹
        await agent.aiTap("文件和文件夹", { deepThink: true });

        //检查：文件和文件夹列表界面展示
        await agent.aiAssert("导航栏显示：隐私和安全 / 文件和文件夹");
        await agent.aiAssert("应用列表顶部显示说明文案：允许下面的应用访问您的文件和文件夹");
        await agent.aiAssert("应用列表中每行展示各个应用的图标、名称，对应最右侧展示下拉箭头图标");

    }, { timeout: 120000, tags: ["1873637", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  });
  