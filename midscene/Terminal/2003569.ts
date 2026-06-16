/**
 * 用例 PMSID: 2003569
 * 用例标题: 【桌面组件-预装应用】终端
 * 生成时间: 2026-06-16
 * 用例编写人: UT006365（郭烨瑾）
 */

describe('2003569-【桌面组件-预装应用】终端', () => {
    beforeAll(async ({ uos }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({}) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
    const config = {
        mainWaitTimeout: 10000,
        testTimeout: 300000,
        Command0:"cd ~",
        Command1:"ls",
        Command2:"pwd",
        tags: ['2003569', 'level1', 'version=1']
    };

    test('2003569-【桌面组件-预装应用】终端', async ({ agent,device }) => {
        // 打开终端
        await device.pressKey("Control", "Alt", "T");
        await agent.aiWaitFor('终端应用已打开, 显示System load、IP address、 Users online等文字信息');
        // 输入命令验证
        await device.typeText(config.Command0);
        await device.pressKey("Enter");
        await device.typeText(config.Command1);
        await device.pressKey("Enter");
        await agent.aiAssert("终端中ls下方显示Desktop、Downloads、Music、Videos等内容");
        await device.typeText(config.Command2);
        await device.pressKey("Enter");
        await agent.aiAssert("终端中pwd下方显示/root文字内容");
    }, { timeout: config.testTimeout, tags: config.tags });

    afterEach(async ({ uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await uos.closeCurrentWindow();
        await uos.showDesktop();
    });

    afterAll(async ({ }) => {
        console.log('5. afterAll: 清理测试套件');
    });
});