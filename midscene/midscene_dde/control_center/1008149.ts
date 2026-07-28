
/**
 * 用例 PMSID: 1008149
 * 用例标题: 【DTK】【滚动条】默认值检查
 * 生成时间: 2025-12-18 11:29:06
 * 用例编写人: UT001924(李鹤)
 */

describe('1008149-【DTK】【滚动条】默认值检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1008149-【DTK】【滚动条】默认值检查', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化窗口
    await uos.openApp("控制中心", {maximizeWindow: true});
    await agent.aiWaitFor("'个性化'文字可见");
    // 进入个性化页面
    await agent.aiTap("个性化", { deepThink: true });
    await agent.aiWaitFor("'窗口效果'文字可见");
    // 进入窗口效果页面
    await agent.aiTap("窗口效果", { deepThink: true });
    await agent.aiWaitFor("'滚动条'文字可见");
    // 检查滚动条默认值
    await agent.aiAssert("滚动条默认设置为滚动时显示");
    // 打开滚动条下拉框并检查可选项
    await agent.aiTap("'滚动时显示'文字", { deepThink: true });
    await agent.aiAssert("下拉列表存在'一直显示'选项");
  }, { timeout: 1200000, tags: ['1008149', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
