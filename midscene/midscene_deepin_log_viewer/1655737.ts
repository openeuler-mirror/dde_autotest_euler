/**
 * 用例 PMSID: 1655737
 * 用例标题: 筛选后只会显示对应状态的日志
 * 生成时间: 2026-05-18
 * 用例编写人: UT006165（李日华）
 */

describe('1655737-筛选后只会显示对应状态的日志', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }
  });

  test('1655737-筛选后只会显示对应状态的日志', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 选择"启动日志"
    await agent.aiTap("启动日志");

    // 步骤 3: 弹出授权窗口，输入正确的权限密码，点击"确定"
    await agent.aiWaitFor("弹出授权窗口");
    await agent.aiTap("请输入密码框", { deepThink: true });
    await device.typeText("uos12345.", false);
    await agent.aiTap("确定按钮");

    // 步骤 4: 切换到"启动日志"界面
    await agent.aiWaitFor("切换到启动日志界面");
    await agent.aiAssert("已进入启动日志页面");

    // 步骤 5: 点击状态后的下拉框，弹出下拉菜单
    await agent.aiTap("状态下拉框");

    // 步骤 6: 状态勾选"全部"，查看日志信息，显示出所有状态的日志
    await agent.aiTap("全部状态选项");
    await agent.aiAssert("日志显示区域显示所有状态的日志");

    // 步骤 7: 点击状态后的下拉框，弹出下拉菜单
    await agent.aiTap("状态下拉框");

    // 步骤 8: 状态勾选"OK"，查看日志信息
    await agent.aiTap("OK状态选项");
    var hasOkLogs = await agent.aiBoolean("日志显示区域有OK状态日志");
    if (hasOkLogs) {
      await agent.aiAssert("日志显示区域显示OK状态日志");
    } else {
      await agent.aiAssert("OK状态选项是选中状态");
    }

    // 步骤 9: 点击状态后的下拉框，弹出下拉菜单
    await agent.aiTap("状态下拉框");

    // 步骤 10: 状态勾选"Failed"，查看日志信息
    await agent.aiTap("Failed状态选项");
    var hasFailedLogs = await agent.aiBoolean("日志显示区域有Failed状态日志");
    if (hasFailedLogs) {
      await agent.aiAssert("日志显示区域显示Failed状态日志");
    } else {
      await agent.aiAssert("Failed状态选项是选中状态");
    }

  }, { timeout: 600000, tags: ['1655737', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
