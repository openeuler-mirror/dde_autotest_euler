// @ts-nocheck

/**
 * 用例 PMSID: 1809287
 * 用例标题: 【支持视图模式应用到所有目录】- 检查文管设置菜单，新增选项"所有目录恢复默认视图"
 * 生成时间: 2026-04-10
 * 用例编写人: UT000686(李双双)
 */

describe('1809287-【支持视图模式应用到所有目录】- 检查文管设置菜单，新增选项"所有目录恢复默认视图"', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1809287-【支持视图模式应用到所有目录】- 检查文管设置菜单，新增选项"所有目录恢复默认视图"', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1809287-检查文管设置菜单，新增选项"所有目录恢复默认视图" ===');

    // 步骤1：打开文件管理器，点击右上角的主菜单
    console.log('步骤1: 打开文件管理器，点击右上角的主菜单');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiWaitFor("文件管理器主界面已显示");
    await agent.aiTap("文件管理器右上角有3条横线的主菜单图标", { deepThink: true });
    console.log('✅ 主菜单已打开');

    // 步骤2：点击设置，等待设置页面加载完成
    console.log('步骤2: 点击设置，等待设置页面加载完成');
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiWaitFor("设置页面已加载完成");
    console.log('✅ 设置页面已打开');

    // 步骤3：点击设置弹框中的视图
    console.log('步骤3: 点击设置弹框中的视图');
    await agent.aiTap("设置页面左侧的视图选项", { deepThink: true });
    await agent.aiWaitFor("视图设置页面已显示");
    console.log('✅ 视图设置页面已显示');

    // 断言：检查视图设置页面存在"所有目录恢复默认视图"文案
    console.log('断言: 验证存在"所有目录恢复默认视图"文案');
    await agent.aiAssert('视图设置页面中存在"所有目录恢复默认视图"文案');
    console.log('✅ 验证通过：视图设置页面存在"所有目录恢复默认视图"文案');

    console.log('✅ 1809287用例测试完成');

  }, { timeout: 600000, tags: ["1809287", "level2", "menu",  'DITT',"lishuangshuang"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
