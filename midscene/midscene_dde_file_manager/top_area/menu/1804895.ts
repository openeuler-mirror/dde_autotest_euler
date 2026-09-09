
/**
 * 用例 PMSID: 1804895
 * 用例标题: 设置“隐藏系统盘”选项文案调整
 * 生成时间: 2026-01-07 15:20:00
 * 用例编写人: UT001774(李炎)
 */

describe('1804895- 设置“隐藏系统盘”选项文案调整', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804895- 设置“隐藏系统盘”选项文案调整', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：计算机工作区隐藏内置磁盘功能 ===');

    // 步骤1: 打开文件管理器并验证初始状态
    console.log('步骤1: 打开文件管理器，验证初始状态');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("屏幕中间有系统盘和数据盘文字");
    console.log('✅ 初始状态：内置磁盘正常显示');

    // 步骤2: 打开设置菜单
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("当前窗口有打开行为、新窗口、新标签等");

    // 步骤3: 滚动到计算机显示项目
    console.log('步骤3: 定位计算机显示项目设置');
    await agent.aiScroll('基础设置', { direction: 'down', distance: 5 });
    await agent.aiAssert("当前窗口有侧边栏显示项目、视图、缩略图预览、计算机显示项目、搜索、挂载、外部存储设备、对话框、文件投送、文件粉碎文字");

    // 步骤4: 进入计算机显示项目设置
    console.log('步骤4: 进入计算机显示项目设置');
    await agent.aiTap("计算机显示项目", { deepThink: true });
    await agent.aiAssert("界面显示计算机工作区隐藏内置磁盘选项");

    // 步骤5: 验证选项初始状态（未勾选）
    console.log('步骤5: 验证选项初始状态');
    await agent.aiAssert("计算机工作区隐藏内置磁盘文字左侧没有蓝色√");
    console.log('✅ 初始状态：选项未勾选');

    // 步骤6: 勾选隐藏内置磁盘选项
    console.log('步骤6: 勾选隐藏内置磁盘选项');
    await agent.aiTap("计算机工作区隐藏内置磁盘文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("计算机工作区隐藏内置磁盘文字左侧有蓝色√");
    console.log('✅ 选项已勾选');

    // 步骤7: 关闭设置窗口并验证隐藏效果
    console.log('步骤7: 关闭设置并验证隐藏效果');
    await agent.aiTap("当前窗口关闭按钮:x");
    await agent.aiAssert("屏幕中间没有系统盘和数据盘文字");
    console.log('✅ 内置磁盘已被隐藏');

    // 步骤8: 重新打开设置验证选项状态
    console.log('步骤8: 重新打开设置验证选项状态');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiScroll('基础设置', { direction: 'down', distance: 5 });
    await agent.aiTap("计算机显示项目", { deepThink: true });
    await agent.aiAssert("计算机工作区隐藏内置磁盘文字左侧有蓝色√");
    console.log('✅ 选项状态已保存');

    // 步骤9: 取消勾选选项
    console.log('步骤9: 取消勾选选项');
    await agent.aiTap("计算机工作区隐藏内置磁盘文字左侧的蓝色√", { deepThink: true });
    await agent.aiAssert("计算机工作区隐藏内置磁盘文字左侧没有蓝色√");
    console.log('✅ 选项已取消勾选');

    // 步骤10: 关闭设置并验证显示效果
    console.log('步骤10: 关闭设置并验证显示效果');
    await agent.aiTap("当前窗口关闭按钮:x");
    await agent.aiAssert("屏幕中间有系统盘和数据盘文字");
    console.log('✅ 内置磁盘重新显示');

    // 步骤11: 最终验证
    console.log('步骤11: 最终验证功能完整性');
    await agent.aiTap("当前窗口右上角的关闭钮:x", { deepThink: true });
    console.log('✅ 1804895用例测试完成');

  }, { timeout: 600000, tags: ["1804895", "level3", "menu", "liyan"] });

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