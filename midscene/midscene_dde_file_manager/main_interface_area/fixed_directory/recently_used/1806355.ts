/**
 * 用例 PMSID: 1806355
 * 用例标题: 最近使用-默认视图
 * 生成时间: 2025-12-24
 * 用例编写人: UT001774(李炎)
 */

describe('1806355-最近使用-默认视图', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });


  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');


  });

  test('1806355-最近使用-默认视图', async ({ device, agent, uos, system }) => {

    // 步骤1: 打开文件管理器,从侧边栏进入最近使用目录，验证默认视图是列表视图
    console.log("=== 打开文件管理器 ===");
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiAssert("文件管理器窗口已打开");
    console.log("✅ 文件管理器已打开");
    console.log("=== 步骤1：验证最近使用目录默认视图 ===");
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    await agent.aiAssert("最近使用目录当前为列表视图");
    console.log("✅ 最近使用目录默认视图是列表视图");

    // 步骤2: 从侧边栏进入桌面目录，验证默认视图
    console.log("=== 步骤2：验证桌面目录默认视图 ===");
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiAssert("已切换到桌面目录");
    await agent.aiAssert("桌面目录当前为图标视图");
    console.log("✅ 桌面目录默认视图是图标视图");

    // 步骤: 从侧边栏进入下载目录，验证默认视图是列表视图
    console.log("=== 步骤4：验证下载目录默认视图 ===");
    await agent.aiTap("文件管理器左侧的下载");
    await agent.aiAssert("已切换到下载目录");
    await agent.aiAssert("下载目录当前为列表视图");
    console.log("✅ 下载目录默认视图是列表视图");

    console.log("===1806355-最近使用-默认视图,执行成功===");

  }, { timeout: 600000, tags: ["1806355", "level3", "recently_used", "liyan"] });

  afterEach(async ({ agent, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("窗口右上角关闭按钮:X");
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