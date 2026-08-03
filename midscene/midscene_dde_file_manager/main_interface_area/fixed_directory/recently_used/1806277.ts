/**
 * 用例 PMSID: 1806277
 * 用例标题:  [t]最近使用目录右键-空白页右键_
 * 生成时间: 2025-12-23
 * 用例编写人: UT001774(李炎)
 */

describe('1806277-[t]最近使用目录右键-空白页右键_', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理已存在的测试文件
    await system.exec('rm -rf ~/Desktop/1806277.txt', 500);
  });

  test('1806277-[t]最近使用目录右键-空白页右键_', async ({ device, agent, uos, system }) => {


    // 前置条件：打开文件管理，进入"最近使用"栏目
    await system.exec('touch ~/Desktop/1806277.txt', 500);
    console.log("=== 步骤1：打开文件管理，进入最近使用栏目 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    console.log("✅ 已进入最近使用栏目");

    // 步骤 1: 在空白处右键点击，查看菜单
    console.log("=== 步骤2：在空白处右键点击查看菜单 ===");
    await agent.aiRightClick("空白区域");
    // 验证菜单项：显示方式，排序方式，全选
    await agent.aiAssert("右键菜单中存在显示方式，排序方式，全选");
    console.log("✅ 右键菜单包含：显示方式，排列方式，全选");

    // 步骤 2: 选择"排序方式"，查看二级菜单
    console.log("=== 步骤3：选择排序方式，查看二级菜单 ===");
    await agent.aiTap("排序方式");
    // 验证二级菜单项：名称、最近访问时间、大小、类型
    await agent.aiAssert("排序子菜单中存在名称、最近访问时间、大小、类型");
    console.log("✅ 排序子菜单包含：名称、最近访问时间、大小、类型");
    // 验证默认排序方式为"最近访问时间"
    console.log("=== 步骤4：验证默认排序方式为最近访问时间 ===");
    await agent.aiAssert("最近访问时间处于选中状态");

    // 步骤 3:创建测试文件以验证排序功能
    console.log("=== 步骤5：创建测试文件验证排序功能 ===");
    await agent.aiDoubleClick("文件管理器左侧的桌面");
    // 打开文件以生成最近使用记录
    await agent.aiDoubleClick('1806277.txt');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("最近使用中显示1806277.txt，最近访问时间显示最新");
    console.log("✅ 测试文件创建完成并生成最近使用记录");
    console.log("=== 1806277-[t]最近使用目录右键-空白页右键_,测试完成 ===");

  }, { timeout: 600000, tags: ["1806277", "level3", "recently_used", "liyan"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager', 500);
    // 清理创建的测试文件
    await system.exec('rm -rf ~/Desktop/1806277.txt', 500);
    await uos.showDesktop();
  });
});