/**
 * 用例 PMSID: 2001623
 * 用例标题: 【DTK】【开源软件】简体中文环境，开源软件文字是简体中文，开源软件弹窗标题展示简体中文，软件列表和软件详细说明展示英文
 * 生成时间: 2026-06-09 11:30:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001623-【DTK】【开源软件】简体中文环境，开源软件文字是简体中文，开源软件弹窗标题展示简体中文，软件列表和软件详细说明展示英文', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001623-【DTK】【开源软件】简体中文环境，开源软件文字是简体中文，开源软件弹窗标题展示简体中文，软件列表和软件详细说明展示英文', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心关于页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("窗口右上角的菜单按钮(类似三的形状)", { deepThink: true });
    await agent.aiWaitFor("'帮助'文字可见");
    await agent.aiTap("关于", { deepThink: true });
    await agent.aiWaitFor("'版本'文字可见");
    // 验证: 开源软件文字是简体中文
    await agent.aiAssert("开源软件文字是简体中文");

    // 步骤2: 点击关于页面开源软件文字
    await agent.aiTap("开源软件", { deepThink: true });
    await agent.aiWaitFor("开源软件弹窗已打开");
    // 验证: 弹窗标题展示简体中文，软件列表展示英文
    await agent.aiAssert("开源软件弹窗标题展示简体中文(标题展示为'开源软件'),软件列表展示英文");

    // 步骤3: 点击任一软件
    await agent.aiTap("软件列表中的任意软件", { deepThink: true });
    await agent.aiWaitFor("软件详细说明页面已打开");
    // 验证: 详细说明展示英文
    await agent.aiAssert("软件详细说明展示英文");
  }, { timeout: 600000, tags: ['2001623', 'level3'] });

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