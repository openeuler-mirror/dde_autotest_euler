/**
 * 用例 PMSID: 1806335
 * 用例标题:  [066]最近使用搜索-搜索
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806335-[066]最近使用搜索-搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });


  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -f ~/Desktop/searchfile*', 500);
  });

  test('1806335-[066]最近使用搜索-搜索', async ({ device, agent, uos, system }) => {

    // 步骤1: 创建测试文件并打开以生成最近使用记录
    console.log("=== 步骤1：创建测试文件并生成最近使用记录 ===");
    await system.exec('touch ~/Desktop/searchfile.txt', 500);
    await agent.aiAssert("桌面存在searchfile.txt文件");

    // 打开文件以生成最近使用记录
    await agent.aiDoubleClick("searchfile.txt");
    console.log("✅ 文件已打开，生成最近使用记录");
    // 关闭文本窗口
    await agent.aiTap("窗口右上角关闭按钮:X");

    // 步骤2: 打开文件管理器，切换到最近使用栏目
    console.log("=== 步骤2：打开文件管理器，切换到最近使用栏目 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("最近使用中存在searchfile.txt文件");
    console.log("✅ 已进入最近使用栏目，文件存在");

    // 步骤3: 搜索文件关键字"search"
    console.log("=== 步骤3：搜索关键字'search' ===");
    await agent.aiTap("右上角有放大镜的输入框");
    await agent.aiInput('search', "右上角有放大镜的输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果有searchfile.txt文件");
    console.log("✅ 搜索关键字'search'成功，文件出现在搜索结果中");

    // 步骤4: 修改为存在关键字的文件名，重新搜索
    console.log("=== 步骤4：修改为存在关键字的文件名，重新搜索 ===");
    // 清空搜索框
    await agent.aiTap("右上角有放大镜的输入框");
    await device.pressKey("Control", "A"); // Ctrl+A全选
    await device.pressKey("Backspace"); // 删除内容
    // 搜索完整文件名
    await agent.aiInput('short_file.txt', "右上角有放大镜的输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果没有searchfile.txt文件");
    console.log("✅ 搜索结果没有searchfile.txt文件");

    // 步骤5: 修改为不存在关键字的文件名，重新搜索
    console.log("=== 步骤5：修改为不存在关键字的文件名，重新搜索 ===");
    // 清空搜索框
    await agent.aiTap("右上角有放大镜的输入框");
    await device.pressKey("Control", "A"); // Ctrl+A全选
    await device.pressKey("Backspace"); // 删除内容
    // 搜索不存在的文件名
    await agent.aiInput('nonexistent.txt', "右上角有放大镜的输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果没有searchfile.txt文件");
    console.log("✅ 搜索结果没有searchfile.txt文件");

    console.log("===1806335-[066]最近使用搜索-搜索,执行成功===");

  }, { timeout: 600000, tags: ["1806335", "level3", "recently_used", "liyan"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -f ~/Desktop/searchfile*', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);

    // 显示桌面
    await uos.showDesktop();
  });
});