/**
 * 用例 PMSID: 1832479
 * 用例标题: 【启动器】【窗口模式】【键盘交互规则】在"应用列表"区域内点击键盘方向键切换应用
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832479-【启动器】【窗口模式】【键盘交互规则】在"应用列表"区域内点击键盘方向键切换应用', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  // 目标区域：启动器左侧竖向应用列表（"我的常用"区域的左侧那一列，一条一行列出应用，不是右侧的"我的常用"图标网格）
  const LIST_AREA = '启动器窗口左侧的竖向应用列表区域（位于"我的常用"区域左侧，一列一行地竖向排列应用条目；不是右侧的"我的常用"图标网格，也不是最左侧快捷访问小图标列）';

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 前置条件：重启 dde-shell，保证键盘焦点/选择状态干净
    console.log('  - 前置：重启 dde-shell');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式并重置键盘焦点 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
    } else {
      console.log('  - 已是窗口模式');
    }
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('ESC');
  });

  test('1832479-【启动器】【窗口模式】【键盘交互规则】在"应用列表"区域内点击键盘方向键切换应用', async ({ device, agent, uos, system }) => {
    console.log('========== 用例执行开始 ==========');

    // 将鼠标移到桌面右上角空白色区域，去除鼠标悬停高亮，避免其被误判为键盘选中
    const moveMouseAway = async () => {
      await system.exec('DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority xdotool mousemove 1850 150');
      await new Promise(resolve => setTimeout(resolve, 400));
    };

    // 连续按键（每次之间留间隔，确保 QML 处理完移动）
    const pressMove = async (key, times) => {
      for (let i = 0; i < times; i++) {
        await device.pressKey(key);
        await new Promise(resolve => setTimeout(resolve, 450));
      }
      await new Promise(resolve => setTimeout(resolve, 700));
    };

    // ── 步骤 1/4：打开启动器窗口模式 ──
    console.log('[步骤 1/4] 打开启动器窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('启动器窗口已显示');

    // ── 步骤 2/4：按 Tab 键切换到左侧应用列表区域（最多 10 次）──
    console.log('[步骤 2/4] 循环按 Tab 键，直到焦点切换到左侧应用列表区域（最多 10 次）');
    // 先移开鼠标，避免鼠标悬停高亮干扰“选中状态”判定
    await moveMouseAway();
    let got = false;
    for (let i = 1; i <= 10; i++) {
      await device.pressKey('Tab');
      await new Promise(resolve => setTimeout(resolve, 800));
      got = await agent.aiBoolean(`${LIST_AREA}中有应用条目处于选中状态（有蓝色边框或高亮选中底色）`, { deepThink: true });
      console.log(`  第 ${i} 次 Tab 后左侧应用列表选中状态: ${got}`);
      if (got) {
        break;
      }
    }
    if (!got) {
      throw new Error('按 Tab 键 10 次后，焦点未切换到左侧应用列表区域');
    }
    console.log('  - Tab 后左侧应用列表出现选中项，键盘焦点已进入列表');

    // ── 步骤 3/4：下键 3 次断言第 4 个应用被选中；上键 5 次断言顶部应用被选中 ──
    // 键盘焦点偶发未真正落到列表 + AI 视觉偶发误判，故带重试：移开鼠标→上键回顶→下键 3 次→位置断言，失败则重新 Tab 聚焦后重试
    console.log('[步骤 3/4] 下键 3 次断言第 4 个应用选中，上键 5 次断言顶部应用选中');
    const POS4 = `${LIST_AREA} 中从上往下第4个应用条目处于选中状态（应用条目四周有蓝色边框或高亮选中底色）`;
    const POS_TOP = `${LIST_AREA} 中顶部第一个（最上面）应用条目处于选中状态（应用条目四周有蓝色边框或高亮选中底色）`;

    let fourthOk = false;
    for (let round = 1; round <= 3 && !fourthOk; round++) {
      await moveMouseAway();
      await pressMove('Up', 8);   // 回到列表顶部
      await pressMove('Down', 3); // 移动到第 4 个
      try {
        await agent.aiAssert(POS4);
        fourthOk = true;
      } catch (err) {
        console.log(`  第 ${round} 轮：下键 3 次后第 4 个应用校验未通过，重新 Tab 聚焦后重试`);
        await device.pressKey('Tab');
        await new Promise(resolve => setTimeout(resolve, 700));
      }
    }
    if (!fourthOk) {
      throw new Error('下键 3 次后第 4 个应用未被选中（重试 3 次仍失败）');
    }
    console.log('  - 验证通过：下键 3 次后第 4 个应用被选中');

    let topOk = false;
    for (let round = 1; round <= 3 && !topOk; round++) {
      await pressMove('Up', 5);
      try {
        await agent.aiAssert(POS_TOP);
        topOk = true;
      } catch (err) {
        console.log(`  第 ${round} 轮：上键 5 次后顶部应用校验未通过，重新 Tab 聚焦后重试`);
        await device.pressKey('Tab');
        await new Promise(resolve => setTimeout(resolve, 700));
      }
    }
    if (!topOk) {
      throw new Error('上键 5 次后顶部应用未被选中（重试 3 次仍失败）');
    }
    console.log('  - 验证通过：上键 5 次后顶部应用被选中');

    // ── 步骤 4/4：按 Enter 打开顶部应用，等待 10 秒断言应用被打开 ──
    console.log('[步骤 4/4] 按 Enter 打开顶部应用，等待 10 秒');
    const beforeWm = ((await system.exec('wmctrl -l', 5000)).stdout || '').trim();
    const beforeTitles = new Set(beforeWm.split('\n').filter(l => l.trim()).map(l => l.replace(/^\s*\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+/, '').trim()));
    console.log('  Enter 前窗口列表:\n' + (beforeWm || '(空)'));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 10000));
    const afterWm = ((await system.exec('wmctrl -l', 5000)).stdout || '').trim();
    console.log('  Enter 后窗口列表:\n' + (afterWm || '(空)'));
    const afterTitles = afterWm.split('\n').filter(l => l.trim()).map(l => l.replace(/^\s*\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+/, '').trim());
    const openedWin = afterTitles.find(t => !beforeTitles.has(t)) || '';
    const aiSee = await agent.aiBoolean('启动了新的应用窗口，屏幕上显示该应用打开后的窗口内容（能看到窗口标题栏或应用界面）', { deepThink: true });
    if (!(openedWin || aiSee)) {
      throw new Error('按 Enter 后未检测到顶部应用被打开（wmctrl 未出现新窗口且 AI 视觉也未识别到）');
    }
    if (aiSee) {
      await agent.aiAssert('屏幕上显示了一个应用窗口（可见窗口标题栏或应用界面内容）');
    }
    console.log(`  - 验证通过：顶部应用已打开 (新窗口="${openedWin}", AI视觉=${aiSee})`);

    // ── 收尾：关闭应用窗口，显示桌面 ──
    console.log('[收尾] 关闭打开的应用窗口');
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await uos.showDesktop();
    await device.pressKey('esc');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832479', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    // 兜底关闭可能残留的应用窗口
    const wm = ((await system.exec('wmctrl -l', 5000)).stdout || '');
    const extra = wm.split('\n').filter(l => !l.includes('桌面') && !l.includes('org.deepin.ds.dock') && l.trim());
    for (const line of extra) {
      const wid = line.trim().split(/\s+/)[0];
      await system.exec(`wmctrl -ic ${wid} 2>/dev/null`, 3000);
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 重启 dde-shell 收尾，避免键盘焦点/残留状态影响下一条用例
    console.log('  - 重启 dde-shell 清理残留状态');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});