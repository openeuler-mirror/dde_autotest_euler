/**
 * 用例 PMSID: 1806361
 * 用例标题:    日志适配规范-日志收集工具查看文管应用日志
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/12
 */

describe('1806361-重命名支持殊符号-不支持特殊符号', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806361-重命名支持殊符号-不支持特殊符号', async ({ device, agent, uos, system }) => {
        console.log('验证启动【日志收集工具】，点击左侧导航栏【应用日志】');
        const pwd = process.env.TEST_PASSWORD;
        await uos.openApp('日志收集工具', 2000, 20000, true);
        await agent.aiTap("点击左侧边栏的应用日志");
        await device.typeText(pwd);
        await device.pressKey("ENTER");
        await agent.aiAssert('进入应用日志界面');

        console.log('验证点击【应用列表】，选择"文件管理器"');
        await agent.aiTap("点击级别右侧的应用下拉框");
        await agent.aiScroll({ direction: 'down', distance: 2 });
        await agent.aiWaitFor("文件管理器选项已显示");
        await agent.aiTap("下拉列表框中的文件管理器");
        await agent.aiAssert('应用下拉框展示为文件管理器');

        console.log('验证进行【级别】切换');
        await agent.aiTap("点击级别下拉框");
        await agent.aiTap("全部");
        await agent.aiAssert('级别下拉框展示为全部');
        await agent.aiAssert('展示了日志信息');

        await agent.aiTap("点击级别下拉框");
        await agent.aiTap("点击级别下拉框中的警告");
        await agent.aiAssert('级别下拉框展示为警告');
        await agent.aiAssert('展示了警告级别日志信息');

        await agent.aiTap("点击级别下拉框");
        await agent.aiTap("点击级别下拉框中的错误");
        await agent.aiAssert('级别下拉框展示为错误');
        await agent.aiAssert('展示了错误级别日志信息');
        await uos.closeCurrentWindow();
    }, { timeout: 600000, tags: ["1806361", 'level4', 'external_interaction', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});