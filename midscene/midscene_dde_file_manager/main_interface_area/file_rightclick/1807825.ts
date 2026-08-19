/**
 * 用例 PMSID: 1807825
 * 用例标题:   安装wps官网的个人版，检查桌面和文管右键菜单
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/10
 */

describe('1807825-安装wps官网的个人版，检查桌面和文管右键菜单', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807825-安装wps官网的个人版，检查桌面和文管右键菜单', async ({ device, agent, uos, system }) => {
        console.log('验证安装wps官网的个人版后，检查桌面和文管右键菜单');
        await agent.aiAssert("桌面存在wps Office、wps PDF、wps 表格、wps 文字、wps 演示的图标");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await agent.aiRightClick('空白处');
        await agent.aiTap("新建文档");
        await agent.aiAssert("菜单中展示了办公文档、电子表格、演示文档、文本文档");
        await agent.aiTap("空白处");
        await uos.closeCurrentWindow();

        console.log('验证检查桌面右键菜单');
        await agent.aiRightClick('空白处');
        await agent.aiTap("新建文档");
        await agent.aiAssert("菜单中展示了办公文档、电子表格、演示文档、文本文档");
        await agent.aiTap("空白处");


    }, { timeout: 1200000, tags: ["1807825", 'level3', 'file_rightclick', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});