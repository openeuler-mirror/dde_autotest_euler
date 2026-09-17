/**
 * 用例 PMSID: 1808609
 * 用例标题:  1808609-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-分区-内置磁盘
 * 生成时间: 2026-01-13 17:00:00
 * 用例编写人:  UT001774(李炎)
 */

describe('1808609-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-分区-内置磁盘', () => {
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

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文管默认设置
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("高级设置", { deepThink: true });
    await agent.aiScroll("高级设置", { direction: 'down', distance: 10 });
    await agent.aiTap("文件投送", { deepThink: true });
    await agent.aiTap("恢复默认");
    await agent.aiTap("恢复默认");
    console.log('文件管理恢复默认设置');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager', 500);
  });

  test('1808609-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-分区-内置磁盘', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：1808609-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-分区-内置磁盘 ===');

    // 步骤1: 打开文件管理器
    console.log('步骤1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');
    // 打开设置菜单
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("侧边栏", { deepThink: true });
    await agent.aiTap("侧边栏显示项目", { deepThink: true });
    await agent.aiScroll("侧边栏显示项目界面", { direction: 'down', distance: 5 });
    // 侧边栏显示项目-分区，设置项："内置磁盘"，默认值:已勾选
    console.log('检查设置项："内置磁盘"，默认值:已勾选');
    await agent.aiAssert("内置磁盘左侧有蓝色√");
    console.log('✅ 设置项："内置磁盘"默认已勾选');

    //步骤2:取消勾选"内置磁盘"
    await agent.aiTap("取消勾选内置磁盘", { deepThink: true });
    await agent.aiAssert("内置磁盘左侧没有蓝色√");
    // 关闭设置窗口
    console.log('步骤4: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    await agent.aiTap("文件管理器左侧的计算机");
    // 检查文管侧边栏是否显示
    await agent.aiAssert("文件管理器侧边栏系统盘和数据盘不显示");
    console.log('✅ 侧边栏"内置磁盘"系统盘和数据盘已隐藏');

    console.log('✅ 1808609用例测试完成');

  }, { timeout: 600000, tags: ["1808609", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //恢复文管默认设置
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("高级设置", { deepThink: true });
    await agent.aiScroll("高级设置", { direction: 'down', distance: 10 });
    await agent.aiTap("文件投送", { deepThink: true });
    await agent.aiTap("恢复默认");
    await agent.aiTap("恢复默认");
    console.log('文件管理恢复默认设置');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
















