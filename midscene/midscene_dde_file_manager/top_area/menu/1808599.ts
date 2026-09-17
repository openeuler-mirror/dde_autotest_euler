/**
 * 用例 PMSID: 1808599
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-显示文件扩展名
 * 生成时间: 2026-01-15 10:00:00
 * 用例编写人:  UT001774(李炎)
 */

describe('1808599-【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-显示文件扩展名', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    //处理可能存在的弹框和右键菜单
    await device.pressKey('Esc');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager', 500);
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -f ~/Desktop/test_file*', 500);
  });

  test('1808599-【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-显示文件扩展名', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1808599-【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-显示文件扩展名 ===');

    // 前置条件,创建test.txt,打开文件管理器
    await system.exec('touch ~/Desktop/test_file.txt', 500);
    console.log('步骤1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiTap("桌面区域空白处");
    await agent.aiAssert("桌面区域存在test_file.txt文件");

    // 步骤1:文管右上角菜单设置窗口-基础设置-文件和文件夹，检查设置项
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("文件和目录", { deepThink: true });
    // 文件和目录，设置项："显示文件扩展名"，默认值:已勾选
    console.log('检查设置项："显示文件扩展名"，默认值:已勾选');
    await agent.aiAssert("显示文件扩展名左侧有蓝色√");
    console.log('✅ 设置项："显示文件扩展名"默认已勾选');

    //步骤2:取消勾选"显示文件扩展名"，检查文件的扩展名
    await agent.aiTap("取消勾选显示文件扩展名", { deepThink: true });
    await agent.aiAssert("显示文件扩展名左侧没有蓝色√");
    // 关闭设置窗口
    console.log('步骤4: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    // 检查文件的扩展名
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiAssert("桌面存在test_file文件");
    console.log('✅ 文件的扩展名未显示');

    // 步骤3:	勾选"显示文件扩展名"后，检查文管中文件的扩展名
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("文件和目录", { deepThink: true });
    // 文件和目录，设置项："显示文件扩展名"，默认值:已勾选
    console.log('检查设置项："显示文件扩展名"，默认值:已勾选');
    await agent.aiTap("勾选显示文件扩展名左侧方框的中心", { deepThink: true });
    await agent.aiAssert("显示文件扩展名左侧有蓝色√");
    console.log('✅ 设置项："显示文件扩展名"默认已勾选');
    //检查文件的扩展名
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiAssert("桌面存在test_file.txt文件");

    console.log('✅ 1808599用例测试完成');

  }, { timeout: 600000, tags: ["1808599", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -f ~/Desktop/test_file*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});