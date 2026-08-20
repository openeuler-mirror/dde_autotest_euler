/**
 * 用例 PMSID: 2001617
 * 用例标题: 【DTK】【开源软件】应用关于页面加入致谢字段
 * 生成时间: 2026-06-09 11:45:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001617-【DTK】【开源软件】应用关于页面加入致谢字段', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001617-【DTK】【开源软件】应用关于页面加入致谢字段', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心关于页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("窗口右上角的菜单按钮(类似三的形状)", { deepThink: true });
    await agent.aiWaitFor("'帮助'文字可见");
    await agent.aiTap("关于", { deepThink: true });
    await agent.aiWaitFor("'版本'文字可见");

    // 步骤2: 查看页面展示
    // 验证: 展示致谢字段，致谢字段内容包含开源软件链接
    await agent.aiAssert("展示致谢字段,内容包含'开源软件'文字且是蓝色可点击样式");
  }, { timeout: 600000, tags: ['2001617', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});