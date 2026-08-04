/**
 * 用例 PMSID: 1655765
 * 用例标题: 窗口可以最大化且能还原
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

describe('1655765-窗口可以最大化且能还原', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655765-窗口可以最大化且能还原', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击窗口右上角从右往左数第二个"口"图标
    //await agent.aiTap("最大化按钮");
    await authTap(agent, device, "窗口右上角菜单栏从右往左数第二个口字型的最大化按钮");

    // 步骤 3: 日志收集工具窗口最大化铺满屏幕
    await agent.aiWaitFor("窗口已最大化");
    await agent.aiAssert("日志收集工具窗口已最大化铺满屏幕，但是不覆盖dock栏区域");

    // 步骤 4: 再次点击窗口右上角从右往左数第二个"口"图标
    //await agent.aiTap("按原按钮");
    await authTap(agent, device, "窗口右上角菜单栏从右往左数第二个双口重叠字型图标的按原按钮");

    // 步骤 5: 日志收集工具界面被还原，窗口正常显示
    await agent.aiWaitFor("窗口已还原");
    await agent.aiAssert("日志收集工具界面已还原");
    await agent.aiAssert("日志收集工具窗口正常显示");

  }, { timeout: 600000, tags: ['1655765', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
