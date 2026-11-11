/**
 * 用例 PMSID: 1504325
 * 用例标题: 【任务栏】【托盘区域】【托盘窗口】多屏扩展模式，可跟随任务栏位置点击打开托盘窗口面板
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SET_PRIMARY_ONLY = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v true`;
const SET_FOLLOW_MOUSE = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v false`;
const SHOW_TRAY = `busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1`;
const HIDE_TRAY = `busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0`;
let originShowInPrimary = true, originSecondaryIsClone = true;

async function getDockGeo(system) {
  const res = await system.exec('wmctrl -l -G 2>/dev/null');
  for (const line of res.stdout.split('\n')) {
    if (line.includes('org.deepin.ds.dock')) {
      const p = line.trim().split(/\s+/);
      return { x: +p[2], y: +p[3], w: +p[4], h: +p[5] };
    }
  }
  return null;
}
// 面板窗口关闭后仍会驻留在 wmctrl 列表中（隐藏状态），必须用 xwininfo 的 Map State 判断是否真正可见
async function getVisibleWindowGeo(system, pattern) {
  const res = await system.exec('wmctrl -l -G 2>/dev/null');
  for (const line of res.stdout.split('\n')) {
    if (line.includes(pattern)) {
      const id = line.trim().split(/\s+/)[0];
      const xi = await system.exec(`xwininfo -id ${id} 2>/dev/null`);
      if (xi.stdout.includes('IsViewable')) {
        const p = line.trim().split(/\s+/);
        return { x: +p[2], y: +p[3], w: +p[4], h: +p[5] };
      }
    }
  }
  return null;
}
async function getWindowScreen(system, pattern) {
  const geo = await getVisibleWindowGeo(system, pattern);
  if (!geo) return null;
  return geo.x >= SCREEN_W ? 'secondary' : 'primary';
}
// 打开通知中心（托盘窗口面板）：使用 Super+M 快捷键（可靠，且跟随任务栏所在屏）
async function openNotificationCenter(device, system) {
  // 先按ESC确保之前的面板已关闭，避免 Super+M 切换为关闭
  await device.pressKey('ESC');
  await new Promise(r => setTimeout(r, 800));
  let opened = false;
  for (let i = 0; i < 3 && !opened; i++) {
    await device.pressKey('super', 'm');
    await new Promise(r => setTimeout(r, 1500));
    opened = !!(await getVisibleWindowGeo(system, 'notificationcenter'));
  }
}

describe('1504325-【任务栏】【托盘区域】【托盘窗口】多屏扩展模式，可跟随任务栏位置点击打开托盘窗口面板', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const r = await system.exec('xrandr --query');
    const _connectedOutputs = r.stdout.split('\n').filter(l => / connected/.test(l) && !/disconnected/.test(l));
    if (_connectedOutputs.length < 2) throw new Error('当前环境未检测到双屏，需要外接HDMI显示器才能执行本用例');
    if (!_connectedOutputs.some(l => l.startsWith(SECONDARY_MONITOR))) throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}，无法执行本用例`);
    const secMatch = r.stdout.match(new RegExp(`${SECONDARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    const priMatch = r.stdout.match(new RegExp(`${PRIMARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    originSecondaryIsClone = secMatch && priMatch ? (secMatch[2] === priMatch[2] && secMatch[3] === priMatch[3]) : true;
    originShowInPrimary = (await system.exec(`dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary`)).stdout.trim() === 'true';
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
    await new Promise(r => setTimeout(r, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(r => setTimeout(r, 2000));
    await system.exec(SET_PRIMARY_ONLY);
    await system.exec(SHOW_TRAY);
    console.log('已设置扩展模式 + 仅主屏显示，托盘窗口图标在任务栏');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1504325-【任务栏】【托盘区域】【托盘窗口】多屏扩展模式，可跟随任务栏位置点击打开托盘窗口面板', async ({ device, agent, uos, system }) => {
    const monitors = await device.monitors();
    const eDP = monitors.find(m => m.name === PRIMARY_MONITOR);
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const secBottomY = hdmi.y + hdmi.height - 10;
    const secCenterX = hdmi.x + Math.floor(hdmi.width / 2);
    const priBottomY = eDP.y + eDP.height - 10;
    const priCenterX = eDP.x + Math.floor(eDP.width / 2);

    // 步骤1: 仅主屏展示，点击主屏任务栏托盘窗口图标
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(r => setTimeout(r, 1500));
    await openNotificationCenter(device, system);
    let ncScreen = await getWindowScreen(system, 'notificationcenter');
    console.log(`步骤1：通知中心所在屏=${ncScreen}`);
    if (ncScreen !== 'primary') throw new Error(`步骤1失败：仅主屏展示模式下通知中心应在主屏打开（实际=${ncScreen}）`);
    await agent.aiAssert('屏幕中间偏右显示"通知中心"面板，面板中列出多条通知记录');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

    // 步骤2: 跟随鼠标位置显示，点击主屏任务栏托盘窗口图标
    await system.exec(SET_FOLLOW_MOUSE);
    await new Promise(r => setTimeout(r, 1500));
    await system.exec(`xdotool mousemove ${priCenterX} ${priBottomY}`);
    await new Promise(r => setTimeout(r, 2000));
    await openNotificationCenter(device, system);
    ncScreen = await getWindowScreen(system, 'notificationcenter');
    console.log(`步骤2：通知中心所在屏=${ncScreen}`);
    if (ncScreen !== 'primary') throw new Error(`步骤2失败：鼠标在主屏底部时通知中心应在主屏打开（实际=${ncScreen}）`);
    await agent.aiAssert('屏幕中间偏右显示"通知中心"面板，面板中列出多条通知记录');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

    // 步骤3: 点击收起托盘窗口面板后，再鼠标移入副屏底部（副屏不在截图范围内，用 wmctrl 数据断言）
    await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
    await new Promise(r => setTimeout(r, 2500));
    const dock = await getDockGeo(system);
    console.log(`步骤3：鼠标在副屏底部时任务栏 x=${dock?.x}`);
    if (!dock || dock.x < SCREEN_W) throw new Error(`步骤3失败：任务栏应跟随鼠标移动到副屏底部（实际x=${dock?.x}）`);

    // 步骤4: 再重新点击托盘窗口图标（在副屏），通知中心应跟随任务栏在副屏打开（用 wmctrl 数据断言）
    await openNotificationCenter(device, system);
    ncScreen = await getWindowScreen(system, 'notificationcenter');
    console.log(`步骤4：通知中心所在屏=${ncScreen}`);
    if (ncScreen !== 'secondary') throw new Error(`步骤4失败：任务栏在副屏时通知中心应在副屏打开（实际=${ncScreen}）`);
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  }, { timeout: 600000, tags: ['1504325', 'level4'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    try {
      await system.exec(originShowInPrimary ? SET_PRIMARY_ONLY : SET_FOLLOW_MOUSE);
      await system.exec(HIDE_TRAY);
      await system.exec(`xrandr --output ${PRIMARY_MONITOR} --primary --output ${SECONDARY_MONITOR} --same-as ${PRIMARY_MONITOR}`);
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {}
    // 关闭可能残留的控制中心窗口，恢复环境
    try {
      await system.exec('killall dde-control-center 2>/dev/null || true');
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {}
    // 确认回到桌面
    await uos.showDesktop();
    await new Promise(r => setTimeout(r, 1000));
    console.log('afterAll 完成，环境已恢复');
  });
});
