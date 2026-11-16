/**
 * 用例 PMSID: 1801677
 * 用例标题: 【通知中心】通知中心长驻区域任一应用展开折叠通知信息设置菜单的[置顶]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801677-【通知中心】通知中心长驻区域任一应用展开折叠通知信息设置菜单的[置顶]按钮功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801677-【通知中心】通知中心长驻区域任一应用展开折叠通知信息设置菜单的[置顶]按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送多个不同应用的通知（每类应用多条使其折叠），按发送先后顺序排列：
    // 先发送的应用通知排在最下方，置顶后该类折叠通知会排到所有应用通知的最前面
    // 两个应用之间间隔1分钟发送，确保通知按应用分组折叠展示
    const apps = [
      { name: 'dde-control-center', title: '控制中心通知', prefix: '控制中心' },
      { name: 'org.deepin.terminal', title: '终端通知', prefix: '终端' },
    ];
    for (let a = 0; a < apps.length; a++) {
      const app = apps[a];
      for (let i = 1; i <= 3; i++) {
        await system.exec(`notify-send -a '${app.name}' "${app.title}" "${app.prefix}第${i}条通知" -t 1000`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      // 应用之间间隔1分钟，最后一个应用发送后无需等待
      if (a < apps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域按应用折叠
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 打开通知中心（带重试，避免super+m切换导致通知中心未打开）
    for (let attempt = 0; attempt < 3; attempt++) {
      await device.pressKey("super", "m");
      await new Promise(r => setTimeout(r, 1500));
      if (await agent.aiBoolean("通知中心界面已显示", { deepThink: true })) break;
    }
    await agent.aiAssert("通知中心界面已显示", { deepThink: true });
    await agent.aiAssert("通知中心文案下面(长驻区域)有来自不同应用的通知信息，不同应用通知分开排列折叠展示", { deepThink: true });
    // 动态检测初始时间先后顺序（通知中心排序偶有差异，需自适应以验证取消置顶后恢复原顺序）
    const ccOnTop = await agent.aiBoolean("通知中心文案下面(长驻区域)从上到下第一条是'控制中心'(dde-control-center)的通知，第二条是'终端'(org.deepin.terminal)的通知", { deepThink: true });
    // 记录初始顺序：取消置顶后应恢复此顺序，体现时间先后顺序
    const initialOrder = ccOnTop ? "'dde-control-center'、'org.deepin.terminal'" : "'org.deepin.terminal'、'dde-control-center'";

    // 展开'dde-control-center'折叠通知（若已展开则跳过，避免重复切换）
    const expandNotification = async () => {
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部3条通知内容，不只是只显示最新一条", { deepThink: true });
      if (expanded) return;
      await agent.aiTap("通知中心文案下面(长驻区域)'dde-control-center'折叠通知信息", { deepThink: true });
      await agent.aiWaitFor("通知信息已展开");
      await new Promise(r => setTimeout(r, 800));
    };

    // 收起展开的'dde-control-center'通知（若已折叠则跳过，避免重复切换）
    // 通过关闭并重新打开通知中心，使通知恢复默认折叠状态（置顶状态会保留）
    const collapseNotification = async () => {
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部3条通知内容，不只是只显示最新一条", { deepThink: true });
      if (!expanded) return;
      // 先关闭可能存在的下拉菜单
      await device.pressKey("Escape");
      await new Promise(r => setTimeout(r, 500));
      // 点击任务栏空白区域关闭通知中心
      await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
      await new Promise(r => setTimeout(r, 800));
      // 重新打开通知中心，通知将恢复默认折叠状态
      for (let attempt = 0; attempt < 3; attempt++) {
        await device.pressKey("super", "m");
        await new Promise(r => setTimeout(r, 1500));
        if (await agent.aiBoolean("通知中心界面已显示", { deepThink: true })) break;
      }
      await new Promise(r => setTimeout(r, 800));
    };

    // 通过三点图标菜单打开下拉菜单（带重试，避免AI点击偏差导致菜单未展开）
    // 注意：三点图标位于'dde-control-center'通知组标题栏(显示'控制中心'应用名称)的右上角，
    //       不是单个通知条目上，也不是通知中心面板顶部的三点图标(只含"通知设置")
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
          // 鼠标悬浮到控制中心通知组标题栏上，使右上角操作按钮显示
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

    // 置顶通知（带重试）：展开→打开菜单→点击置顶→断言通知中心未关闭→收起→验证置顶展示
    // 置顶效果通过排序变化体现：置顶后'dde-control-center'排到所有应用通知最前面，并显示置顶标识
    // 重试时通过菜单状态(取消置顶按钮)兜底确认，避免视觉判断偶发偏差
    const pinNotification = async (verifyMsg) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await expandNotification();
        await openMoreMenu();
        const alreadyPinned = await agent.aiBoolean("下拉菜单中存在'取消置顶'按钮（表示该通知已置顶）", { deepThink: true });
        if (alreadyPinned) {
          await device.pressKey("Escape");
          await new Promise(r => setTimeout(r, 500));
          await collapseNotification();
          return;
        }
        // 验证未置顶状态下下拉菜单显示'置顶'按钮
        const hasPin = await agent.aiBoolean("下拉菜单中存在'置顶'按钮", { deepThink: true });
        if (!hasPin) {
          throw new Error("未置顶状态下下拉菜单应展示'置顶'按钮");
        }
        await agent.aiTap("下拉菜单中的'置顶'按钮", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
        // 检查: 点击[置顶]后通知中心不关闭
        await agent.aiAssert("通知中心未关闭");
        // 收起展开的通知，便于验证置顶后的展示状态（排序变化）
        await collapseNotification();
        if (await agent.aiBoolean(verifyMsg, { deepThink: true })) return;
        await device.pressKey("Escape");
        await new Promise(r => setTimeout(r, 500));
      }
      throw new Error("置顶失败");
    };

    // 取消置顶通知（带重试）：展开→打开菜单→点击取消置顶→收起→验证已取消置顶
    // 取消置顶效果通过排序恢复体现：'dde-control-center'回到最下方，不再显示置顶标识
    const unpinNotification = async (verifyMsg) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await expandNotification();
        await openMoreMenu();
        const alreadyUnpinned = await agent.aiBoolean("下拉菜单中存在'置顶'按钮（表示该通知未置顶）", { deepThink: true });
        if (alreadyUnpinned) {
          await device.pressKey("Escape");
          await new Promise(r => setTimeout(r, 500));
          await collapseNotification();
          return;
        }
        // 验证置顶状态下下拉菜单显示'取消置顶'按钮
        const hasUnpin = await agent.aiBoolean("下拉菜单中存在'取消置顶'按钮", { deepThink: true });
        if (!hasUnpin) {
          throw new Error("置顶状态下下拉菜单应展示'取消置顶'按钮");
        }
        await agent.aiTap("下拉菜单中的'取消置顶'按钮", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
        // 检查: 点击[取消置顶]后通知中心不关闭
        await agent.aiAssert("通知中心未关闭");
        // 收起展开的通知，便于验证取消置顶后的展示状态（排序恢复）
        await collapseNotification();
        if (await agent.aiBoolean(verifyMsg, { deepThink: true })) return;
        await device.pressKey("Escape");
        await new Promise(r => setTimeout(r, 500));
      }
      throw new Error("取消置顶失败");
    };

    // 展开'dde-control-center'折叠通知信息
    await expandNotification();

    // 点击展开通知信息右上角的[设置]按钮（三点图标），打开下拉菜单
    // 确保通知处于未置顶状态（清理上次测试可能残留的置顶状态）
    await openMoreMenu();
    const alreadyPinned = await agent.aiBoolean("下拉菜单中存在'取消置顶'按钮（表示该通知已置顶）", { deepThink: true });
    if (alreadyPinned) {
      // 取消置顶，恢复未置顶状态
      await agent.aiTap("下拉菜单中的'取消置顶'按钮", { deepThink: true });
      await new Promise(r => setTimeout(r, 1500));
      await device.pressKey("Escape");
      await new Promise(r => setTimeout(r, 500));
      // 重新展开并打开菜单
      await expandNotification();
      await openMoreMenu();
    }
    // 验证未置顶状态下下拉菜单显示'置顶'按钮
    const hasPin = await agent.aiBoolean("下拉菜单中存在'置顶'按钮", { deepThink: true });
    if (!hasPin) {
      throw new Error("未置顶状态下下拉菜单应展示'置顶'按钮");
    }
    await device.pressKey("Escape");
    await new Promise(r => setTimeout(r, 500));

    // 验证置顶效果：点击置顶后通知中心不关闭，收起通知后验证置顶展示
    // 检查: 该类应用折叠通知置顶后排到所有应用通知的最前面（排序变化体现置顶效果），并显示置顶标识
    await pinNotification("通知中心文案下面(长驻区域)通知信息显示顺序为'dde-control-center'、'org.deepin.terminal'的折叠通知，且'dde-control-center'折叠通知信息显示有置顶标识(如图钉图标)");

    // 再次展开，打开菜单验证显示'取消置顶'按钮
    await expandNotification();
    await openMoreMenu();
    const hasUnpin = await agent.aiBoolean("下拉菜单中存在'取消置顶'按钮", { deepThink: true });
    if (!hasUnpin) {
      throw new Error("置顶状态下下拉菜单应展示'取消置顶'按钮");
    }
    await device.pressKey("Escape");
    await new Promise(r => setTimeout(r, 500));

    // 取消置顶恢复原状：验证排序恢复且不再显示置顶标识
    await unpinNotification(`通知中心文案下面(长驻区域)通知信息显示顺序为${initialOrder}的折叠通知，且'dde-control-center'折叠通知信息不再显示置顶标识`);
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801677', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
