/**
 * 用例 PMSID: 1810957
 * 用例标题:   长文件名-/tmp目录删除新建
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/10
 */

describe('1810957-长文件名-/tmp目录删除新建', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1810957-长文件名-/tmp目录删除新建', async ({ device, agent, uos, system }) => {
        console.log('验证进入系统盘/tmp目录，新建一个文件夹');
        const folder = "1810957";
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的系统盘");
        await agent.aiDoubleClick("tmp");
        await agent.aiWaitFor("进入到tmp文件中");
        await device.pressKey("ctrl+shift+n");
        await device.typeText(folder);
        await device.pressKey("ENTER");
        await agent.aiAssert(folder);

        console.log('验证删除该文件夹');
        await agent.aiRightClick(folder);
        await agent.aiTap('删除(D)');
        await agent.aiTap('删除');
        await agent.aiAssert(`文件夹中不存在${folder}`);
        await uos.closeCurrentWindow();

    }, { timeout: 1200000, tags: ["1810957", 'level2', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});