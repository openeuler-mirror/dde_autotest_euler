
/**
 * 用例 PMSID: 1504201
 * 用例标题: 【任务栏】【快捷面板】【护眼模式】入口检查
 * 生成时间: 2025-12-18 14:06:21
 * 用例编写人: UT001924(李鹤)
 */

describe('1504201-【任务栏】【快捷面板】【护眼模式】入口检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1504201-【任务栏】【快捷面板】【护眼模式】入口检查', async ({ device, agent, uos }) => {
    // 点击任务栏的音量图标进入快捷面板
    await agent.aiTap("任务栏的'音量图标'", { deepThink: true });
    await agent.aiWaitFor("桌面右下区域'护眼模式'文字可见");
    // 检查护眼模式展示
    await agent.aiAssert("护眼模式显示关闭字样");
  }, { timeout: 1200000, tags: ['1504201', 'level1', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 点击任务栏没有图标的区域关闭快捷面板
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
