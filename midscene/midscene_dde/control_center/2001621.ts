/**
 * 用例 PMSID: 2001621
 * 用例标题: 【DTK】【开源软件】开源软件弹窗操作正常
 * 生成时间: 2026-06-09 11:35:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001621-【DTK】【开源软件】开源软件弹窗操作正常', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001621-【DTK】【开源软件】开源软件弹窗操作正常', async ({ device, agent, uos, system }) => {
    // 前置条件: 打开控制中心关于页面并打开开源软件弹窗
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("窗口右上角的菜单按钮(类似三的形状)", { deepThink: true });
    await agent.aiWaitFor("'帮助'文字可见");
    await agent.aiTap("关于", { deepThink: true });
    await agent.aiWaitFor("'版本'文字可见");
    await agent.aiTap("开源软件", { deepThink: true });
    await agent.aiWaitFor("开源软件弹窗已打开");

    // 步骤1: 点击列表任一软件
    await agent.aiTap("软件列表中的任意软件", { deepThink: true });
    await agent.aiWaitFor("软件详细说明页面已打开");
    // 验证: 页面左上角展示返回按钮，页面右上角有x关闭按钮
    await agent.aiAssert("页面左上角展示返回按钮");
    await agent.aiAssert("页面右上角有x关闭按钮");

    // 步骤2: 点击软件详细说明页面右上角x按钮
    await agent.aiTap("页面右上角的x关闭按钮", { deepThink: true });
    // 验证: 关闭开源软件弹窗，返回关于页面
    await agent.aiWaitFor("软件列表不可见");

    // 重新打开弹窗继续测试
    await agent.aiTap("开源软件", { deepThink: true });
    await agent.aiWaitFor("开源软件弹窗已打开");

    // 步骤3: 点击列表任一软件
    await agent.aiTap("软件列表中的任意软件", { deepThink: true });
    await agent.aiWaitFor("软件详细说明页面已打开");

    // 步骤4: 点击软件详细说明页面左上角返回按钮
    await agent.aiTap("页面左上角的返回按钮", { deepThink: true });
    // 验证: 返回开源软件列表页面
    await agent.aiAssert("返回开源软件列表页面");

    // 步骤5: 点击开源软件弹窗右上角的x按钮
    await agent.aiTap("开源软件弹窗右上角的x按钮", { deepThink: true });
    // 验证: 关闭开源软件弹窗，返回关于页面
    await agent.aiWaitFor("软件列表不可见");
  }, { timeout: 600000, tags: ['2001621', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
    await device.pressKey("alt", "F4");
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});