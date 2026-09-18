/**
 * 用例 PMSID: 1808649
 * 用例标题:  【工作区视图插件显示隐藏】文管设置，高级设置-对话框-开启普通删除提示
 * 生成时间: 2026-01-13 15:00:00
 * 用例编写人:  UT001774(李炎)
 */

describe('1808649-【工作区视图插件显示隐藏】文管设置，高级设置-对话框-开启普通删除提示', () => {
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

  test('1808649-【工作区视图插件显示隐藏】文管设置，高级设置-对话框-开启普通删除提示', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：1808649-【工作区视图插件显示隐藏】文管设置，高级设置-对话框-开启普通删除提示 ===');

    // 步骤1: 打开文件管理器
    console.log('步骤1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');
    // 打开设置菜单
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("高级设置", { deepThink: true });
    await agent.aiScroll("高级设置", { direction: 'down', distance: 10 });
    await agent.aiTap("对话框", { deepThink: true });
    console.log('✅ 已进入对话框设置页面');
    // 检查设置项："开启普通删除提示"，默认未勾选
    console.log('步骤3:检查设置项："开启普通删除提示"，默认未勾选');
    await agent.aiAssert("开启普通删除提示文字左侧没有蓝色√");
    console.log('✅ 选项默认未勾选');

    //步骤2:勾选"开启普通删除提示"，文管和桌面，快捷键/右键菜单删除文件，检查是否弹出确认框
    await agent.aiTap("开启普通删除提示文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("开启普通删除提示文字左侧有蓝色√");
    // 关闭设置窗口
    console.log('步骤4: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    // 切换到桌面创建文件，删除文件
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiRightClick("空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('test_file', false);
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("桌面存在test_file.txt文件");
    await agent.aiRightClick("test_file.txt");
    await agent.aiTap("删除");
    // 验证是否弹出确认框
    await agent.aiAssert("弹出是否普通删除的确认框");
    console.log('✅ 文件管理器右键菜单删除确认框验证通过');

    console.log('✅ 1808649用例测试完成');

  }, { timeout: 600000, tags: ["1808649", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.cleanupFileManager();
    // 清理创建的文件和文件夹
    await system.exec('rm -f ~/Desktop/test_file.txt', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});