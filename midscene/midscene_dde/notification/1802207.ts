/**
 * 用例 PMSID: 1802207
 * 用例标题: 【通知中心】通知中心操作按钮默认展示图标，tab移动焦点到操作按钮上展示文字说明
 * 生成时间: 2026-08-05 16:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1802207-【通知中心】通知中心操作按钮默认展示图标，tab移动焦点到操作按钮上展示文字说明', () => {
  const caseDir = process.env.TESTCASE_DIR;
  
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1802207-【通知中心】通知中心操作按钮默认展示图标，tab移动焦点到操作按钮上展示文字说明', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 准备通知数据：两个应用各3条形成折叠信息，再发1条单条通知
    // -t 1000: 横幅展示1秒后过期转常驻，通知中心常驻区域按应用形成折叠信息
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '模拟控制中心应用名称发通知' '这是第${i}条模拟控制中心应用名称发出的通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'org.deepin.browser' '模拟浏览器应用名称发通知' '这是第${i}条模拟浏览器应用名称发出的通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await system.exec(`notify-send -a 'org.deepin.terminal' '单条通知Tab测试' '用于删除按钮焦点测试' -t 1000`);
    // 等待所有通知横幅过期并进入通知中心长驻区域
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 辅助函数: 连续按tab键，直到焦点所在操作按钮展示指定文字说明
    // 前置步骤: 显式聚焦通知中心窗口，确保Qt键盘焦点就绪，Tab导航才能生效
    async function focusNotificationCenter() {
      const win = await system.exec(`xdotool search --name 'org.deepin.ds.notificationcenter' | head -1`);
      const winId = win.stdout.trim();
      if (winId) {
        await system.exec(`xdotool windowfocus ${winId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    async function tabUntilTooltip(text, location, opt) {
      const opts = opt || {};
      await focusNotificationCenter();
      if (opts.hoverPrompts && opts.hoverPrompts.length > 0) {
        // 悬停使仅在悬浮时展示的按钮出现（多个定位描述依次尝试，增强稳定性）
        let hovered = false;
        for (const hp of opts.hoverPrompts) {
          try {
            await agent.aiHover(hp, { deepThink: true });
            hovered = true;
            console.log(`[tabUntilTooltip] 悬停成功: ${hp}`);
            break;
          } catch (e) {
            console.log(`[tabUntilTooltip] 悬停尝试失败: ${hp} -> ${e.message}`);
          }
        }
        if (!hovered) {
          await agent.aiAssert(`鼠标应能悬停到${location}目标区域`);
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      const maxTabs = opts.maxTabs || 15;
      for (let i = 0; i < maxTabs; i++) {
        await device.pressKey('tab');
        await new Promise(resolve => setTimeout(resolve, 1200));
        const found = await agent.aiBoolean(`当前屏幕${location}附近展示文字提示"${text}"`, { deepThink: true });
        if (found) {
          console.log(`[tabUntilTooltip] 焦点已移动到${location}，展示文字: ${text}`);
          return true;
        }
      }
      // 未找到时以断言失败结束，明确提示缺失的目标
      await agent.aiAssert(`tab移动焦点后，${location}附近应展示文字说明"${text}"`);
      return false;
    }

    // 步骤 1: 打开通知中心，查看标题栏操作按钮展示
    // 预期: 默认展示图标
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await focusNotificationCenter();
    await agent.aiAssert('通知中心标题栏右侧展示两个功能图标按钮，仅展示图标，不展示文字说明');

    // 步骤 2 前置: 展开dde-control-center应用的折叠信息，使标题栏出现[收起]按钮
    // 仅点击一次，避免重试时误展开其他应用的折叠行
    await agent.aiTap('通知中心长驻区域中来自dde-control-center应用的折叠通知信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 步骤 2: 按键盘tab键将焦点移动到标题栏的[收起]按钮上
    // 预期: 展示文字: 收起
    await tabUntilTooltip('收起', '通知中心标题栏', {});

    // 步骤 3: 按键盘tab键将焦点移动到标题栏的[设置]按钮上
    // 预期: 展示文字: 更多
    await tabUntilTooltip('更多', '通知中心标题栏', {});

    // 步骤 4: 按键盘tab键将焦点移动到标题栏的[清除全部]按钮上
    // 预期: 展示文字: 清除全部
    await tabUntilTooltip('清除全部', '通知中心标题栏', {});

    // 步骤 5: 按键盘tab键将焦点移动到折叠通知信息的[清除全部]按钮(悬停在任一折叠通知信息上展示)上
    // 预期: 展示文字: 清除全部
    await tabUntilTooltip('清除全部', '浏览器通知行', {
      hoverPrompts: [
        '通知中心列表中显示"模拟浏览器应用名称发通知"文字的通知行（来自浏览器应用的多条通知折叠成一行，位于终端单条通知下方）',
        '通知中心中来自浏览器(org.deepin.browser)应用的通知行，该行显示"模拟浏览器应用名称发通知，这是第3条模拟浏览器应用名称发出的通知"',
        '通知中心列表中位于终端单条通知下方的折叠通知行（应用名称为浏览器）'
      ]
    });

    // 步骤 6: 按键盘tab键将焦点移动到展开折叠信息后应用信息右上角的[收起]按钮上
    // 预期: 展示文字: 收起
    await tabUntilTooltip('收起', '展开的应用信息右上角', {});

    // 步骤 7: 按键盘tab键将焦点移动到展开折叠信息后应用信息右上角的[设置]按钮上
    // 预期: 展示文字: 更多
    await tabUntilTooltip('更多', '展开的应用信息右上角', {});

    // 步骤 8: 按键盘tab键将焦点移动到展开折叠信息后应用信息右上角的[清除全部]按钮上
    // 预期: 展示文字: 清除全部
    await tabUntilTooltip('清除全部', '展开的应用信息右上角', {});

    // 步骤 9: 按键盘tab键将焦点移动到单条通知信息的[删除]按钮(鼠标悬停到任一单条通知上出现)上
    // 预期: 不需要展示文字说明
    await focusNotificationCenter();
    let terminalHovered = false;
    for (const hp of [
      '通知中心长驻区域中来自org.deepin.terminal的单条通知信息',
      '通知中心列表中显示"单条通知Tab测试"文字的单条通知行',
      '通知中心列表中位于最上方、来自终端(terminal)应用的单条通知'
    ]) {
      try {
        await agent.aiHover(hp, { deepThink: true });
        terminalHovered = true;
        console.log(`[step9] 悬停成功: ${hp}`);
        break;
      } catch (e) {
        console.log(`[step9] 悬停尝试失败: ${hp} -> ${e.message}`);
      }
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    let focusedDelete = false;
    for (let i = 0; i < 16; i++) {
      await device.pressKey('tab');
      await new Promise(resolve => setTimeout(resolve, 1200));
      focusedDelete = await agent.aiBoolean('键盘焦点位于单条通知信息右侧的删除按钮上，删除按钮有焦点高亮', { deepThink: true });
      if (focusedDelete) {
        console.log('[step9] 焦点已移动到单条通知的删除按钮上');
        break;
      }
    }
    // 检查1: 焦点确实落在[删除]按钮上（tab循环已确认时不再重复断言，避免AI对焦点高亮判断不稳定）
    if (!focusedDelete) {
      await agent.aiAssert('tab移动焦点后，键盘焦点应位于单条通知信息右侧的删除按钮上');
    }
    // 检查2: 删除按钮聚焦时不需要展示文字说明
    await agent.aiAssert('当前屏幕通知中心内所有操作按钮均只显示图标，没有任何操作按钮展示文字说明（"通知中心"是面板标题、通知正文内容文字也不属于操作按钮文字，均不算）');
  }, { timeout: 600000, tags: ['1802207', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
