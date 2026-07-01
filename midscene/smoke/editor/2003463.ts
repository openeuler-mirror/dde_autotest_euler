/**
 * 用例 PMSID: 2003463
 * 用例标题: 【桌面组件-预装应用】文档查看器
 * 生成时间: 2026-06-17
 * 用例编写人: UT006365（郭烨瑾）
 */

describe('2003463-【桌面组件-预装应用】文档查看器', () => {
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
        testContent: "pdf",
        tags: ['2003463', 'level1', 'version=1']
    };

    test('2003463-【桌面组件-预装应用】文档查看器', async ({ agent, device, uos }) => {
        // 打开文档查看器
        await uos.openApp('文档查看器');
        await agent.aiWaitFor('文档查看器打开，页面显示"选择文件"蓝色按钮');
        // 选择pdf文件
        await agent.aiTap("选择文件");
        await agent.aiAssert("显示主目录、桌面、视频、音乐等文字内容");
        await agent.aiTap("计算机");
        await agent.aiAssert("显示我的目录文字内容");
        await agent.aiTap("右上角放大镜样式的搜索图标");
        await agent.aiAssert("我的目录上方出现“搜索或输入地址”字样");
        await device.typeText(config.testContent);
        await device.pressKey("Enter");
        await new Promise((r) => setTimeout(r, 500));
        await agent.aiWaitFor('名称、路径、修改时间下方出现文档');
        await agent.aiTap("列表中任意名称末尾后缀为.pdf的文档");
        await agent.aiTap("打开");
        await agent.aiAssert("文档查看器中能够正常查看pdf文件内容");
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