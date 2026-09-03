/**

 * 用例 PMSID: 1671579
 * 用例标题：多实例应用—任务栏打开终端10次
 * 生成时间: 2026-01-13 09:35:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671579-多实例应用—任务栏打开终端10次', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671579-多实例应用—任务栏打开终端10次', async ({ device, agent, uos }) => {
    // 步骤1：点击任务栏"终端"应用图标
    await agent.aiTap("任务栏终端图标", { deepThink: true });
    // 预期结果1：终端窗口显示在桌面
    await agent.aiWaitFor("终端窗口显示在桌面");

    // 步骤2：鼠标右键点击任务栏"终端"应用图标，点击"新建窗口"选项
    await agent.aiRightClick("任务栏终端图标", { deepThink: true });
    await agent.aiTap("菜单中的'新建窗口'选项", { deepThink: true });
    // 预期结果2：最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖
    await agent.aiAssert("最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖");

    // 步骤3：重复步骤2的操作8次
    for (let i = 0; i < 8; i++) {
      console.log(`重复操作第 ${i + 1} 次`);
      await agent.aiRightClick("任务栏终端图标", { deepThink: true });
      await agent.aiTap("菜单中的'新建窗口'选项", { deepThink: true });
      // 预期结果3：最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖
      await agent.aiAssert("最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖");
    }
  }, { timeout: 600000, tags: ['1671579', 'level3','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保所有终端窗口关闭
    await agent.aiRightClick("任务栏终端图标", { deepThink: true });
    await agent.aiTap("右键菜单中的'关闭所有'选项", { deepThink: true });
    await agent.aiWaitFor("桌面所有终端窗口已关闭");
    await uos.setWindowEffect("最佳视觉")
  });
});