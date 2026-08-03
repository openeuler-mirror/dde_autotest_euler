/**
 * 用例 PMSID: 1806299
 * 用例标题:  [058]最近使用文件右键-多个同类文件右键-打开文件所在位置
 * 生成时间: 2025-12-23
 * 用例编写人: UT001774(李炎)
 */

describe('1806299-[058]最近使用文件右键-多个同类文件右键-打开文件所在位置', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await uos.showDesktop();
    });


    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806299-[058]最近使用文件右键-多个同类文件右键-打开文件所在位置', async ({ device, agent, uos, system }) => {

        // 清理已存在的测试文件
        await system.exec('test -f ~/Desktop/open_location_test.txt && rm -f ~/Desktop/open_location_test.txt', 500);

        // 步骤 1: 前置条件 - 打开文件管理，进入"最近使用"栏目
        console.log("=== 步骤1：前置条件 - 打开文件管理，进入最近使用栏目 ===");
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的最近使用");
        console.log("✅ 已进入最近使用栏目");

        // 步骤 2: 在桌面创建测试文件并打开
        console.log("=== 步骤2：在桌面创建测试文件并打开 ===");
        // 切换到桌面
        await agent.aiTap("文件管理器左侧的桌面");
        await agent.aiRightClick("空白区域");
        await agent.aiHover("新建文档");
        await agent.aiTap("文本文档");
        await device.typeText('open_location_test', false);
        await agent.aiTap("桌面空白处");
        await agent.aiAssert("桌面存在open_location_test.txt文件");
        console.log("✅ 测试文件已在桌面创建");

        // 打开文件以生成最近使用记录
        await agent.aiDoubleClick("open_location_test.txt");
        console.log("✅ 文件已打开，生成最近使用记录");
        // 关闭文件窗口
        await agent.aiTap("点击文件管理器右上角的关闭按钮");

        // 步骤 3: 进入最近使用栏目，验证文件存在
        console.log("=== 步骤3：验证文件出现在最近使用中 ===");
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的最近使用");
        await agent.aiAssert("最近使用中存在open_location_test.txt");

        // 步骤 4: 选中文件，右键点击打开文件所在位置
        console.log("=== 步骤4：选中文件，右键打开文件所在位置 ===");
        // 选中文件
        await agent.aiAction("选中open_location_test.txt");
        console.log("✅ 文件已选中");
        // 右键点击
        await agent.aiRightClick("选中的open_location_test.txt");
        console.log("✅ 右键菜单已显示");
        // 点击打开文件所在位置
        await agent.aiTap("打开文件所在位置");
        console.log("✅ 已点击打开文件所在位置");

        // 步骤 5: 验证源文件所在目录被打开
        console.log("=== 步骤5：验证源文件所在目录被打开 ===");
        // 验证当前位置是桌面
        await agent.aiAssert("当前位置是桌面");
        console.log("✅ 文件所在位置已打开，当前位置是桌面");
        // 验证源文件在打开的目录中可见
        await agent.aiAssert("桌面存在open_location_test.txt");
        console.log("✅ 源文件在打开的目录中可见");

        console.log("===1806299用例：最近使用文件右键-多个同类文件右键-打开文件所在位置,执行成功 ===");

    }, { timeout: 600000, tags: ["1806299", "level3", "recently_used", "liyan"] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //关闭所有文管窗口
        await system.exec('killall dde-file-manager', 500);
        // 清理创建的测试文件
        await system.exec('test -f ~/Desktop/open_location_test.txt && rm -f ~/Desktop/open_location_test.txt', 500);
    });
});