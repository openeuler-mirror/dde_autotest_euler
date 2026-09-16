/**
 * 用例 PMSID: 1808589
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，基础设置-打开行为-总是在新窗口打开文件夹
 * 生成时间: 2026-01-13 10:18:00
 * 用例编写人: UT001774(李炎)
 */

describe('1808589-【工作区视图插件显示隐藏】文管设置，基础设置-打开行为-总是在新窗口打开文件夹', () => {
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

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808589-【工作区视图插件显示隐藏】文管设置，基础设置-打开行为-总是在新窗口打开文件夹', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：总是在新窗口打开文件夹功能 ===');

    // 步骤1: 打开文件管理器并验证初始状态
    console.log('步骤1: 打开文件管理器，验证初始状态');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');

    // 步骤2: 打开设置菜单
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    console.log('✅ 设置窗口已打开');

    // 步骤3: 定位到打开行为设置
    console.log('步骤3: 定位到打开行为设置');
    await agent.aiTap("打开行为", { deepThink: true });
    await agent.aiAssert("当前窗口有总是在新窗口打开文件夹选项");

    // 步骤4: 验证"总是在新窗口打开文件夹"选项初始状态（未勾选）
    console.log('步骤4: 验证选项初始状态');
    await agent.aiAssert("总是在新窗口打开文件夹文字左侧没有蓝色√");
    console.log('✅ 初始状态：选项未勾选');

    // 步骤5: 勾选"总是在新窗口打开文件夹"选项
    console.log('步骤5: 勾选"总是在新窗口打开文件夹"选项');
    await agent.aiTap("总是在新窗口打开文件夹文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("总是在新窗口打开文件夹文字左侧有蓝色√");
    console.log('✅ 选项已勾选');

    // 步骤6: 关闭设置窗口
    console.log('步骤6: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    // 步骤7: 验证勾选后的行为 - 在新窗口打开文件夹
    console.log('步骤7: 验证勾选后的行为 - 在新窗口打开文件夹');
    await agent.aiTap("文件管理器左侧的主目录");
    await agent.aiDoubleClick("主区域中的桌面文件夹");
    await agent.aiAssert("弹出新窗口显示桌面主界面");
    console.log('✅ 文件夹在新窗口中打开');

    // 步骤8: 关闭新窗口，回到原窗口
    console.log('步骤8: 关闭新窗口，回到原窗口');
    await agent.aiTap("当前窗口关闭按钮:x");

    // 步骤9: 重新打开设置菜单
    console.log('步骤9: 重新打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("打开行为", { deepThink: true });
    await agent.aiAssert("总是在新窗口打开文件夹文字左侧有蓝色√");
    console.log('✅ 选项状态已保存');

    // 步骤10: 取消勾选"总是在新窗口打开文件夹"选项
    console.log('步骤10: 取消勾选"总是在新窗口打开文件夹"选项');
    await agent.aiTap("总是在新窗口打开文件夹文字左侧的蓝色√", { deepThink: true });
    await agent.aiAssert("总是在新窗口打开文件夹文字左侧没有蓝色√");
    console.log('✅ 选项已取消勾选');

    // 步骤11: 关闭设置窗口
    console.log('步骤11: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    // 步骤12: 验证取消勾选后的行为 - 在当前窗口进入文件夹
    console.log('步骤12: 验证取消勾选后的行为 - 在当前窗口进入文件夹');
    await agent.aiTap("文件管理器左侧的主目录");
    await agent.aiDoubleClick("主区域中的桌面文件夹");
    // 验证没有打开新窗口
    await agent.aiAssert("当前窗口进入文件夹内部，没有打开新窗口");
    console.log('✅ 文件夹在当前窗口中打开');
    console.log('✅ 1808589用例测试完成');

  }, { timeout: 600000, tags: ["1808589", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
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