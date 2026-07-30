/**
 * 用例 PMSID: 1655685
 * 用例标题: 日志能按格式正确导出
 * 生成时间: 2026-05-18
 * 用例编写人: UT006165（李日华）
 */

describe('1655685-日志能按格式正确导出', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655685-日志能按格式正确导出', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 选择"开关机事件"
    await agent.aiTap("开关机事件");

    // 步骤 3: 切换到"开关机事件"界面
    await agent.aiWaitFor("切换到开关机事件界面");
    await agent.aiAssert("已进入开关机事件页面");

    // ========== 导出 TEXT 格式 ==========
    // 步骤 4: 点击"导出"
    await agent.aiTap("导出按钮");

    // 步骤 5: 弹出文件管理器
    await agent.aiWaitFor("文件管理器对话框打开");
    await agent.aiAssert("文件管理器对话框已打开");

    // 步骤 6: 选择导出路径是桌面
    await agent.aiTap("桌面目录");

    // 步骤 7: 点击格式后的下拉框，弹出下拉菜单
    await agent.aiTap("格式下拉框");

    // 步骤 8: 选择TEXT（*.txt）格式
    await agent.aiTap("TEXT格式选项");

    // 步骤 9: 点击"保存"
    await agent.aiTap("保存按钮");

    // 步骤 10: 文管关闭
    await agent.aiWaitFor("文件管理器对话框关闭");

    // 步骤 11: 点击窗口右上角的"-"图标
    await agent.aiTap("最小化按钮");
    await agent.aiAssert("桌面显示开关机事件.txt文件");

    // ========== 导出 Doc 格式 ==========
    // 重新打开导出对话框
    // 点击dock上的日志收集工具图标，打开日志收集工具窗口
    await agent.aiTap("Dock上的紫蓝色图标右下角有一个圆形小闹钟的日志收集工具图标");
    await agent.aiTap("导出按钮");
    await agent.aiWaitFor("文件管理器对话框打开");

    // 选择桌面路径
    //await agent.aiTap("桌面目录");

    // 选择Doc格式
    await agent.aiTap("格式下拉框");
    await agent.aiTap("Doc格式选项");

    // 保存
    await agent.aiTap("保存按钮");
    await agent.aiWaitFor("文件管理器对话框关闭");

    // 验证文件,点击窗口右上角的"-"图标
    await agent.aiTap("最小化按钮");
    await agent.aiAssert("桌面显示开关机事件.doc文件");

    // ========== 导出 Xls 格式 ==========
    // 点击dock上的日志收集工具图标，打开日志收集工具窗口
    await agent.aiTap("Dock上的紫蓝色图标右下角有一个圆形小闹钟的日志收集工具图标");
    await agent.aiTap("导出按钮");
    await agent.aiWaitFor("文件管理器对话框打开");
    //await agent.aiTap("桌面目录");
    await agent.aiTap("格式下拉框");
    await agent.aiTap("Xls格式选项");
    await agent.aiTap("保存按钮");
    await agent.aiWaitFor("文件管理器对话框关闭");
    await agent.aiTap("最小化按钮");
    await agent.aiAssert("桌面显示开关机事件.xls文件");

    // ========== 导出 Html 格式 ==========
    // 点击dock上的日志收集工具图标，打开日志收集工具窗口
    await agent.aiTap("Dock上的紫蓝色图标右下角有一个圆形小闹钟的日志收集工具图标");
    await agent.aiTap("导出按钮");
    await agent.aiWaitFor("文件管理器对话框打开");
    //await agent.aiTap("桌面目录");
    await agent.aiTap("格式下拉框");
    await agent.aiTap("Html格式选项");
    await agent.aiTap("保存按钮");
    await agent.aiWaitFor("文件管理器对话框关闭");
    await agent.aiTap("最小化按钮");
    await agent.aiAssert("桌面显示开关机事件.html文件");

  }, { timeout: 1000000, tags: ['1655685', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 删除桌面的各种格式的开关机事件日志文件
    await uos.showDesktop();
    await system.exec("rm -f ~/Desktop/开关机事件.txt");
    await system.exec("rm -f ~/Desktop/开关机事件.doc");
    await system.exec("rm -f ~/Desktop/开关机事件.xls");
    await system.exec("rm -f ~/Desktop/开关机事件.html");
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
