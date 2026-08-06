/**
 * 用例 PMSID: 1952237
 * 用例标题: 认证日志-导出
 * 生成时间: 2026-05-17
 * 用例编写人: UT006165（李日华）
 */

describe('1952237-认证日志-导出', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1952237-认证日志-导出', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动日志收集工具，显示日志收集工具窗口
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("显示日志收集工具窗口");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击认证日志
    await agent.aiTap("认证日志");

    // 步骤 3: 切换到"认证日志"页面，弹出查看此日志需要授权的窗口，在请输入密码框输入uos12345.,然后点击确定按钮
    await agent.aiTap("请输入密码框", { deepThink: true });
    await device.typeText("uos12345.", false);
    await agent.aiTap("确定按钮");
    // 步骤 4: 切换到"认证日志"页面
    //await agent.aiWaitFor("切换到认证日志页面");
    await agent.aiAssert("已进入认证日志管理页面");

    //如果弹出授权窗口，进行授权
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }

    // await agent.aiTap("标题栏从左往右第二个刷新按钮");

    // //如果弹出授权窗口，再次进行授权
    // var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    // if (isAuthVisible) {
    //   await agent.aiTap("请输入密码框", { deepThink: true });
    //   await device.typeText("uos12345.", false);
    //   await agent.aiTap("确定按钮");
    // }
    await agent.aiWaitFor("显示认证日志");
    await agent.aiAssert("显示认证日志");

    // 步骤 5: 点击周期右侧的"导出"按钮
    await agent.aiTap("导出按钮");

    // 步骤 6: 弹出文管对话框，导出日志默认名为【认证日志.txt】
    //await agent.aiWaitFor("显示文管对话框");
    await agent.aiAssert("文管对话框已打开");
    await agent.aiAssert("默认文件名为认证日志.txt");

    // 步骤 7: 选择导出路径是桌面
    await agent.aiTap("桌面目录");

    // 步骤 8: 点击确认
    await agent.aiTap("确认按钮");

    // 步骤 9: 文管关闭，显示导出进度条
    await agent.aiWaitFor("文管对话框关闭");
    await agent.aiAssert("文管对话框关闭");

    // 步骤 10: 导出完成后进度条关闭
    //await agent.aiWaitFor("导出进度条关闭");
    await agent.aiAssert("导出进度条已关闭");

    // 步骤 11: 查看桌面有【认证日志.txt】
    //await uos.showDesktop();
    await device.pressKey("Super+D");
    await agent.aiAssert("桌面显示认证日志.txt文件");

  }, { timeout: 800000, tags: ['1952237', 'level1', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 如果弹出查看此日志需要授权的窗口，在请输入密码框输入uos12345.,然后点击确定按钮
    //await agent.aiWaitFor("显示查看此日志需要授权的窗口");
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 删除桌面的认证日志.txt
    await uos.showDesktop();
    await system.exec("rm -f ~/Desktop/认证日志.txt");
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
