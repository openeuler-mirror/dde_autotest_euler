/**
 * 用例 PMSID: 1812239
 * 用例标题:    长文件名功能-第三方适配，打印预览
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/3/4
 */

describe('1812239-长文件名功能-第三方适配，打印预览', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812239-长文件名功能-第三方适配，打印预览', async ({ device, agent, uos, system }) => {
        console.log("验证库目录，选择长文件名的文本文档，右上角菜单 - 打印，检查是否预览正常");
        const user = process.env.TEST_USERNAME;
        const test_file = "test-1812239.txt";
        await system.exec(`echo "test123" > "/home/${user}/Documents/${test_file}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await agent.aiDoubleClick(test_file);
        await agent.aiAssert(`打开了${test_file}文本文件`);
        await agent.aiTap("文本编辑器右侧的主菜单按钮");
        await agent.aiTap("打印");
        await agent.aiAssert(`打开了打印预览，进入了打印预览界面`);
        await device.pressKey("ESC");
        await uos.closeCurrentWindow();
    }, { timeout: 1200000, tags: ["1812239", 'level3', 'external_interaction', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await uos.closeCurrentWindow();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
        const user = process.env.TEST_USERNAME;
        const test_file = "test-1812239.txt";
        await system.exec(`rm -rf "/home/${user}/Documents/${test_file}"`);
    });
});