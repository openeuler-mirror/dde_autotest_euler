/**
 * 用例 PMSID: 1806347
 * 用例标题:  侧边栏最近使用，添加记录，访问桌面
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806347-侧边栏最近使用，添加记录，访问桌面', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -f ~/Desktop/test*', 500);
  });

  test('1806347-侧边栏最近使用，添加记录，访问桌面', async ({ device, agent, uos, system }) => {

    // 前置条件: 创建测试文件
    console.log("=== 步骤1：在桌面创建测试文件 ===");
    await system.exec('touch ~/Desktop/test006.txt', 500);
    await agent.aiAssert("桌面存在test006.txt文件");

    // 步骤1: 桌面双击访问文件，文件被打开
    console.log("=== 步骤2：桌面双击访问文件 ===");
    await agent.aiDoubleClick("test006.txt");
    await agent.aiAssert("文件编辑器窗口已打开");
    console.log("✅ 文件已通过双击打开");
    // 关闭文件窗口
    console.log("=== 步骤3：关闭文件窗口 ===");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await agent.aiAssert("文件编辑器窗口已关闭");
    console.log("✅ 文件窗口已关闭");

    // 步骤2: 打开文件管理器，侧边栏单击最近使用
    console.log("=== 步骤4：打开文件管理器 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiAssert("文件管理器窗口已打开");
    console.log("✅ 文件管理器已打开");
    console.log("=== 步骤5：切换到最近使用栏目 ===");
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    console.log("✅ 已进入最近使用栏目");
    // 检查右侧内容，验证最近使用目录显示访问的文件记录
    console.log("=== 步骤6：验证最近使用记录 ===");
    await agent.aiAssert("最近使用目录显示test006.txt文件记录");
    console.log("✅ 最近使用目录正确显示访问的文件记录");

    console.log("===1806347-[基础功能]桌面双击访问文件-最近使用记录验证,执行成功===");

  }, { timeout: 600000, tags: ["1806347", "level1", "recently_used", "liyan"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -f ~/Desktop/test*', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});