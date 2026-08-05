/**
 * 用例 PMSID: 1806339
 * 用例标题: 访问数据盘/系统盘文件，使用右键-【移除】或delete从最近使用移除该文件
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806339-访问数据盘/系统盘文件，使用右键-【移除】或delete从最近使用移除该文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });


  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('test -f ~/Desktop/data_disk_test.txt && rm -f ~/Desktop/data_disk_test*', 500);
  });


  test('1806339-访问数据盘/系统盘文件，使用右键-【移除】或delete从最近使用移除该文件', async ({ device, agent, uos, system }) => {

    // 第一部分：数据盘文件测试
    console.log("=== 第一部分：数据盘文件测试 ===");
    // 步骤1: 创建数据盘测试文件并打开以生成最近使用记录
    console.log("=== 步骤1：创建数据盘测试文件并生成最近使用记录 ===");
    await system.exec('touch ~/Desktop/data_disk_test.txt');
    await agent.aiAssert("桌面存在data_disk_test.txt文件");
    // 打开文件以生成最近使用记录
    await agent.aiDoubleClick("data_disk_test.txt");
    console.log("✅ 数据盘文件已打开，生成最近使用记录");
    // 关闭文本窗口
    await agent.aiTap("窗口右上角关闭按钮:X");

    // 步骤2: 打开文件管理器，切换到最近使用栏目验证文件存在
    console.log("=== 步骤2：验证数据盘文件出现在最近使用中 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("最近使用中存在data_disk_test.txt文件");
    console.log("✅ 数据盘文件已出现在最近使用列表中");

    // 步骤3: 使用右键移除数据盘文件
    console.log("=== 步骤3：使用右键移除数据盘文件 ===");
    // 选中文件
    await agent.aiAction("选中data_disk_test.txt");
    console.log("✅ 数据盘文件已选中");
    // 右键点击
    await agent.aiRightClick("选中的data_disk_test.txt");
    console.log("✅ 右键菜单已显示");
    // 点击"移除"选项
    await agent.aiTap("移除");
    await agent.aiTap("弹框右下角移除");
    console.log("✅ 数据盘文件已通过右键移除");

    // 步骤4: 验证数据盘文件记录被移除
    await agent.aiAssert("最近使用中不存在data_disk_test.txt");
    console.log("✅ 数据盘文件记录已从最近使用中移除");

    // 步骤5: 重新访问数据盘文件，验证重新添加
    console.log("=== 步骤5：重新访问数据盘文件，验证重新添加 ===");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiDoubleClick("data_disk_test.txt");
    console.log("✅ 数据盘文件重新打开");
    await agent.aiTap("窗口右上角关闭按钮:X");
    // 回到最近使用栏目验证文件重新出现
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("最近使用中存在data_disk_test.txt文件");
    console.log("✅ 数据盘文件重新出现在最近使用中");

    // 第二部分：系统盘文件测试
    console.log("=== 第二部分：系统盘文件测试 ===");

    // 步骤6: 创建系统盘测试文件并打开以生成最近使用记录
    console.log("=== 步骤6：访问系统盘测试文件并生成最近使用记录 ===");
    await agent.aiTap("文件管理器左侧的系统盘");
    await agent.aiDoubleClick("var文件夹");
    await agent.aiDoubleClick("log文件夹");
    await agent.aiDoubleClick("boot.log");
    console.log("✅ 系统盘文件已打开，生成最近使用记录");
    await agent.aiTap("窗口右上角关闭按钮:X");

    // 步骤7: 验证系统盘文件出现在最近使用中
    console.log("=== 步骤8：验证系统盘文件出现在最近使用中 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("最近使用中存在boot.log文件");
    console.log("✅ 系统盘文件已出现在最近使用列表中");

    // 步骤8: 使用右键移除系统盘文件
    console.log("=== 步骤8：使用右键移除系统盘文件 ===");
    await agent.aiAction("选中boot.log");
    await agent.aiRightClick("选中的boot.log");
    await agent.aiTap("移除");
    await agent.aiTap("弹框右下角移除");
    console.log("✅ 系统盘文件已通过右键移除");
    await agent.aiAssert("最近使用中不存在boot.log");
    console.log("✅ 系统盘文件记录已从最近使用中移除");


    console.log("===1806339-访问数据盘/系统盘文件，使用右键-【移除】或delete从最近使用移除该文件,执行成功===");

  }, { timeout: 600000, tags: ["1806339", "level3", "recently_used", "liyan"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -rf ~/Desktop/data_disk_test*');
    await system.cleanupFileManager();
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