/**
 * 用例 PMSID: 1801675
 * 用例标题: 【通知中心】通知中心长驻区域任一应用展开折叠通知信息右上角的[设置]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801675-【通知中心】通知中心长驻区域任一应用展开折叠通知信息右上角的[设置]按钮功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：删除数据库并重启 dde-shell，确保长驻区域干净
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801675-【通知中心】通知中心长驻区域任一应用展开折叠通知信息右上角的[设置]按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送多条同一应用的通知，使其在长驻区域按应用折叠显示
    // 关键：同应用同标题(summary)不同正文(body)的通知会累积并按应用折叠为 overlap 折叠组
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知内容" -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域按应用折叠
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 打开通知中心
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiAssert("通知中心文案下面(长驻区域)显示控制中心的折叠通知信息，折叠状态下只显示最新一条通知(内容为'控制中心第5条通知内容')", { deepThink: true });

    // 展开折叠通知（若已展开则跳过）
    const expandNotification = async () => {
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容，不只是只显示最新一条", { deepThink: true });
      if (expanded) return;
      await agent.aiTap("通知中心文案下面(长驻区域)控制中心的折叠通知信息", { deepThink: true });
      await agent.aiWaitFor("通知信息已展开");
      await new Promise(r => setTimeout(r, 800));
    };
    await expandNotification();

    // 通过应用通知组标题栏右上角的[设置]按钮打开下拉菜单（带重试）
    // 关键：[设置]按钮位于显示'控制中心'应用名称的通知组标题栏右上角(该行位于'通知中心'标题行下方)，
    //       不是通知中心面板顶部'通知中心'标题栏同一行的设置/三点按钮(后者打开的菜单只含'通知设置')。
    //       为避免 AI 误点标题栏按钮，先定位'控制中心'所在行，再以鼠标悬浮该行使其右上角[设置]按钮显现，
    //       最后用 xdotool 在该行右侧精确点击[设置]按钮(纵坐标锁定在该行，避开顶部的标题栏按钮)。
    const openMoreMenu = async () => {
      for (let attempt = 0; attempt < 6; attempt++) {
        try {
          // 确保通知中心已打开
          let ncOpen = false;
          try { ncOpen = await agent.aiBoolean("通知中心界面已显示", { deepThink: true }); } catch (e) {}
          if (!ncOpen) {
            await openNotificationCenter(device, agent);
          }
          // 定位'控制中心'通知组标题栏所在行（位于'通知中心'标题下方，不是标题行本身）
          const row = await agent.aiLocate("通知中心面板中显示'控制中心'应用名称的通知组标题栏所在的那一行(位于顶部'通知中心'标题行的下方，不是'通知中心'标题行本身)", { deepThink: true });
          const rect = row.rect || { left: row.center[0] - 95, top: row.center[1] - 15, width: 190, height: 30 };
          const left = rect.left, top = rect.top, width = rect.width, height = rect.height;
          const midY = Math.round(top + height / 2);
          const rightX = Math.round(left + width);
          // 悬浮该行(应用名称区域)，使右上角[设置]按钮显现
          await system.exec(`xdotool mousemove ${Math.round(left + 40)} ${midY}`, 3000);
          await new Promise(r => setTimeout(r, 700));
          // 定位该行右上角的[设置]按钮；若定位到顶部标题行按钮(纵坐标不在该行)，则回退到按行右侧计算的位置
          let clickX = rightX - 25, clickY = midY;
          try {
            const btn = await agent.aiLocate("显示'控制中心'应用名称那一行右上角的[设置]按钮(三点图标)，与'控制中心'文字在同一行；不是顶部'通知中心'标题行右侧的按钮", { deepThink: true });
            const by = Math.round(btn.center[1]);
            if (Math.abs(by - midY) <= 18) {
              clickX = Math.round(btn.center[0]);
              clickY = by;
            }
          } catch (e) { /* 使用按行计算的位置 */ }
          // 精确点击该行右上角的[设置]按钮（在该行上移动并点击，避开顶部标题栏按钮）
          await system.exec(`xdotool mousemove ${clickX} ${clickY} click 1`, 3000);
          await new Promise(r => setTimeout(r, 1000));
          // 严格校验：应用通知组的菜单含'置顶'或'取消置顶'(至少两个选项)；
          //           若菜单只含一个'通知设置'选项，说明点到的是通知中心标题栏的按钮，需重试
          const opened = await agent.aiBoolean("当前展开的下拉菜单中包含'置顶'或'取消置顶'选项(即应用通知组的设置菜单，菜单至少有两个选项)。若菜单只包含一个'通知设置'选项(这是通知中心标题栏的菜单，不是应用通知组的菜单)，则回答false", { deepThink: true });
          if (opened) return;
          await device.pressKey("Escape");
          await new Promise(r => setTimeout(r, 600));
        } catch (e) {
          // 回退：用显式提示的 aiTap 尝试一次
          try {
            await agent.aiTap("显示'控制中心'应用名称那一行(位于'通知中心'标题下方)右上角的[设置]按钮，不是顶部'通知中心'标题行的按钮", { deepThink: true });
            await new Promise(r => setTimeout(r, 1000));
            const opened = await agent.aiBoolean("当前展开的下拉菜单中包含'置顶'或'取消置顶'选项。若菜单只包含一个'通知设置'选项则回答false", { deepThink: true });
            if (opened) return;
            await device.pressKey("Escape");
            await new Promise(r => setTimeout(r, 600));
          } catch (e2) {
            await new Promise(r => setTimeout(r, 500));
          }
        }
      }
      throw new Error("下拉菜单展开失败");
    };

    // 判断当前菜单是否已置顶（存在'取消置顶'表示已置顶；存在'置顶'表示未置顶）
    const menuPinnedState = async () => {
      const pinned = await agent.aiBoolean("下拉菜单中存在'取消置顶'按钮(表示该通知已置顶)", { deepThink: true });
      if (pinned) return true;
      const hasPin = await agent.aiBoolean("下拉菜单中存在'置顶'按钮(表示该通知未置顶)", { deepThink: true });
      if (hasPin) return false;
      return null; // 菜单异常(既无置顶也无取消置顶)
    };

    // 置顶通知（带重试）：打开菜单→点击置顶→重新打开菜单→通过'取消置顶'存在确认置顶生效
    // 说明：不依赖'图钉图标'的视觉判断(AI 识别图钉不稳定)，改用菜单状态切换(置顶后变为取消置顶)可靠确认
    const pinNotification = async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        await openMoreMenu();
        const state = await menuPinnedState();
        if (state === true) { await device.pressKey("Escape"); await new Promise(r => setTimeout(r, 500)); return; } // 已置顶
        if (state !== false) { await device.pressKey("Escape"); await new Promise(r => setTimeout(r, 500)); continue; } // 菜单异常，重试
        await agent.aiTap("下拉菜单中的'置顶'按钮", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
        // 重新打开菜单，通过'取消置顶'存在确认置顶生效
        await openMoreMenu();
        const nowPinned = await menuPinnedState();
        await device.pressKey("Escape");
        await new Promise(r => setTimeout(r, 500));
        if (nowPinned === true) return;
      }
      throw new Error("置顶失败");
    };

    // 取消置顶通知（带重试）：打开菜单→点击取消置顶→重新打开菜单→通过'置顶'存在确认已取消置顶
    const unpinNotification = async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        await openMoreMenu();
        const state = await menuPinnedState();
        if (state === false) { await device.pressKey("Escape"); await new Promise(r => setTimeout(r, 500)); return; } // 已未置顶
        if (state !== true) { await device.pressKey("Escape"); await new Promise(r => setTimeout(r, 500)); continue; } // 菜单异常，重试
        await agent.aiTap("下拉菜单中的'取消置顶'按钮", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
        await openMoreMenu();
        const nowUnpinned = await menuPinnedState();
        await device.pressKey("Escape");
        await new Promise(r => setTimeout(r, 500));
        if (nowUnpinned === false) return;
      }
      throw new Error("取消置顶失败");
    };

    // 检查1：点击[设置]按钮打开的下拉菜单包含'置顶/取消置顶'与'通知设置'
    await openMoreMenu();
    await agent.aiAssert("下拉菜单中展示'置顶'或'取消置顶'按钮，以及'通知设置'按钮", { deepThink: true });
    await device.pressKey("Escape");
    await new Promise(r => setTimeout(r, 500));

    // 先确保未置顶状态（清理上次测试可能残留的置顶），再测试置顶按钮功能
    await openMoreMenu();
    const initialState = await menuPinnedState();
    if (initialState === true) {
      await agent.aiTap("下拉菜单中的'取消置顶'按钮", { deepThink: true });
      await new Promise(r => setTimeout(r, 1500));
      await device.pressKey("Escape");
      await new Promise(r => setTimeout(r, 500));
    } else {
      await device.pressKey("Escape");
      await new Promise(r => setTimeout(r, 500));
    }

    // 检查2：点击[置顶]后通知置顶生效（菜单由'置顶'切换为'取消置顶'）
    await pinNotification();

    // 检查3：点击[取消置顶]后通知取消置顶生效（菜单由'取消置顶'切换为'置顶'）
    await unpinNotification();

    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801675', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：删除数据库并重启 dde-shell
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
