/**
 * 用例 PMSID: 1655743
 * 用例标题: 筛选后只会显示对应级别的日志
 * 生成时间: 2026-05-17
 * 用例编写人: UT006165（李日华）
 */

describe('1655743-筛选后只会显示对应级别的日志', () => {
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

  test('1655743-筛选后只会显示对应级别的日志', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 3: 点击调试选项
    await agent.aiTap("调试选项");
    var hasDebugLogs = await agent.aiBoolean("日志显示区域有调试日志");
    if (hasDebugLogs) {
      await agent.aiAssert("日志显示区域显示调试日志");
    } else {
      await agent.aiAssert("调试选项是选中状态");
    }

    // 步骤 4: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 5: 点击信息选项
    await agent.aiTap("信息选项");
    var hasInfoLogs = await agent.aiBoolean("日志显示区域有信息日志");
    if (hasInfoLogs) {
      await agent.aiAssert("日志显示区域显示信息日志");
    } else {
      await agent.aiAssert("信息选项是选中状态");
    }

    // 步骤 6: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 7: 点击注意选项
    await agent.aiTap("注意选项");
    var hasNoticeLogs = await agent.aiBoolean("日志显示区域有注意日志");
    if (hasNoticeLogs) {
      await agent.aiAssert("日志显示区域显示注意日志");
    } else {
      await agent.aiAssert("注意选项是选中状态");
    }

    // 步骤 8: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 9: 点击警告选项
    await agent.aiTap("警告选项");
    var hasWarningLogs = await agent.aiBoolean("日志显示区域有警告日志");
    if (hasWarningLogs) {
      await agent.aiAssert("日志显示区域显示警告日志");
    } else {
      await agent.aiAssert("警告选项是选中状态");
    }

    // 步骤 10: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 11: 点击错误选项
    await agent.aiTap("错误选项");
    var hasErrorLogs = await agent.aiBoolean("日志显示区域有错误日志");
    if (hasErrorLogs) {
      await agent.aiAssert("日志显示区域显示错误日志");
    } else {
      await agent.aiAssert("错误选项是选中状态");
    }

    // 步骤 12: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 13: 点击严重选项
    await agent.aiTap("严重选项");
    var hasCriticalLogs = await agent.aiBoolean("日志显示区域有严重日志");
    if (hasCriticalLogs) {
      await agent.aiAssert("日志显示区域显示严重日志");
    } else {
      await agent.aiAssert("严重选项是选中状态");
    }

    // 步骤 14: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 15: 点击严重警告选项
    await agent.aiTap("严重警告选项");
    var hasCriticalWarningLogs = await agent.aiBoolean("日志显示区域有严重警告日志");
    if (hasCriticalWarningLogs) {
      await agent.aiAssert("日志显示区域显示严重警告日志");
    } else {
      await agent.aiAssert("严重警告选项是选中状态");
    }

    // 步骤 16: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 17: 点击紧急选项
    await agent.aiTap("紧急选项");
    var hasEmergencyLogs = await agent.aiBoolean("日志显示区域有紧急日志");
    if (hasEmergencyLogs) {
      await agent.aiAssert("日志显示区域显示紧急日志");
    } else {
      await agent.aiAssert("紧急选项是选中状态");
    }

    // 步骤 18: 点击级别后的下拉框，弹出下拉菜单
    await agent.aiTap("级别下拉框");

    // 步骤 19: 点击全部选项，日志显示区域显示全部日志
    await agent.aiTap("全部选项");
    await agent.aiAssert("日志显示区域显示全部日志");

  }, { timeout: 600000, tags: ['1655743', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
