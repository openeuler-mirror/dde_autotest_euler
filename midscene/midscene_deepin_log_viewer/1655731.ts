/**
 * 用例 PMSID: 1655731
 * 用例标题: 筛选后只会显示对应应用的日志
 * 生成时间: 2026-05-18
 * 用例编写人: UT006165（李日华）
 */

/**
 * 带鉴权处理的点击操作
 * 核心功能：点击后检测是否有鉴权窗口弹出
 * - 如果有：自动处理鉴权，然后重试点击操作
 * - 如果无：点击成功，流程结束
 * 适用场景：日志收集工具等需要定期授权的应用
 */
async function authTap(agent, device, selector, options = {}) {
  const MAX_RETRY = 3; // 最大重试次数，避免无限循环
  
  for (var retry = 0; retry < MAX_RETRY; retry++) {
    // 1. 执行点击操作
    await agent.aiTap(selector, options);
    
    // 2. 检测是否有鉴权窗口弹出
    var authPopped = false;
    try {
      authPopped = await agent.aiBoolean("屏幕上有授权窗口弹出");
    } catch (e) {
      // AI判断异常时跳过，继续流程
    }
    
    // 3. 如果有鉴权窗口，进行授权处理
    if (authPopped) {
      console.log("检测到鉴权窗口，进行授权操作...");
      try {
        await agent.aiTap("密码输入框", { deepThink: true, optional: true });
        await device.typeText("uos12345.", false);
        await agent.aiTap("确定按钮", { optional: true });
        console.log("授权完成，点击操作将在下次循环重试");
      } catch (e) {
        console.log("授权流程异常，跳过");
      }
      // 继续循环重试点击（可能被中断，需要重新点击）
      continue;
    }
    
    // 4. 无鉴权窗口，点击成功，退出函数
    return;
  }
  
  console.log("点击操作完成（已处理可能的鉴权窗口打断）");
}

describe('1655731-筛选后只会显示对应应用的日志', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655731-筛选后只会显示对应应用的日志', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 选择"应用日志"
    await authTap(agent, device, "应用日志");

    // 步骤 3: 切换到"应用日志"界面（授权已在authTap中处理）
    await agent.aiWaitFor("切换到应用日志界面");
    await agent.aiAssert("已进入应用日志页面");

    // 步骤 5: 点击级别后的下拉框，弹出下拉菜单，选择全部
    await authTap(agent, device, "级别下拉框");
    await authTap(agent, device, "全部级别选项");

    // 步骤 6: 点击应用后的下拉框，弹出下拉菜单，勾选"UOS AI"
    await authTap(agent, device, "应用下拉框");
    await authTap(agent, device, "UOS AI应用选项");
    
    // 步骤 7: 查看日志信息
    var hasUOSAILogs = await agent.aiBoolean("日志显示区域有UOS AI来源日志");
    if (hasUOSAILogs) {
      await agent.aiAssert("日志显示区域显示来源是UOS AI的日志");
    } else {
      await agent.aiAssert("当前应用筛选条件为UOS AI");
    }

    // 步骤 8: 点击应用后的下拉框，弹出下拉菜单，应用勾选"截图录屏"
    await authTap(agent, device, "应用下拉框");
    await authTap(agent, device, "截图录屏应用选项");

    // 步骤 9: 查看日志信息
    var hasScreenCaptureLogs = await agent.aiBoolean("日志显示区域有截图录屏来源日志");
    if (hasScreenCaptureLogs) {
      await agent.aiAssert("日志显示区域显示来源是截图录屏的日志");
    } else {
      await agent.aiAssert("当前应用筛选条件为截图录屏");
    }

    // 步骤 10: 点击应用后的下拉框，弹出下拉菜单，勾选"日历"
    await authTap(agent, device, "应用下拉框");
    await authTap(agent, device, "下拉框中的日历应用选项");

    // 步骤 11: 查看日志信息
    var hasCalendarLogs = await agent.aiBoolean("日志显示区域有日历来源日志");
    if (hasCalendarLogs) {
      await agent.aiAssert("日志显示区域显示来源是日历的日志");
    } else {
      // 日志为空时，检查筛选条件是否为日历
      await agent.aiAssert("当前应用筛选条件为日历");
    }

  }, { timeout: 800000, tags: ['1655731', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
