/**
 * 用例 PMSID: 1807493
 * 用例标题:   右键菜单分组优化-检查文件选择对话框右键菜单分组排序
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/11
 */

describe('1807493-右键菜单分组优化-检查文件选择对话框右键菜单分组排序', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807493-右键菜单分组优化-检查文件选择对话框右键菜单分组排序', async ({ device, agent, uos, system }) => {
        console.log("验证文件选择对话框中不同目录右键菜单中的分组方式和排序");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await agent.aiRightClick("空白处");
        await agent.aiAssert("依次展示菜单命令:新建文件夹、新建文档、全选、粘贴、刷新、显示方式、排序方式、分组方式、以管理员身份打开、在终端中打开、属性");
        await agent.aiAssert("新建文件夹和新建文档2个菜单命令没有分组分隔,在同一分组");
        await agent.aiAssert("全选、粘贴、刷新3个菜单命令没有分组分隔,在同一分组");
        await agent.aiAssert("显示方式、排序方式、分组方式3个菜单命令没有分组分隔,在同一分组里");
        await agent.aiAssert("以管理员身份打开、在终端中打开2个菜单命令没有分组分隔,在同一分组里");
        await agent.aiAssert("属性单独在最后一个分组里");
        await device.pressKey('Esc');
        await uos.closeCurrentWindow();

    }, { timeout: 1200000, tags: ["1807493", 'level4', 'external_interaction', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});