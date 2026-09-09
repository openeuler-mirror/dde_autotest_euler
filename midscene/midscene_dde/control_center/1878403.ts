
/**
 * 用例 PMSID: 1878403
 * 用例标题: 【控制中心】【系统更新】更新设置页面高级设置点击展开和收起功能正常
 * 生成时间: 2026-01-21 08:15:39
 * 用例编写人: UT001924(李鹤)
 */

describe('1878403-【控制中心】【系统更新】更新设置页面高级设置点击展开和收起功能正常', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878403-【控制中心】【系统更新】更新设置页面高级设置点击展开和收起功能正常', async ({ agent, uos }) => {
    // 打开控制中心并进入系统更新页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    // 点击更新设置进入更新设置页面
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'展开'文字可见");
    // 检查高级设置的展开和收起功能
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiAssert("'收起'文字可见");
    await agent.aiTap("'收起'文字", { deepThink: true });
    await agent.aiAssert("'展开'文字可见");
  }, { timeout: 1200000, tags: ['1878403', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
