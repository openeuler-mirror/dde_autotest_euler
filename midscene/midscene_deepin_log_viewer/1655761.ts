/**
 * 用例 PMSID: 1655761
 * 用例标题: 主菜单中主题可以改变
 * 生成时间: 2026-04-26
 * 用例编写人: UT006165（李日华）
 */

describe('1655761-主菜单中主题可以改变', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655761-主菜单中主题可以改变', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具，日志收集工具可以正常打开
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击窗口菜单栏右侧三条横线的菜单项，弹出菜单窗口
    await agent.aiTap("窗口菜单栏右侧三条横线的菜单项");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiAssert("菜单窗口已弹出");

    // 步骤 3: 点击主题，弹出主题子菜单，包含浅色、深色、跟随系统
    await agent.aiTap("主题");
    await agent.aiWaitFor("主题子菜单");
    await agent.aiAssert("弹出主题子菜单，包含浅色、深色、跟随系统");

    // 步骤 4: 选择浅色，菜单窗口和刷新频率子菜单均关闭且窗口是白色背景
    await agent.aiTap("浅色");
    await agent.aiWaitFor("菜单窗口和主题子菜单均关闭");
    await agent.aiAssert("菜单窗口和主题子菜单均关闭");
    await agent.aiAssert("窗口是白色背景");

    // 步骤 5: 再次点击窗口菜单栏右侧三条横线的菜单项，弹出菜单窗口
    await agent.aiTap("窗口菜单栏右侧三条横线的菜单项");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiAssert("菜单窗口已弹出");

    // 步骤 6: 点击主题，弹出主题子菜单
    await agent.aiTap("主题");
    await agent.aiWaitFor("主题子菜单");
    await agent.aiAssert("弹出主题子菜单");

    // 步骤 7: 点击深色，菜单窗口和刷新频率子菜单均关闭且窗口是黑色背景
    await agent.aiTap("深色");
    await agent.aiWaitFor("菜单窗口和主题子菜单均关闭");
    await agent.aiAssert("菜单窗口和主题子菜单均关闭");
    await agent.aiAssert("窗口是黑色背景");

    // 步骤 8: 再次点击窗口菜单栏右侧三条横线的菜单项，弹出菜单窗口
    await agent.aiTap("窗口菜单栏右侧三条横线的菜单项");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiAssert("菜单窗口已弹出");

    // 步骤 9: 点击主题，弹出主题子菜单
    await agent.aiTap("主题");
    await agent.aiWaitFor("主题子菜单");
    await agent.aiAssert("弹出主题子菜单");

    // 步骤 10: 点击跟随系统，菜单窗口和刷新频率子菜单均关闭且窗口是白色背景
    await agent.aiTap("跟随系统");
    await agent.aiWaitFor("菜单窗口和主题子菜单均关闭");
    await agent.aiAssert("菜单窗口和主题子菜单均关闭");
    await agent.aiAssert("窗口是白色背景");

  }, { timeout: 1000000, tags: ['1655761', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });

});
