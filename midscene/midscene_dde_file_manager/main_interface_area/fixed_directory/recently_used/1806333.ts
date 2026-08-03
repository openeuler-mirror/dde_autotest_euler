/**
 * 用例 PMSID: 1806333
 * 用例标题:  [t]最近使用快捷键检查_
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806333-[t]最近使用快捷键检查_', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });


  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('test -f ~/Desktop/file1.txt && rm -f ~/Desktop/file*', 500);
  });

  test('1806333-[t]最近使用快捷键检查_', async ({ device, agent, uos, system }) => {

    // 前置条件: 创建测试文件1和2
    await system.exec('touch ~/Desktop/file1.txt', 500);
    await system.exec('touch ~/Desktop/file2.txt', 500);
    await agent.aiAssert("桌面存在file1.txt和file2.txt文件");
    // 打开文件以生成最近使用记录
    await agent.aiDoubleClick("file1.txt");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await agent.aiDoubleClick("file2.txt");
    console.log("✅ 文件已打开，生成最近使用记录");
    await agent.aiTap("窗口右上角关闭按钮:X");
    // 进入最近使用栏目，验证文件存在
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("最近使用中存在file1.txt文件和file2.txt");

    // 步骤1: 测试Enter键打开文件功能、Ctrl+C复制文件
    await agent.aiTap("file1.txt文件");
    await device.pressKey('Enter');
    await agent.aiAssert("文件编辑器窗口已打开");
    console.log("Enter键功能正常：文件成功打开");
    // 关闭文件编辑器
    await agent.aiTap("文件编辑器窗口右上角关闭按钮:X");
    // 测试Ctrl+C复制文件功能
    await agent.aiTap("file1.txt文件");
    await device.pressKey("Ctrl+C"); // Ctrl+C复制
    console.log("Ctrl+C功能正常：文件已复制到剪切板");
    //  测试Ctrl+V粘贴文件功能
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiTap("空白区域");
    await device.pressKey("Ctrl+V"); // Ctrl+V粘贴
    await agent.aiAssert("桌面存在file1（副本）.txt");
    console.log("Ctrl+V功能正常：文件成功粘贴");

    // 步骤2: 验证最近使用目录下不支持Ctrl+X剪切
    console.log("=== 步骤5：验证文件出现在最近使用中 ===");
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiTap("file2.txt文件");
    await device.pressKey("Ctrl+X");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiTap("空白区域");
    await device.pressKey("Ctrl+V");
    await agent.aiAssert("桌面新增的文件非file2（副本）.txt文件");

    console.log("===1806333-[t]最近使用快捷键检查_,执行成功===");

  }, { timeout: 600000, tags: ["1806333", "level3", "recently_used", "liyan"] });

  afterEach(async ({ agent, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 清理创建的测试文件和快捷方式
    await system.exec('test -f ~/Desktop/file1.txt && rm -f ~/Desktop/file*', 500);
    // 显示桌面
    await uos.showDesktop();
  });
});