/**
 * 用例 PMSID: 1655217
 * 用例标题: 审计日志-未开启等保4，系统管理员鉴权成功
 * 生成时间: 2026-04-24
 * 用例编写人: UT006165（李日华）
 */

describe('1655217-审计日志-未开启等保4，系统管理员鉴权成功', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655217-审计日志-未开启等保4，系统管理员鉴权成功', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具，日志收集工具窗口打开
    await uos.openApp("日志收集工具");
    // 步骤 2: 日志收集工具已显示 // 等待日志收集工具界面完全显示
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 3: 点击审计日志菜单
    await agent.aiTap("审计日志");

    // 步骤 4: 弹出查看此日志需要授权的鉴权窗口，输入账户密码uos12345.，点击鉴权窗口上的确定按钮
    await agent.aiWaitFor("显示查看此日志需要授权的窗口");
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }

    // 步骤 5: 鉴权窗口关闭，进入到审计日志管理页面
    await agent.aiWaitFor("鉴权窗口已关闭");
    await agent.aiAssert("鉴权窗口已关闭");
    await agent.aiWaitFor("进入到审计日志管理页面");
    await agent.aiAssert("进入到审计日志管理页面");

  }, { timeout: 600000, tags: ['1655217', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
