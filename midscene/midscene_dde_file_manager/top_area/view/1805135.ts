/**
 * 用例 PMSID: 1805135
 * 用例标题: [181][core]文件和文件夹混合排序-文管设置-视图【文件和文件夹混合排序】功能_
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805135-[181][core]文件和文件夹混合排序-文管设置-视图【文件和文件夹混合排序】功能_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1805135-[181][core]文件和文件夹混合排序-文管设置-视图【文件和文件夹混合排序】功能_', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");

    // 步骤2：设置文件和文件夹混合排序
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置选项");
    await agent.aiTap("文件和目录选项");
    await agent.aiAssert('文件和文件夹混合排序默认没有勾选');
    await system.exec("sleep 2");
    await agent.aiTap("文件和文件夹混合排序");
    await agent.aiAssert('文件和文件夹混合排序被勾选');
    await agent.aiTap("设置页面右上角关闭按钮");

    //步骤3：再次打开设置，检查文件和文件夹混合排序
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置选项");
    await agent.aiTap("文件和目录选项");
    await agent.aiAssert('文件和文件夹混合排序被勾选');
    await system.exec("sleep 2");
    await agent.aiTap("文件和文件夹混合排序");
    await agent.aiAssert('文件和文件夹混合排序没有勾选');
    await agent.aiTap("设置页面右上角关闭按钮");
    
  }, { timeout: 1800000, tags: ["1805135", "level2", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
