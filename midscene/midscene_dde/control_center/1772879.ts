/**
 * 用例 PMSID: 1772879
 * 用例标题: 【控制中心】【首页】【标题栏】标题栏"设置"下拉菜单项功能
 * 生成时间: 2026-09-22
 * 用例编写人: UT001707(陈慧)
 * 修复记录: 2026-09-22 修复内容:
 *   1) 打开设置下拉菜单改为"点击 + 菜单展开校验重试"，修复下拉菜单未展开导致后续菜单项定位失败的问题；
 *   2) "退出"项改为"点击 + 进程/窗口校验重试"；
 *   3) 断言措辞对齐产品实际表现（主题色彩变化）。
 */

describe('1772879-【控制中心】【首页】【标题栏】标题栏"设置"下拉菜单项功能', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1772879-【控制中心】【首页】【标题栏】标题栏"设置"下拉菜单项功能', async ({ device, agent, uos, system }) => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const MENU_BTN = '标题栏的设置按钮（"三"形/三条横线图标）';

    // 打开设置下拉菜单，并校验菜单已展开
    const openSettingMenu = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await agent.aiTap(MENU_BTN);
        } catch (e) {
          console.log('定位设置按钮失败，重试: ' + String((e && e.message) || e).split('\n')[0]);
        }
        await sleep(900);
        const opened = await agent.aiBoolean('标题栏设置按钮的下拉菜单已展开，界面中显示了菜单子项（如帮助、主题、关于、退出等）');
        if (opened) return true;
      }
      return false;
    };

    // 步骤 1: 打开控制中心，点击设置下拉菜单，再点击菜单项：帮助
    console.log('步骤 1: 打开设置下拉菜单，点击帮助');
    await uos.openApp('控制中心');
    await system.exec('W=$(xdotool search --onlyvisible --class "dde-control-center" | head -1); [ -n "$W" ] && wmctrl -i -a $W 2>/dev/null; true');
    await sleep(1000);

    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1000);
    if (!await openSettingMenu()) throw new Error('设置下拉菜单未能展开');
    await agent.aiAssert('标题栏设置按钮的下拉菜单已打开，显示菜单子项');
    // 点击帮助项并检测是否打开新窗口（帮助手册窗口）
    let helpWindowOk = false;
    for (let i = 0; i < 3 && !helpWindowOk; i++) {
      try {
        await agent.aiTap('下拉菜单中的"帮助"项', { deepThink: true });
      } catch (e) {
        console.log('定位帮助项失败，重试: ' + String((e && e.message) || e).split('\n')[0]);
      }
      await sleep(2500);
      const wl = await system.exec('wmctrl -lx');
      helpWindowOk = /dman|deepin-manual|dde-help|dde-manual/i.test(wl.stdout || '');
      if (!helpWindowOk && i === 0) {
        await device.pressKey('ESC');
        await sleep(1000);
        await openSettingMenu();
      }
    }
    if (!helpWindowOk) throw new Error('点击帮助项后未检测到帮助窗口打开');

    // 验证1: 下拉菜单消失，打开帮助窗口（激活帮助窗口后校验）
    console.log('验证1: 帮助窗口打开');
    console.log('验证1: 帮助窗口已打开（已通过窗口检测确认）');

    // 关闭帮助窗口
    await device.pressKey('alt', 'F4');
    await sleep(1200);
    await system.exec('killall dde-help 2>/dev/null; killall dman 2>/dev/null; killall deepin-manual 2>/dev/null; killall dde-control-center-helper 2>/dev/null');

    // 步骤 2: 打开设置下拉菜单，再点击菜单项：主题-浅色
    console.log('步骤 2: 打开设置下拉菜单，点击主题-浅色');
    if (!await openSettingMenu()) throw new Error('设置下拉菜单未能展开');
    // 主题为子菜单，需先悬停"主题"展开子项
    try {
      await agent.aiHover('下拉菜单中的"主题"菜单项');
    } catch (e) { console.log('悬停主题失败(可忽略)'); }
    await sleep(900);
    await agent.aiTap('下拉菜单中的"浅色"主题项', { deepThink: true });
    await sleep(1500);

    // 验证2: 浅色主题生效
    console.log('验证2: 浅色主题生效');
    let lightOk = false;
    for (let k = 0; k < 3 && !lightOk; k++) {
      try { lightOk = await agent.aiBoolean('下拉菜单已收起，控制中心窗口当前为浅色（明亮）主题显示'); } catch (e) { /* 忽略 */ }
      if (!lightOk) await sleep(800);
    }
    if (!lightOk) throw new Error('浅色主题未生效');

    // 步骤 3: 打开设置下拉菜单，再点击菜单项：主题-深色
    console.log('步骤 3: 打开设置下拉菜单，点击主题-深色');
    if (!await openSettingMenu()) throw new Error('设置下拉菜单未能展开');
    // 主题为子菜单，需先悬停"主题"展开子项
    try {
      await agent.aiHover('下拉菜单中的"主题"菜单项');
    } catch (e) { console.log('悬停主题失败(可忽略)'); }
    await sleep(900);
    await agent.aiTap('下拉菜单中的"深色"主题项', { deepThink: true });
    await sleep(1500);

    // 验证3: 深色主题生效
    console.log('验证3: 深色主题生效');
    let darkOk = false;
    for (let k = 0; k < 3 && !darkOk; k++) {
      try { darkOk = await agent.aiBoolean('下拉菜单已收起，控制中心窗口当前为深色主题显示'); } catch (e) { /* 忽略 */ }
      if (!darkOk) await sleep(800);
    }
    if (!darkOk) throw new Error('深色主题未生效');

    // 步骤 4: 打开设置下拉菜单，再点击菜单项：主题-跟随系统
    console.log('步骤 4: 打开设置下拉菜单，点击主题-跟随系统');
    if (!await openSettingMenu()) throw new Error('设置下拉菜单未能展开');
    // 主题为子菜单，需先悬停"主题"展开子项
    try {
      await agent.aiHover('下拉菜单中的"主题"菜单项');
    } catch (e) { console.log('悬停主题失败(可忽略)'); }
    await sleep(900);
    await agent.aiTap('下拉菜单中的"跟随系统"主题项', { deepThink: true });
    await sleep(1500);

    // 验证4: 跟随系统主题生效
    console.log('验证4: 跟随系统主题生效');
    let followOk = false;
    for (let k = 0; k < 3 && !followOk; k++) {
      try { followOk = await agent.aiBoolean('下拉菜单已收起，控制中心窗口按跟随系统的主题显示'); } catch (e) { /* 忽略 */ }
      if (!followOk) await sleep(800);
    }
    if (!followOk) throw new Error('跟随系统主题未生效');

    // 步骤 5: 打开设置下拉菜单，再点击菜单项：关于
    console.log('步骤 5: 打开设置下拉菜单，点击关于');
    if (!await openSettingMenu()) throw new Error('设置下拉菜单未能展开');
    await agent.aiTap('下拉菜单中的"关于"项', { deepThink: true });
    await sleep(2500);

    // 验证5: 关于弹窗打开
    console.log('验证5: 关于弹窗打开');
    await agent.aiAssert('下拉菜单已消失，"关于"弹窗已打开，显示应用图标或版本信息等内容');

    // 关闭关于弹窗
    await device.pressKey('ESC');
    await sleep(1200);

    // 步骤 6: 打开设置下拉菜单，再点击菜单项：退出
    console.log('步骤 6: 打开设置下拉菜单，点击退出');
    await device.pressKey('ESC');
    await sleep(800);
    for (let i = 0; i < 3; i++) {
      if (!await openSettingMenu()) throw new Error('设置下拉菜单未能展开');
      try {
        await agent.aiTap('下拉菜单中的"退出"项', { deepThink: true });
      } catch (e) {
        console.log('点击退出项失败，重试: ' + String((e && e.message) || e).split('\n')[0]);
      }
      await sleep(2000);
      const gone = await system.exec('xdotool search --onlyvisible --class "dde-control-center" | head -1');
      if (!(gone.stdout || '').trim()) break;
      // 兜底：按菜单项坐标点击"退出"（第4项）
      console.log('视觉点击未生效，改用菜单项坐标点击"退出"');
      const r = await system.exec('python3 /home/uos/midscene-uos-latest-x86_64/midscene_dde/probe/focus_check.py');
      const items = (r.stdout || '').split('\n').filter(l => l.startsWith('ITEM=menu item|'));
      const last = items[items.length - 1];
      const m = /ITEM=menu item\|[^|]*\|[^|]*\|(\d+),(\d+),(\d+),(\d+)/.exec(last || '');
      if (m) {
        await system.exec(`xdotool mousemove ${(+m[1]) + (+m[3]) / 2} ${(+m[2]) + (+m[4]) / 2} click 1`);
        await sleep(2000);
        const gone2 = await system.exec('xdotool search --onlyvisible --class "dde-control-center" | head -1');
        if (!(gone2.stdout || '').trim()) break;
      }
    }

    // 验证6: 控制中心关闭
    console.log('验证6: 控制中心关闭');
    await agent.aiAssert('控制中心程序已关闭，桌面上不再显示控制中心窗口');

  }, { timeout: 600000, tags: ['1772879', 'level3', 'control_center'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await system.exec('killall dde-control-center 2>/dev/null');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
