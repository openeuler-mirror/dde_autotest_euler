/**
 * 用例 PMSID:  1809283
 * 用例标题: [061]最近使用文件右键--创建链接
 * 生成时间: 2026-3-10
 * 用例编写人: UT001774(李炎)
 */

describe('1809283-[061]最近使用文件右键--创建链接', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await uos.showDesktop();
    });


    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理可能存在的测试文件
        await system.exec('rm -f ~/Desktop/1809283.txt', 500);
    });

    test('1809283-[061]最近使用文件右键--创建链接', async ({ device, agent, uos, system }) => {


        // 前置条件: 创建测试文件并打开以生成最近使用记录
        console.log("=== 步骤1：创建测试文件并生成最近使用记录 ===");
        await system.exec('touch ~/Desktop/1809283.txt', 500);
        await agent.aiAssert("桌面存在1809283.txt文件");
        // 打开文件以生成最近使用记录
        await agent.aiDoubleClick("1809283.txt");
        console.log("✅ 文件已打开，生成最近使用记录");
        // 关闭文本窗口
        await agent.aiTap("窗口右上角关闭按钮:X");
        console.log("=== 步骤2：打开文件管理器，切换到最近使用栏目 ===");
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiTap("文件管理器左侧的最近使用");
        await agent.aiAssert("最近使用中存在1809283.txt文件");

        // 步骤 1: 选中文件右键--发送到--创建连接
        console.log("=== 步骤4：选中文件右键--发送到--创建连接 ===");
        // 右键点击
        await agent.aiRightClick("1809283.txt");
        console.log("✅ 右键菜单已显示");
        // 点击"发送到"选项
        await agent.aiTap("发送到");
        // 步骤 5: 在发送到子菜单中选择创建链接
        console.log("=== 步骤5：选择创建链接 ===");
        // 点击创建链接
        await agent.aiTap("创建链接");
        console.log("✅ 已点击创建链接");

        // 步骤 6: 验证弹出文件选择对话框
        console.log("=== 步骤6：验证弹出文件选择对话框 ===");
        // 验证对话框标题或内容
        await agent.aiAssert("文件选择对话框已打开");

        console.log("=== 1809283-[061]最近使用文件右键--创建链接 ，执行成功===");

    }, { timeout: 600000, tags: ["1809283", "level2", "recently_used", "liyan"] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理可能存在的测试文件
        await system.exec('rm -f ~/Desktop/1809283.txt', 500);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});