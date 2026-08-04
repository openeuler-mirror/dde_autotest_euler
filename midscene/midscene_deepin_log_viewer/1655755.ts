/**
 * 用例 PMSID: 1655755
 * 用例标题: 主菜单中帮助、关于、退出功能
 * 生成时间: 2026-05-15
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

describe('1655755-主菜单中帮助、关于、退出功能', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655755-主菜单中帮助、关于、退出功能', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动日志收集工具，日志收集工具应用启动成功
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击应用收集工具窗口右上角三个横线菜单，点击帮助按钮，弹出日志收集工具帮助手册
    //await agent.aiTap("窗口右上角三个横线菜单");
    await authTap(agent, device, "窗口右上角三个横线菜单");
    await agent.aiWaitFor("弹出菜单窗口");
    // await agent.aiTap("帮助");
    await authTap(agent, device, "帮助");
    await agent.aiWaitFor("弹出日志收集工具帮助手册");
    await agent.aiAssert("弹出日志收集工具帮助手册");

    // 步骤 3: 关闭收集收集工具帮助手册
    await system.exec("pkill -f dman");
    await agent.aiWaitFor("帮助手册窗口已关闭");

    // 步骤 4: 按快捷键F1,弹出日志收集工具帮助手册
    await device.pressKey("F1");
    await agent.aiWaitFor("弹出日志收集工具帮助手册");
    await agent.aiAssert("弹出日志收集工具帮助手册");

    // 步骤 5: 关闭帮助手册
    await system.exec("pkill -f dman");
    await agent.aiWaitFor("帮助手册窗口已关闭");

    // 步骤 6: 点击应用收集工具窗口右上角三个横线菜单，点击关于按钮，主菜单收回，弹出日志收集工具版本信息窗口
    // await agent.aiTap("窗口右上角三个横线菜单");
    await authTap(agent, device, "窗口右上角三个横线菜单");
    await agent.aiWaitFor("弹出菜单窗口");
    // await agent.aiTap("关于");
    await authTap(agent, device, "关于");
    await agent.aiWaitFor("弹出日志收集工具版本信息窗口");
    await agent.aiAssert("主菜单收回，弹出日志收集工具版本信息窗口");

    // 步骤 7: 使用终端命令apt-cache policy deepin-log-viewer查询日志收集工具的版本，两个版本保持一致
    const versionCmd = "apt-cache policy deepin-log-viewer | grep Installed | awk '{print $2}'";
    const versionResult = await system.exec(versionCmd);
    const installedVersion = versionResult.stdout.trim();
    console.log('installedVersion:', installedVersion);
    
    // 假设版本信息窗口中包含版本号文本，我们断言该文本存在
    await agent.aiAssert(`版本信息窗口中包含版本号: ${installedVersion}`);

    // 步骤 8: 关闭关于窗口
    await agent.aiTap("关于弹出窗口右上角的关闭按钮"); 
    //await device.pressKey("Alt+F4");
    await agent.aiWaitFor("显示版本信息的关于小窗口已关闭");

    // 步骤 9: 点击应用收集工具窗口右上角三个横线菜单，点击退出按钮，日志收集工具窗口关闭
    await agent.aiTap("窗口右上角三个横线菜单");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiTap("退出");
    //await agent.aiWaitFor("日志收集工具窗口已关闭");
    await agent.aiAssert("日志收集工具窗口关闭");

  }, { timeout: 1000000, tags: ['1655755', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程，以防未正常退出
    await system.exec("pkill -f deepin-log-viewer");
  });

});
