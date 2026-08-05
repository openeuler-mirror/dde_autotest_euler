/**
 * 用例 PMSID: 1806357
 * 用例标题: 最近使用，点击顶部工具栏的【详情视图】
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806357-最近使用，点击顶部工具栏的【详情视图】', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('test -f ~/Desktop/recent_file_1.txt && rm -f ~/Desktop/recent_file*', 500);
  });

  test('1806357-最近使用，点击顶部工具栏的【详情视图】', async ({ device, agent, uos, system }) => {

    // 步骤1: 创建测试文件并生成最近使用记录
    console.log("=== 步骤1：创建测试文件并生成最近使用记录 ===");

    // 创建第一个测试文件
    await agent.aiRightClick("桌面任意空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('recent_file_1', false);
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("桌面存在recent_file_1.txt文件");
    // 打开文件生成最近使用记录
    await agent.aiDoubleClick("recent_file_1.txt");
    console.log("✅ 第一个文件已打开，生成最近使用记录");
    await agent.aiTap("窗口右上角关闭按钮:X");

    // 步骤2: 打开文件管理器，进入最近使用目录
    console.log("=== 步骤2：打开文件管理器，进入最近使用目录 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    await agent.aiAssert("最近使用中存在recent_file_1.txt文件");
    console.log("✅ 已进入最近使用目录，测试文件记录存在");

    // 步骤3: 点击顶部工具栏右侧的【视图选项】
    console.log("=== 步骤3：点击顶部工具栏右侧的视图选项 ===");
    await agent.aiTap("顶部工具栏右侧的第四个按钮视图选项");
    await agent.aiAssert("视图选项显示预览已弹出");
    console.log("✅ 视图选项显示预览已弹出");

    console.log("===1806357-最近使用，点击顶部工具栏的【详情视图】,执行成功===");

  }, { timeout: 600000, tags: ["1806357", "level3", "recently_used", "liyan"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 清理创建的测试文件
    await system.exec('test -f ~/Desktop/recent_file_1.txt && rm -f ~/Desktop/recent_file*', 500);
    // 显示桌面
    await uos.showDesktop();
  });
});