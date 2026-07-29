
/**
 * 用例 PMSID: 1806191
 * 用例标题:  主目录图标 - 窗口操作
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/11
 */
describe('1806191-主目录图标 - 窗口操作', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
    test('1806191-主目录图标 - 窗口操作', async ({ device, agent, uos, system }) => {
        console.log("验证桌面选中主目录图标，双击");
        await agent.aiDoubleClick("主目录");
        await agent.aiAssert("文管路径显示为主目录路径");
        console.log("验证文管主目录窗口，最大化");
        try {
            await agent.aiAssert("文件管理器窗口最大化展示");
            console.log("窗口已经是最大化状态");
        } catch (e) {
            console.log("窗口未最大化，执行最大化操作");
            await agent.aiTap("文件管理器右侧最大化按钮");
            await agent.aiAssert("文件管理器窗口最大化展示");
        }
        console.log("验证文管主目录窗口，最小化");
        await uos.minimizeWindow();
        await agent.aiAssert("文件管理器窗口最小化至任务栏")
        console.log("验证文管主目录窗口，调整窗口长宽");
        await agent.aiTap("点击任务栏文件管理器图标");
        await device.pressKey("Super+down");
        await agent.aiAssert("文件管理器窗口未最大化展示");
        console.log("验证文管主目录窗口移动");
        await device.pressKey("super+left");
        await agent.aiAssert("文件管理器窗口在桌面左侧展示");
        await device.pressKey("super+right");
        await agent.aiAssert("文件管理器窗口在桌面右侧展示");
        console.log("验证文管主目录窗口，关闭");
        await uos.closeCurrentWindow();
        await agent.aiAssert("文件管理器窗口已关闭");
    }, { timeout: 1200000, tags: ["1806191", 'level3', 'home_directory', 'DITT', 'xuqi'] });
    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});