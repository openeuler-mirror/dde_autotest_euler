/**
 * 用例 PMSID: 1812225
 * 用例标题: 长文件名功能-最近使用
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1812225-长文件名功能-最近使用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('test -f ~/Desktop/this_is_a_very_long_file_name_with_multiple_words.txt && rm -f ~/Desktop/this_is_a_very_long_file_name_with_multiple_words*', 500);
    // 已开启长文件名功能
    const caseDir = process.env.TESTCASE_DIR;
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
  });

  test('1812225-长文件名功能-最近使用', async ({ device, agent, uos, system }) => {

    // 前置条件: 创建长文件名测试文件
    console.log("=== 步骤1：创建长文件名测试文件 ===");
    // 创建长文件名文件
    await system.exec('touch ~/Desktop/this_is_a_very_long_file_name_with_multiple_words.txt', 500);
    await agent.aiAssert("桌面存在this_is_a_…ords.txt文件或this_is_a_very_long_file_name_with_multiple_words.txt文件");
    console.log("✅ 长文件名文件已创建");
    // 访问长文件名文件，生成最近使用记录
    console.log("=== 步骤2：访问文件生成最近使用记录 ===");
    // 访问长文件名文件
    try {
      await agent.aiDoubleClick("this_is_a_very_long_file_name_with_multiple_words.txt");
    } catch {
      await agent.aiDoubleClick("this_is_a_…ords.txt");
    }
    console.log("✅ 长文件名文件已访问");
    try {
      await agent.aiTap("窗口右上角关闭按钮:X");
    } catch {
      console.log("无需操作");
    }

    // 步骤1: 文管侧边栏单击"最近使用"，检查长文件名的显示
    console.log("=== 步骤3：进入最近使用目录 ===");
    await uos.openApp('文件管理器', { maximizeWindow: false });
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    console.log("✅ 已进入最近使用目录");
    // 检查长文件名的显示方式
    console.log("=== 步骤4：验证长文件名显示方式 ===");
    //检查文管窗口是否最大化
    try {
      await agent.aiAssert("this_is_a_very_long_file_name_with_multiple_words.txt的名称列完整显示");
      await agent.aiTap("文件管理器右上角的口图标");
    } catch {
      console.log("无需操作");
    }
    // 验证非最大化窗口下，长文件名显示为部分名称，以···.txt结尾
    await agent.aiAssert("this_is_a_very_long_file_name_with_multiple_words.txt显示部分名称，以···或···.txt结尾");
    console.log("✅ 长文件名显示正确：显示部分名称，以···.txt结尾");

    console.log("===1812225-长文件名功能-最近使用,执行成功===");

  }, { timeout: 600000, tags: ["1812225", "level2", "remote", "recently_used", "liyan"] });

  afterEach(async ({ agent, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 清理创建的测试文件
    await system.exec('test -f ~/Desktop/this_is_a_very_long_file_name_with_multiple_words.txt && rm -f ~/Desktop/this_is_a_very_long_file_name_with_multiple_words*', 500);
    // 显示桌面
    await uos.showDesktop();
  });
});