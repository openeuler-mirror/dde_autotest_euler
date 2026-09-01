/**
 * 用例 PMSID: 1582853
 * 用例标题: 【系统监视器】【菜单栏】退出
 * 用例编写人: UT006165(李日华)
 * 生成时间: 2026-06-17
 */

describe('1582853-【系统监视器】【菜单栏】退出', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1582853-【系统监视器】【菜单栏】退出', async ({ device, agent, uos }) => {
    // ========== 步骤 1: 打开系统监视器 ==========
    await uos.openApp("系统监视器");
    await agent.aiWaitFor("系统监视器应用已打开");

    // 验证：系统监视器可以正常打开
    await agent.aiAssert("系统监视器应用窗口已显示");

    // ========== 步骤 2: 点击标题栏右上角的三条横线，打开菜单栏 ==========
    await agent.aiTap("标题栏右上角的三条横线菜单按钮", { deepThink: true });

    // 验证：菜单栏展开
    await agent.aiAssert("系统监视器的菜单栏已展开，显示菜单选项");

    // ========== 步骤 3: 单击退出按钮，查看软件显示 ==========
    await agent.aiTap("菜单栏中的退出按钮", { deepThink: true });

    // 等待3秒，观察应用退出
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 验证：应用已退出，回到桌面界面
    await agent.aiAssert("系统监视器应用已退出，当前处于桌面界面");

    // ========== 步骤 4: 再次打开系统监视器，按Ctrl+Q键，查看软件显示 ==========
    await uos.openApp("系统监视器");
    await agent.aiWaitFor("系统监视器应用已再次打开");

    // 验证：系统监视器可以再次正常打开
    await agent.aiAssert("系统监视器应用窗口已再次显示");

    // 按下 Ctrl+Q 快捷键退出
    await agent.aiKeyboardPress("Control+q");

    // 等待3秒，观察应用退出
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 验证：应用已退出，回到桌面界面
    await agent.aiAssert("系统监视器应用已退出，当前处于桌面界面");

  }, { timeout: 600000, tags: ['1582853', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确认是否为桌面界面，以及任务栏是否有系统监视器组件
    const isDesktop = await agent.aiExist("当前处于桌面界面");
    const isMonitorOnTaskbar = await agent.aiExist("任务栏中的系统监视器图标");
    if (isDesktop && !isMonitorOnTaskbar) {
      // 已退出到桌面且任务栏无系统监视器组件，无需处理
      console.log('系统监视器已退出，无需清理');
    } else if (isMonitorOnTaskbar) {
      // 任务栏有系统监视器组件，需执行关闭操作
      await agent.aiTap("窗口右上角关闭按钮:X");
    }
  });
});
