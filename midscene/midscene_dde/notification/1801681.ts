/**
 * 用例 PMSID: 1801681
 * 用例标题: 【通知中心】通知中心长驻区域任一应用展开折叠通知信息设置菜单的[通知设置]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801681-【通知中心】通知中心长驻区域任一应用展开折叠通知信息设置菜单的[通知设置]按钮功能与需求一致', () => {
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

  test('1801681-【通知中心】通知中心长驻区域任一应用展开折叠通知信息设置菜单的[通知设置]按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送多条同一应用的通知，使其在长驻区域按应用折叠显示
    // 使用已注册应用 'dde-control-center'(显示为"控制中心")确保通知按应用分组折叠
    // 关键：同应用同标题(summary)不同正文(body)的通知会累积并按应用折叠为 overlap 折叠组；
    // 折叠状态下只显示最新一条通知，展开后可见全部
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域，导致无法折叠与操作
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知内容" -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域按应用折叠
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心文案下面(长驻区域)显示控制中心的折叠通知信息，折叠状态下只显示最新一条通知(内容为'控制中心第5条通知内容')", { deepThink: true });

    // 展开折叠通知（若已展开则跳过，避免重复切换）
    const expandNotification = async () => {
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容，不只是只显示最新一条", { deepThink: true });
      if (expanded) return;
      await agent.aiTap("通知中心文案下面(长驻区域)控制中心的折叠通知信息", { deepThink: true });
      await agent.aiWaitFor("通知信息已展开");
      await new Promise(r => setTimeout(r, 800));
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

    // 前置步骤：选择一个未置顶的通知——展开折叠通知，打开菜单确保其处于未置顶状态
    await expandNotification();
    await openMoreMenu();
    // 若菜单显示'取消置顶'表示该通知已被置顶，需先取消置顶以恢复未置顶状态
    const alreadyPinned = await agent.aiBoolean("下拉菜单中存在'取消置顶'按钮（表示该通知已置顶）", { deepThink: true });
    if (alreadyPinned) {
      await agent.aiTap("下拉菜单中的'取消置顶'按钮", { deepThink: true });
      await new Promise(r => setTimeout(r, 1500));
      await device.pressKey("Escape");
      await new Promise(r => setTimeout(r, 500));
      // 重新展开并打开菜单
      await expandNotification();
      await openMoreMenu();
    }
    // 验证未置顶状态下下拉菜单显示'置顶'按钮，确认已选择一个未置顶的通知
    const hasPin = await agent.aiBoolean("下拉菜单中存在'置顶'按钮", { deepThink: true });
    if (!hasPin) {
      throw new Error("未置顶状态下下拉菜单应展示'置顶'按钮");
    }

    // 检查: 下拉菜单展示"通知设置"按钮
    await agent.aiAssert("下拉菜单中展示'通知设置'按钮", { deepThink: true });
    // 点击设置菜单的[通知设置]按钮
    await agent.aiTap("下拉菜单中的'通知设置'按钮", { deepThink: true });
    // 检查: 进入系统设置-通知设置页面，通知中心面板不可见（延长等待，以防慢机器卡在加载齿轮）
    await agent.aiWaitFor("齿轮加载完，系统设置页面已打开");
    await agent.aiAssert("系统设置页面显示通知设置相关内容", { deepThink: true });
    await agent.aiAssert("通知中心面板不可见", { deepThink: true });
    // 关闭系统设置窗口
    await device.pressKey("alt", "F4");
    await new Promise(r => setTimeout(r, 800));
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801681', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭可能残留的系统设置窗口
    try {
      await device.pressKey("alt", "F4");
    } catch (e) { console.log('close window skipped'); }
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 清理通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
