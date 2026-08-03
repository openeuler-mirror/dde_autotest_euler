/**
 * 用例 PMSID: 1806327
 * 用例标题:  [050]最近使用文件右键-多个不同类文件右键-属性
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806327-[050]最近使用文件右键-多个不同类文件右键-属性', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await uos.showDesktop();
    });


    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806327-[050]最近使用文件右键-多个不同类文件右键-属性', async ({ device, agent, uos, system }) => {

        // 清理已存在的测试文件和快捷方式
        await system.exec('test -f ~/Desktop/test00.txt && rm -f ~/Desktop/test00.txt', 500);


        // 步骤 1: 前置条件 - 打开文件管理器，进入"最近使用"栏目
        console.log("=== 步骤1：打开文件管理器，进入最近使用栏目 ===");
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的最近使用");
        console.log("✅ 已进入最近使用栏目");

        // 步骤 2: 创建测试文件并打开以生成最近使用记录
        console.log("=== 步骤2：创建测试文件并打开 ===");
        // 切换到桌面创建文件
        await agent.aiTap("文件管理器左侧的桌面");
        await agent.aiRightClick("空白区域");
        await agent.aiHover("新建文档");
        await agent.aiTap("文本文档");
        await device.typeText('test00', false);
        await agent.aiTap("桌面空白处");
        await agent.aiAssert("桌面存在test00.txt文件");
        console.log("✅ 测试文件已在桌面创建");
        await agent.aiTap("桌面空白处");

        // 打开文件以生成最近使用记录
        await agent.aiDoubleClick("test00.txt");
        console.log("✅ 文件已打开，生成最近使用记录");
        // 关闭文件窗口，回到文件管理器
        await agent.aiTap("点击右上角的关闭按钮");
        await uos.openApp('文件管理器', { maximizeWindow: true });

        // 步骤 3: 进入最近使用栏目，验证文件存在
        console.log("=== 步骤3：验证文件出现在最近使用中 ===");
        await agent.aiTap("文件管理器左侧的最近使用");
        await agent.aiAssert("最近使用中存在test00.txt");
        console.log("✅ 文件已出现在最近使用列表中");

        // 步骤 4: 选中文件，右键点击"属性"
        console.log("=== 步骤4：选中文件，右键移除 ===");
        // 选中文件
        await agent.aiAction("选中test00.txt");
        console.log("✅ 文件已选中");
        // 右键点击
        await agent.aiRightClick("选中的test00.txt");
        console.log("✅ 右键菜单已显示");
        // 点击"属性"选项
        await agent.aiTap("属性");

        // 步骤 5: 验证最近使用记录中文件移除情况
        await agent.aiAssert("显示test00.txt基本信息页面");
        console.log("✅ 显示属性页面");

        console.log("===1806327-[050]最近使用文件右键-多个不同类文件右键-属性,执行成功===");

    }, { timeout: 600000, tags: ["1806327", "level3", "recently_used", "liyan"] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        // 清理创建的测试文件和快捷方式
        await system.exec('test -f ~/Desktop/test00.txt && rm -f ~/Desktop/test00.txt', 500);
        // 显示桌面
        await uos.showDesktop();
    });
});