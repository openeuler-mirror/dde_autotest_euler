/**
 * 用例 PMSID: 1801691
 * 用例标题: 【通知中心】通知中心重复多次按tab键，焦点循环顺序与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801691-通知中心重复多次按tab键焦点循环顺序与需求一致', () => {
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

  test('1801691-通知中心重复多次按tab键焦点循环顺序与需求一致', async ({ device, agent, uos, system }) => {
    // ===== 前置数据构造：覆盖"有按钮/无按钮"与"展开/不展开"四类场景 =====
    // 1) dde-control-center(控制中心)：2条无按钮通知，按应用折叠，测试时展开 -> [展开 + 无按钮]
    // 2) org.deepin.terminal(终端)：2条无按钮通知，按应用折叠，保持折叠 -> [不展开 + 无按钮]
    // 3) deepin-screen-recorder(截图录屏)：1条带操作按钮(查看/打开文件夹)的截图通知，单条 -> [有按钮]
    //    通过全屏截图快捷键(Print)截图，截图工具确认后自动生成带按钮的截图完成通知
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域；用短超时让横幅过期后进入通知中心
    for (let i = 1; i <= 2; i++) {
      await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知内容" -t 1000`);
      await new Promise(r => setTimeout(r, 400));
    }
    for (let i = 1; i <= 2; i++) {
      await system.exec(`notify-send -a 'org.deepin.terminal' "终端通知" "终端第${i}条通知内容" -t 1000`);
      await new Promise(r => setTimeout(r, 400));
    }
    // 使用全屏截图快捷键(Print)截图，等待截图工具启动后按回车确认截图，生成带"查看/打开文件夹"按钮的截图完成通知
    await device.pressKey('print');
    await new Promise(r => setTimeout(r, 8000));
    await device.pressKey('enter');
    await new Promise(r => setTimeout(r, 10000));
    // 清理截图工具残留进程及桌面截图文件，避免影响后续截图焦点
    await system.exec(`killall deepin-screen-recorder 2>/dev/null || true`);
    await system.exec(`rm -f ~/Desktop/截图_*.png ~/桌面/截图_*.png 2>/dev/null || true`);
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域
    await new Promise(r => setTimeout(r, 3000));

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('通知中心长驻区域有来自不同应用的通知信息', { deepThink: true });
    // 体现"有按钮"通知：截图录屏通知信息展示查看/打开文件夹操作按钮
    await agent.aiAssert('通知中心中"截图录屏"通知信息展示有"查看"和"打开文件夹"两个操作按钮', { deepThink: true });

    // 显式聚焦通知中心窗口，确保 Qt 键盘焦点就绪，Tab 导航才能生效
    const focusNC = async () => {
      const win = await system.exec(`xdotool search --name 'org.deepin.ds.notificationcenter' | head -1`);
      const winId = String(win.stdout || '').trim().split('\n')[0];
      if (winId) {
        await system.exec(`xdotool windowfocus ${winId}`);
        await new Promise(r => setTimeout(r, 600));
      }
    };
    await focusNC();

    // 展开 dde-control-center 折叠通知(带重试，避免 AI 点击偏差导致未展开) -> 体现"展开"
    const expandControlCenter = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部2条通知内容，不只是只显示最新一条", { deepThink: true });
        if (expanded) return;
        await agent.aiTap("通知中心文案下面(长驻区域)控制中心的折叠通知信息", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
      }
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部2条通知内容", { deepThink: true });
      if (!expanded) throw new Error("展开'控制中心'折叠通知失败");
    };
    await expandControlCenter();
    await focusNC();

    // 按 tab 直到满足条件或达到 maxTabs；未命中时用 aiAssert 给出明确失败定位(仅检测，不点击，不会触发删除)
    // 按钮焦点状态用截图(logScreenshot)记录，替代按钮弹出的文字提示通知
    const TAB_WAIT = 1100;
    const tabUntil = async (condPrompt, maxTabs, screenshotTitle) => {
      for (let i = 0; i < maxTabs; i++) {
        await device.pressKey('tab');
        await new Promise(r => setTimeout(r, TAB_WAIT));
        if (await agent.aiBoolean(condPrompt, { deepThink: true })) {
          await agent.logScreenshot(screenshotTitle, { content: condPrompt });
          return true;
        }
      }
      await agent.aiAssert(condPrompt, { deepThink: true });
      await agent.logScreenshot(screenshotTitle, { content: condPrompt });
      return false;
    };

    // 焦点循环顺序：自上而下、自左而右逐个循环每个点击事件(按钮与通知消息框)
    // 锚点(顶部标题栏[更多]，最上方) -> 终端(折叠，中部)清除全部按钮 -> 控制中心(展开，底部)清除全部按钮 -> 回到顶部[更多]
    // 每个清除全部按钮均位于对应通知消息框上，体现"按钮与通知消息框"均参与循环
    const TB_MORE = "通知中心顶部标题栏(显示'通知中心'文字的那一行)的更多(三点)按钮处于键盘焦点状态(该按钮有蓝色高亮边框或焦点高亮边框)";
    const TERMINAL_CLEAR = "通知中心中'终端'(折叠)通知分组(不是通知中心顶部)上的清除全部按钮处于键盘焦点状态(该按钮有蓝色高亮边框或焦点高亮边框，注意是'终端'分组标题栏上的清除全部按钮，不是通知中心顶部标题栏的清除全部按钮)";
    const CONTROL_CLEAR = "通知中心中'控制中心'(已展开)通知分组(不是通知中心顶部)上的清除全部按钮处于键盘焦点状态(该按钮有蓝色高亮边框或焦点高亮边框，注意是'控制中心'分组标题栏上的清除全部按钮，不是通知中心顶部标题栏的清除全部按钮)";

    // ===== 第一轮循环：自上而下 顶部[更多] -> 终端(中部) -> 控制中心(底部) -> 回到顶部[更多] =====
    console.log('===== 第一轮 tab 焦点循环 =====');
    await tabUntil(TB_MORE, 15, '焦点循环-顶部标题栏更多按钮');          // 循环起点：顶部标题栏[更多](最上方)
    await tabUntil(TERMINAL_CLEAR, 15, '焦点循环-终端清除全部按钮');    // 终端(折叠，中部)清除全部按钮 —— 按钮 + 不展开通知消息框
    await tabUntil(CONTROL_CLEAR, 15, '焦点循环-控制中心清除全部按钮');     // 控制中心(展开，底部)清除全部按钮 —— 按钮 + 展开通知消息框
    await tabUntil(TB_MORE, 15, '焦点循环-回到顶部更多按钮');          // 循环一遍后回到顶部[更多]，体现焦点循环

    // ===== 第二轮循环：从头再次循环，验证循环顺序一致 =====
    console.log('===== 第二轮 tab 焦点循环 =====');
    await tabUntil(TERMINAL_CLEAR, 15, '焦点循环第二轮-终端清除全部按钮');    // 终端(折叠，中部)清除全部按钮
    await tabUntil(CONTROL_CLEAR, 15, '焦点循环第二轮-控制中心清除全部按钮');     // 控制中心(展开，底部)清除全部按钮
    await tabUntil(TB_MORE, 15, '焦点循环第二轮-回到顶部更多按钮');          // 第二轮循环一遍后再次回到顶部[更多]

    // 体现：自上而下(更多在上、终端居中、控制中心在下)、自左而右、循环两轮一致
    // 上述两轮 tabUntil 均以顶部标题栏[更多]为锚点循环回到起点，已验证焦点循环顺序与需求一致
    console.log('===== 焦点循环校验通过：自上而下、自左而右，循环两轮一致 =====');

    // 收尾：关闭通知中心
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801691', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 清理通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
