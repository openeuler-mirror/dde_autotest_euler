/**
 * 用例 PMSID: 1806297
 * 用例标题:  [057]最近使用文件右键-多个同类文件右键
 * 生成时间: 2025-12-23
 * 用例编写人: UT001774(李炎)
 */

describe('1806297-[057]最近使用文件右键-多个同类文件右键', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });


    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806297-[057]最近使用文件右键-多个同类文件右键', async ({ device, agent, uos, system }) => {

        // 清理已存在的测试文件
        await system.exec('test -f ~/Desktop/context_menu_test.txt && rm -f ~/Desktop/context_menu_test.txt', 500);

        // 创建测试文件并打开以生成最近使用记录
        console.log("=== 步骤1：创建测试文件并打开 ===");
        await agent.aiRightClick("桌面任意空白区域");
        await agent.aiHover("新建文档");
        await agent.aiTap("文本文档");
        await device.typeText('context_menu_test', false);
        await agent.aiTap("桌面空白处");
        await agent.aiDoubleClick('context_menu_test.txt');
        console.log("文件已打开，应生成最近使用记录");
        //关闭文本窗口
        await agent.aiTap("窗口右上角关闭按钮:X");
        // 前置条件：进入最近使用栏目，验证文件存在
        console.log("=== 步骤1：验证文件出现在最近使用中 ===");
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的最近使用");
        await agent.aiAssert("最近使用中存在context_menu_test.txt");

        // 步骤 1: 选中文件，右键点击显示菜单
        console.log("=== 步骤：选中文件，右键显示菜单 ===");
        // 选中文件
        await agent.aiAction("选中context_menu_test.txt");
        console.log("文件已选中");
        // 右键点击
        await agent.aiRightClick("选中的context_menu_test.txt");
        console.log("✅ 右键菜单已显示");
        // 验证右键菜单所有选项
        console.log("=== 步骤5：验证右键菜单所有选项 ===");
        await agent.aiAssert("右键菜单中存在打开(O), 打开文件所在位置, 打开方式, 复制(C), 移除, 反选, 发送到, 标记信息, 病毒查杀, 属性(R)");

        // 步骤 2: 测试"打开"功能
        console.log("=== 步骤6：测试打开功能 ===");
        // 点击打开
        await agent.aiTap("打开");
        console.log("✅ 点击打开后，文件已成功打开");
        await agent.aiAssert("文件被打开");
        console.log("=== 1806297用例：最近使用文件右键-多个同类文件右键，执行完成 ===");

    }, { timeout: 600000, tags: ["1806297", "level3", "recently_used", "liyan"]});

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        //关闭所有文管窗口
        await system.exec('killall dde-file-manager', 500);
        // 清理创建的测试文件
        await system.exec('test -f ~/Desktop/context_menu_test.txt && rm -f ~/Desktop/context_menu_test.txt', 500);

    });
});