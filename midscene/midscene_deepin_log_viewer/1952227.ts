/**
 * 用例 PMSID: 1952227
 * 用例标题: 认证日志-右键菜单
 * 生成时间: 2026-05-17
 * 用例编写人: UT006165（李日华）
 */

describe('1952227-认证日志-右键菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1952227-认证日志-右键菜单', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击认证日志
    await agent.aiTap("认证日志");

    // 步骤 3: 弹出授权窗口，录入用户密码进行授权
    await agent.aiWaitFor("弹出授权窗口");
    await agent.aiTap("请输入密码框", { deepThink: true });
    await device.typeText("uos12345.", false);
    await agent.aiTap("确定按钮");

    // 步骤 4: 切换到认证日志页面
    await agent.aiAssert("已进入认证日志页面");

    // 步骤 5: 点击认证日志选项右键，如果没有弹出右键菜单再点击一次
    await agent.aiRightClick('认证日志');
    await agent.aiWaitFor("弹出右键菜单", { timeout: 3000 });
    var isMenuVisible = await agent.aiBoolean("弹出右键菜单");
    if (!isMenuVisible) {
      await agent.aiRightClick('认证日志');
    }

    // 步骤 6: 弹出认证日志右键菜单，含在文件管理器中显示、清除日志、刷新
    await agent.aiWaitFor("弹出右键菜单");
    await agent.aiAssert("右键菜单已显示");
    await agent.aiAssert("右键菜单包含在文件管理器中显示选项");
    await agent.aiAssert("右键菜单包含清除日志选项");
    await agent.aiAssert("右键菜单包含刷新选项");

  }, { timeout: 600000, tags: ['1952227', 'level2', 'smoke'] });

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
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
