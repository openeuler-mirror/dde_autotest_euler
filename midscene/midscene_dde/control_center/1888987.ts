
/**
 * 用例 PMSID: 1888987
 * 用例标题: 【控制中心】【系统更新】更新历史记录弹窗操作功能正常
 * 生成时间: 2026-02-06 15:20:54
 * 用例编写人: UT001924（李鹤）
 */

describe('1888987-【控制中心】【系统更新】更新历史记录弹窗操作功能正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1888987-【控制中心】【系统更新】更新历史记录弹窗操作功能正常', async ({ device, agent, uos }) => {
    // 打开控制中心
    await uos.openApp("控制中心", { maximizeWindow: true});
    // 进入更新设置页面并打开高级设置
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    // 打开历史更新弹窗
    await agent.aiTap("历史更新内容区域的'查看'文字", { deepThink: true });
    await agent.aiWaitFor("'更新历史记录'文字可见");
    // 断言失去焦点是否正常显示
    await agent.aiTap("电源管理");
    await agent.aiAssert("'更新历史记录'文字可见");
    // 更新历史弹窗的x按钮可以关闭弹窗
    await agent.aiTap("更新历史记录弹窗的x按钮", { deepThink: true });
    await agent.aiAssert("更新历史记录弹窗已关闭");
  }, { timeout: 600000, tags: ['1888987', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 如果更新历史记录弹窗未成功关闭，使用快捷键关闭，保障环境恢复正常
    const hasDialog = await agent.aiBoolean("'更新历史记录'文字可见");
    if (hasDialog ) {
      await device.pressKey("alt", "F4");
    };
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
