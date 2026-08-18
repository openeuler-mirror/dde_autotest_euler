/**
 * 用例 PMSID: 1846877
 * 用例标题:【控制中心】【个性化】【桌面和任务栏】【状态】个性化界面设置任务栏状态“一直隐藏”即时生效
 * 生成时间: 2025-12-19
 * 用例编写人:UT005044(王亮)
 */

describe('1846877-【控制中心】【个性化】【桌面和任务栏】【状态】个性化界面设置任务栏状态“一直隐藏”即时生效', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1846877-【控制中心】【个性化】【桌面和任务栏】【状态】个性化界面设置任务栏状态“一直隐藏”即时生效', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的存在设置项标题：桌面和任务栏");

        // 步骤 3: 桌面和任务栏
        await agent.aiTap("桌面和任务栏", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 桌面和任务栏");
        await agent.aiAssert("右侧区域的存在设置项标题：状态，对应最右侧展示状态文案：一直显示，右侧展示下拉箭头图标");

        // 步骤 4: 点击一直显示
        await agent.aiTap("点击“状态”右侧显示“一直显示”的下拉框");
        await agent.aiAssert("展示下拉菜单框，存在三个菜单项标题:一直显示，一直隐藏，智能隐藏");

        // 步骤 5: 点击一直隐藏
        await agent.aiTap("点击下拉菜单框的菜单项：一直隐藏");

        //检查1：一直隐藏生效的状态
        await agent.aiAssert("下拉菜单框关闭，“状态”设置项的最右侧状态文案更新为“一直隐藏”");
        await agent.aiAssert("界面底部位置不存在多个应用图标");

        // 步骤 6: 修改为智能隐藏
        await device.pressKey("Super", "Down");
        await agent.aiTap("点击“状态”右侧显示“一直隐藏”的下拉框");
        await agent.aiTap("点击下拉菜单框的菜单项：智能隐藏");
        await agent.aiAssert("下拉菜单框关闭，“状态”设置项的最右侧状态文案更新为“智能隐藏”");
        await agent.aiAssert("界面底部位置展现了任务栏区域");

        // 步骤 7: 再次切换到一直隐藏
        await agent.aiTap("点击“状态”右侧显示“智能隐藏”的下拉框");
        await agent.aiTap("点击下拉菜单框的菜单项：一直隐藏");

        //检查2：一直隐藏生效的状态
        await agent.aiAssert("下拉菜单框关闭，“状态”设置项的最右侧状态文案更新为“一直隐藏”");
        await agent.aiAssert("界面底部位置不存在多个应用图标");

        // 还原任务栏的状态设置
        await device.pressKey("Super", "Down");
        await agent.aiTap("点击“状态”右侧显示“一直隐藏”的下拉框");
        await agent.aiTap("点击下拉菜单框的菜单项：一直显示");
        await agent.aiAssert("下拉菜单框关闭，“状态”设置项的最右侧状态文案更新为“一直显示”");
        await agent.aiAssert("界面底部位置展现了任务栏区域");

    }, { timeout: 600000, tags: ["1846877", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 还原环境，保证任务栏一直显示状态
        await system.exec(`dbus-send --session --print-reply   --dest=org.deepin.dde.daemon.Dock1   /org/deepin/dde/daemon/Dock1   org.freedesktop.DBus.Properties.Set   string:"org.deepin.dde.daemon.Dock1"   string:"HideMode"   variant:int32:0`);
        await uos.closeCurrentWindow();
    });
  });
  