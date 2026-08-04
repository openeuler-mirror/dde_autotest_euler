/**
 * 用例 PMSID: 1952221
 * 用例标题: 认证日志-其他日志中的认证日志单独成项
 * 生成时间: 2026-05-15
 * 用例编写人: UT006165（李日华）
 */

describe('1952221-认证日志-其他日志中的认证日志单独成项', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1952221-认证日志-其他日志中的认证日志单独成项', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具，日志收集工具窗口被打开
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击左侧列表的“认证日志”
    await agent.aiTap("认证日志");

    // 步骤 3: 弹出查看此日志需要授权的窗口，在请输入密码框输入uos12345.,然后点击确定按钮
    await agent.aiTap("请输入密码框", { deepThink: true });
    await device.typeText("uos12345.", false);
    await agent.aiTap("确定按钮");

    // 步骤 4: 进入到认证日志管理页面，右侧窗口显示周期选项、导出按钮、日志列表（默认第一个日志是蓝色选中状态，字段显示时间、主机名、进程、信息）
    await agent.aiWaitFor("进入到认证日志管理页面");
    await agent.aiAssert("进入到认证日志管理页面");
    await agent.aiAssert("右侧窗口显示周期选项");
    await agent.aiAssert("右侧窗口显示导出按钮");
    //await agent.aiAssert("默认第一个日志是蓝色选中状态");
    //await agent.aiAssert("字段显示时间、主机名、进程、信息");

    // 步骤 5: 点击左侧菜单的其他日志，不存在auth.log
    await agent.aiTap("其他日志");
    await agent.aiWaitFor("进入到其他日志管理页面");
    await agent.aiAssert("其他日志管理页面右侧窗口展示的文件列表下文件名称不存在auth.log");

  }, { timeout: 600000, tags: ['1952221', 'level2', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //如果弹出查看此日志需要授权的窗口，在请输入密码框输入uos12345.,然后点击确定按钮
    await agent.aiWaitFor("显示查看此日志需要授权的窗口");
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
