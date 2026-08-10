/**
 * 用例 PMSID: 1812237
 * 用例标题:   长文件名功能-第三方适配，设置壁纸
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/3/4
 */

describe('1812237-长文件名功能-第三方适配，设置壁纸', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const caseDir = process.env.TESTCASE_DIR;
        const { clearEnvironment, closeFileManager, enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await enableLongFileName(device,agent,system);
        await uos.closeCurrentWindow();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812237-日志适配规范-文管日志配置文件查看', async ({ device, agent, uos, system }) => {
        console.log("验证库目录，选择长文件名的图片，右键设为壁纸");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的图片");
        await agent.aiDoubleClick("Wallpapers");
        await agent.aiTap("右侧列表视图按钮（第二个按钮）");
        await agent.aiRightClick("desktop.jpg");
        await agent.aiTap("设置壁纸");
        await uos.closeCurrentWindow();
        await agent.aiAssert("桌面壁纸图片已改变");
    }, { timeout: 1200000, tags: ["1812237", 'level3', 'external_interaction', 'DITT', 'remote', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的图片");
        await agent.aiDoubleClick("Wallpapers");
        await agent.aiRightClick("Colorful-Abstraction03.jpg");
        await agent.aiTap("设置壁纸");
        await agent.aiTap("右侧图标视图按钮（第一个按钮）");
        await uos.closeCurrentWindow();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});