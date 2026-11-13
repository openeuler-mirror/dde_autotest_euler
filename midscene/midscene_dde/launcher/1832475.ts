/**
 * 用例 PMSID: 1832475
 * 用例标题: 【启动器】【窗口模式】【键盘交互规则】在"我的常用"区域内点击键盘方向键切换应用
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832475-【启动器】【窗口模式】【键盘交互规则】在"我的常用"区域内点击键盘方向键切换应用', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  beforeAll(async ({ device }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式并重置键盘焦点 ==========');
    // 先确保窗口模式配置，再统一重启 dde-shell（重启会重置启动器的键盘焦点位置，
    // 避免上次会话残留的焦点导致 Tab 循环命不中"我的常用"第一个应用）
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

  test('1832475-【启动器】【窗口模式】【键盘交互规则】在"我的常用"区域内点击键盘方向键切换应用', async ({ device, agent, uos, system }) => {
    console.log('========== 用例执行开始 ==========');

    // 选中状态描述："我的常用"区域第一个应用图标（第一行第一个）带有选中高亮（蓝色边框/高亮底色）
    const FIRST_SELECTED = '启动器"我的常用"模块应用网格中第一行第一个应用图标处于选中状态（图标四周有蓝色边框或高亮底色）';

    // ── 步骤 1/5：打开启动器窗口模式 ──
    console.log('[步骤 1/5] 打开启动器窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('启动器窗口已显示');

    // ── 步骤 2/5：按 Tab 键循环，直到"我的常用"第一个应用被选中（最多 7 次）──
    console.log('[步骤 2/5] 循环按 Tab 键，直到"我的常用"模块第一个应用被选中（最多 7 次）');
    let firstSelected = false;
    for (let i = 1; i <= 7; i++) {
      await device.pressKey('Tab');
      await new Promise(resolve => setTimeout(resolve, 800));
      firstSelected = await agent.aiBoolean(FIRST_SELECTED, { deepThink: true });
      console.log(`  第 ${i} 次 Tab 后"我的常用"第一个应用选中状态: ${firstSelected}`);
      if (firstSelected) {
        break;
      }
    }
    if (!firstSelected) {
      throw new Error('按 Tab 键 7 次后，"我的常用"模块第一个应用仍未处于选中状态');
    }
    console.log('  - 验证通过：按 Tab 使"我的常用"模块第一个应用被选中');

    // ── 步骤 3/5：按两次下方向键，选中第一个应用正下方的第三个应用 ──
    console.log('[步骤 3/5] 连续按 2 次下键，断言第一个应用正下方的第三个应用被选中');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiAssert('启动器"我的常用"区域中，第一行第一个应用正下方（同一列）第三个应用图标处于选中状态（图标四周有蓝色边框或高亮底色）');
    console.log('  - 验证通过：两次下键后，第一个应用正下方的第三个应用被选中');

    // ── 步骤 4/5：按 Enter，等待 10 秒，断言应用被打开 ──
    console.log('[步骤 4/5] 按 Enter 打开选中应用，等待 10 秒');
    // 结构性验证：Enter 前后 wmctrl 窗口列表对比，检测是否弹出新应用窗口
    // （注意：选中应用可能是"截图录屏"这类全屏选区/遮罩窗口，AI 视觉容易误判为"只有桌面"，故以结构验证为准）
    const beforeWm = ((await system.exec('wmctrl -l', 5000)).stdout || '').trim();
    const beforeTitles = new Set(beforeWm.split('\n').filter(l => l.trim()).map(l => l.replace(/^\s*\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+/, '').trim()));
    console.log('  Enter 前窗口列表:\n' + (beforeWm || '(空)'));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 10000));
    const afterWm = ((await system.exec('wmctrl -l', 5000)).stdout || '').trim();
    console.log('  Enter 后窗口列表:\n' + (afterWm || '(空)'));
    const newTitles = afterWm.split('\n').filter(l => l.trim()).map(l => l.replace(/^\s*\S+\s+\S+\s+\S+\s+\S+\s+\S+\s+/, '').trim());
    const opened = newTitles.some(t => !beforeTitles.has(t));
    // AI 视觉补充验证（容忍全屏选区/遮罩类界面）
    const aiSee = await agent.aiBoolean('启动器已关闭，屏幕上出现了新的应用窗口或全屏选区遮罩（如图片/截图录制类应用的选区界面），能看到应用的内容或提示，不是单纯桌面壁纸', { deepThink: true });
    if (!(opened || aiSee)) {
      throw new Error('按 Enter 后未检测到选中应用被打开（wmctrl 未出现新窗口且 AI 视觉也未识别到）');
    }
    if (aiSee) {
      await agent.aiAssert('启动了新的应用窗口，屏幕上显示了该应用打开后的窗口内容');
    }
    console.log('  - 验证通过：选中的应用已打开 (wmctrl新窗口=' + opened + ', AI视觉=' + aiSee + ')');

    // ── 步骤 5/5：收尾关闭应用，还原桌面 ──
    console.log('[步骤 5/5] 收尾：关闭打开的应用窗口，还原桌面');
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await uos.showDesktop();
    await device.pressKey('esc');
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('  - 已关闭打开的应用并显示桌面');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832475', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 重启 dde-shell 收尾，清理本次键盘焦点/已打开应用等残留状态，避免影响下一条用例
    console.log('  - 重启 dde-shell 清理残留状态');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});