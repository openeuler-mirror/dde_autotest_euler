/**
 * 用例 PMSID: 1952229
 * 用例标题: 认证日志-右键菜单-在文件管理器中显示
 * 生成时间: 2026-05-17
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

describe('1952229-认证日志-右键菜单-在文件管理器中显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1952229-认证日志-右键菜单-在文件管理器中显示', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击认证日志（带鉴权处理）
    await authTap(agent, device, "认证日志");

    // 步骤 3: 切换到认证日志页面（鉴权已在authTap中处理）
    await agent.aiAssert("已进入认证日志页面");

    // 步骤 5: 右键点击认证日志选项，如果没有弹出右键菜单再点击一次
    await agent.aiRightClick('认证日志');
    await agent.aiWaitFor("弹出右键菜单", { timeout: 3000 });
    var isMenuVisible = await agent.aiBoolean("弹出右键菜单");
    if (!isMenuVisible) {
      await agent.aiRightClick('认证日志');
    }

    // 步骤 6: 弹出认证日志右键菜单，含在文件管理器中显示、清除日志、刷新
    //await agent.aiWaitFor("弹出右键菜单");
    await agent.aiAssert("认证日志旁边显示右键菜单");
    await agent.aiAssert("右键菜单包含在文件管理器中显示选项");
    await agent.aiAssert("右键菜单包含清除日志选项");
    await agent.aiAssert("右键菜单包含刷新选项");

    // 步骤 7: 点击"在文件管理器中显示"（带鉴权处理）
    await authTap(agent, device, "在文件管理器中显示");

    // 步骤 8: 文管打开并定位选中到/var/log/auth.log
    await agent.aiWaitFor("文件管理器打开");
    await agent.aiAssert("文件管理器已打开");
    await agent.aiAssert("文件管理器定位到log/auth.log");

  }, { timeout: 800000, tags: ['1952229', 'level1', 'smoke'] });

  afterEach(async ({ device,agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文件管理器
    await system.exec("pkill -f dde-file-manager");
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
