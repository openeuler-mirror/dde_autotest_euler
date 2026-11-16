/**
 * 用例 PMSID: 1801689
 * 用例标题: 【通知中心】通知中心任一设置菜单打开，关闭开启通知中心设置菜单展示符合预期
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801689-【通知中心】通知中心任一设置菜单打开，关闭开启通知中心设置菜单展示符合预期', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801689-【通知中心】通知中心任一设置菜单打开，关闭开启通知中心设置菜单展示符合预期', async ({ device, agent, uos, system }) => {
    // 发送多条同一应用的通知，使其在长驻区域按应用折叠显示
    // 使用已注册应用 'dde-control-center'(显示为"控制中心")确保通知按应用分组折叠
    // 关键：同应用同标题(summary)不同正文(body)的通知会累积并按应用折叠为 overlap 折叠组；
    // 折叠状态下只显示最新一条通知，展开后可见全部
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域，导致无法折叠与操作
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知内容"`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // 等待最后一条通知横幅出现
    await agent.aiWaitFor("桌面右下角有通知横幅", { timeoutMs: 15000 });
    // 等待10秒：让桌面横幅超时消失、通知写入数据库并进入通知中心长驻区域按应用折叠
    // (数据库写入有延迟，实测约7秒5条才全部落库，故等待10秒留足余量)
    await new Promise(resolve => setTimeout(resolve, 10000));

    // ===== 场景一：通知中心标题栏设置菜单 =====
    // 步骤1: 打开通知中心，打开标题栏下拉菜单
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiTap("通知中心标题栏右侧的更多按钮(三点图标)", { deepThink: true });
    await agent.aiWaitFor("'通知设置'选项已显示");
    // 体现通知中心标题的设置菜单列表：仅包含"通知设置"选项
    await agent.aiAssert("下拉菜单已展开，显示'通知设置'选项", { deepThink: true });
    // 快捷键关闭通知中心
    await device.pressKey("super", "m");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查1: 下拉菜单跟随通知中心隐藏，通知中心面板不可见
    await agent.aiAssert("通知中心面板不可见", { deepThink: true });

    // 步骤2: 快捷键重新打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 检查2: 重新打开通知中心后，标题栏下拉菜单已关闭，无'通知设置'选项显示
    await agent.aiAssert("通知中心标题栏下方无'通知设置'选项显示", { deepThink: true });

    // ===== 场景二：通知信息设置菜单 =====
    // 展开折叠通知（若已展开则跳过，避免重复切换；带重试防止AI点击偏差导致未展开）
    const expandNotification = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容，不只是只显示最新一条", { deepThink: true });
        if (expanded) return;
        await agent.aiTap("通知中心文案下面(长驻区域)控制中心的折叠通知信息", { deepThink: true });
        await new Promise(r => setTimeout(r, 1200));
      }
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容", { deepThink: true });
      if (!expanded) {
        throw new Error("展开'控制中心'折叠通知失败");
      }
    };

    // 通过三点图标菜单打开下拉菜单（带重试，避免AI点击偏差导致菜单未展开）
    // 注意：三点图标位于通知组标题栏(显示'控制中心'应用名称)的右上角，不是单个通知条目上
    //       也不是通知中心面板顶部的三点图标(只含"通知设置")
    const openMoreMenu = async () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          // 确保通知中心已打开
          const ncOpen = await agent.aiBoolean("通知中心界面已显示", { deepThink: true });
          if (!ncOpen) {
            await device.pressKey("super", "m");
            await agent.aiWaitFor("通知中心界面已显示");
            await new Promise(r => setTimeout(r, 800));
          }
          // 鼠标悬浮到通知组标题栏上，使右上角操作按钮显示
          await agent.aiHover("通知中心长驻区域显示'控制中心'应用名称的通知组标题栏", { deepThink: true });
          await new Promise(r => setTimeout(r, 500));
          await agent.aiWaitFor("控制中心通知组标题栏右上角显示三点图标(设置)按钮");
          await agent.aiTap("控制中心通知组标题栏右上角的三点图标(设置)按钮", { deepThink: true });
          await new Promise(r => setTimeout(r, 1000));
          // 精确检测：明确排除只含'通知设置'的面板顶部菜单，确保打开的是通知组菜单(含置顶/取消置顶)
          const opened = await agent.aiBoolean("下拉菜单已展开，且菜单中包含'置顶'或'取消置顶'选项（不是只包含'通知设置'的通知中心面板顶部菜单）", { deepThink: true });
          if (opened) return;
          await device.pressKey("Escape");
          await new Promise(r => setTimeout(r, 500));
        } catch (e) {
          await new Promise(r => setTimeout(r, 500));
          try {
            const ncOpen = await agent.aiBoolean("通知中心界面已显示", { deepThink: true });
            if (!ncOpen) {
              await device.pressKey("super", "m");
              await agent.aiWaitFor("通知中心界面已显示");
              await new Promise(r => setTimeout(r, 800));
            }
          } catch (e2) {}
        }
      }
      throw new Error("下拉菜单展开失败");
    };

    // 步骤3: 展开折叠通知，打开通知信息设置菜单
    await expandNotification();
    await openMoreMenu();
    // 体现通知信息的设置菜单列表：包含"置顶/取消置顶"和"通知设置"选项
    await agent.aiAssert("下拉菜单已展开，菜单中包含'置顶'或'取消置顶'和'通知设置'选项", { deepThink: true });
    // 快捷键关闭通知中心
    await device.pressKey("super", "m");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查3: 下拉菜单跟随通知中心隐藏，通知中心面板不可见
    await agent.aiAssert("通知中心面板不可见", { deepThink: true });

    // 步骤4: 快捷键重新打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 检查4: 重新打开通知中心后，通知信息设置菜单已关闭，无下拉菜单显示
    await agent.aiAssert("通知中心通知信息区域无下拉菜单显示(无'置顶'和'通知设置'选项的下拉菜单)", { deepThink: true });
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801689', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
