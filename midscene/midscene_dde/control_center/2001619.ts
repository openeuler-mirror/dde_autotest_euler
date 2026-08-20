/**
 * 用例 PMSID: 2001619
 * 用例标题: 【DTK】【开源软件】有许可证信息的开源软件文字可以正常点击
 * 生成时间: 2026-06-09 11:40:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001619-【DTK】【开源软件】有许可证信息的开源软件文字可以正常点击', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001619-【DTK】【开源软件】有许可证信息的开源软件文字可以正常点击', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心关于页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("窗口右上角的菜单按钮(类似三的形状)", { deepThink: true });
    await agent.aiWaitFor("'帮助'文字可见");
    await agent.aiTap("关于", { deepThink: true });
    await agent.aiWaitFor("'版本'文字可见");

    // 步骤3: 点击开源软件文字
    await agent.aiTap("开源软件", { deepThink: true });
    await agent.aiWaitFor("开源软件弹窗已打开");
    // 验证: 弹窗软件列表固定英文，右上角有x关闭按钮
    await agent.aiAssert("弹窗软件列表展示英文");
    await agent.aiAssert("弹窗右上角有x关闭按钮");
  }, { timeout: 600000, tags: ['2001619', 'level3'] });

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