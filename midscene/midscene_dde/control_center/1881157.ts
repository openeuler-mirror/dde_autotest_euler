
/**
 * 用例 PMSID: 1881157
 * 用例标题: 【控制中心】【系统更新】更新设置中[缓存传递]配置项默认隐藏
 * 生成时间: 2026-01-27 11:13:32
 * 用例编写人: UT001924（李鹤）
 */

describe('1881157-【控制中心】【系统更新】更新设置中[缓存传递]配置项默认隐藏', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1881157-【控制中心】【系统更新】更新设置中[缓存传递]配置项默认隐藏', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 确认出现系统更新菜单，点击菜单进入系统更新页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    // 点击更新设置进入更新设置页面
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    // 点击高级设置展开按钮展开高级设置
    await agent.aiTap("展开", { deepThink: true });
    // 确认高级设置已经展开
    await agent.aiWaitFor("'收起'文字可见");
    // 检查缓存传递配置项不存在
    await agent.aiAssert("'缓存传递配置'文字不可见");
  }, { timeout: 600000, tags: ['1881157', 'level3'] });

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
