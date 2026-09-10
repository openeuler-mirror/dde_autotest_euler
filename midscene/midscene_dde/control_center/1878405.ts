
/**
 * 用例 PMSID: 1878405
 * 用例标题: 【控制中心】【系统更新】更新设置页面点击高级设置展开控件后，切换模块再次进入更新设置页面，高级设置项是收起状态
 * 生成时间: 2026-01-21 08:49:02
 * 用例编写人: UT001924(李鹤)
 */

describe('1878405-【控制中心】【系统更新】更新设置页面点击高级设置展开控件后，切换模块再次进入更新设置页面，高级设置项是收起状态', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878405-【控制中心】【系统更新】更新设置页面点击高级设置展开控件后，切换模块再次进入更新设置页面，高级设置项是收起状态', async ({ device, agent, uos }) => {
    // 定义一个进入系统更新设置页面的函数方便后面重复调用
    const enterUpdateSettings = async () => {
      await agent.aiWaitFor("'系统更新'文字可见");
      await agent.aiTap("系统更新", { deepThink: true });
      await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
      await agent.aiTap("更新设置", { deepThink: true });
    };
    // 打开控制中心
    await uos.openApp("控制中心");
    // 调用进入系统更新设置页面的函数进入系统更新设置页面
    await enterUpdateSettings();
    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiAssert("'收起'文字可见");
    // 切换到其他模块，如电源管理模块
    await agent.aiTap("电源管理", { deepThink: true });
    await agent.aiWaitFor("'通用'文字可见");
    // 调用进入系统更新设置页面的函数进入系统更新设置页面
    await enterUpdateSettings();
    // 查看高级设置是否是收起状态
    await agent.aiAssert("'展开'文字可见");
  }, { timeout: 1200000, tags: ['1878405', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
