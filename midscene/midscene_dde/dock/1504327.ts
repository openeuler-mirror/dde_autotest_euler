/**
 * 用例 PMSID: 1504327
 * 用例标题: 【任务栏】【快捷面板】多屏扩展模式，可跟随任务栏位置点击打开快捷面板
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SET_PRIMARY_ONLY = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v true`;
const SET_FOLLOW_MOUSE = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v false`;
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
// 快捷面板为竖版弹窗（约330x470，高>宽），托盘其他弹窗为横版（500x300）或方形（94x94），用宽高比区分
function isQuickPanelGeo(geo) {
  return !!geo && geo.h > geo.w * 1.2 && geo.w >= 200;
}
// 查找可见的快捷面板窗口并返回其所在屏幕（'primary'/'secondary'），未找到返回 null
async function getQuickPanelScreen(system) {
  const geo = await getVisibleWindowGeo(system, 'panelpopup');
  if (!isQuickPanelGeo(geo)) return null;
  return geo.x >= SCREEN_W ? 'secondary' : 'primary';
}
// 扫描点击dock图标打开快捷面板：尝试多个偏移，直到竖版快捷面板真正可见
async function scanClickOpenPanel(system, panelPattern, offsets) {
  const dock = await getDockGeo(system);
  if (!dock) return false;
  const y = dock.y + Math.floor(dock.h / 2);
  for (const off of offsets) {
    const x = dock.x + dock.w - off;
    await system.exec(`xdotool mousemove ${x} ${y}`);
    await new Promise(r => setTimeout(r, 300));
    await system.exec('xdotool click 1');
    await new Promise(r => setTimeout(r, 1800));
    const geo = await getVisibleWindowGeo(system, panelPattern);
    if (isQuickPanelGeo(geo)) return true;
    await system.exec('xdotool key Escape');
    await new Promise(r => setTimeout(r, 800));
  }
  return false;
}

describe('1504327-【任务栏】【快捷面板】多屏扩展模式，可跟随任务栏位置点击打开快捷面板', () => {
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
    console.log('已设置扩展模式 + 仅主屏显示');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1504327-【任务栏】【快捷面板】多屏扩展模式，可跟随任务栏位置点击打开快捷面板', async ({ device, agent, uos, system }) => {
    const monitors = await device.monitors();
    const eDP = monitors.find(m => m.name === PRIMARY_MONITOR);
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const secBottomY = hdmi.y + hdmi.height - 10;
    const secCenterX = hdmi.x + Math.floor(hdmi.width / 2);
    const priBottomY = eDP.y + eDP.height - 10;
    const priCenterX = eDP.x + Math.floor(eDP.width / 2);

    // 步骤1: 仅主屏展示，点击主屏任务栏快捷面板图标
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(r => setTimeout(r, 1500));
    const ok1 = await scanClickOpenPanel(system, "panelpopup", [140, 120, 100, 80, 160, 60]);
    if (!ok1) throw new Error('步骤1失败：未能通过点击任务栏图标打开快捷面板');
    let qpScreen = await getQuickPanelScreen(system);
    console.log(`步骤1：快捷面板所在屏=${qpScreen}`);
    if (qpScreen !== 'primary') throw new Error(`步骤1失败：仅主屏展示模式下快捷面板应在主屏打开（实际=${qpScreen}）`);
    await agent.aiAssert('屏幕右下角显示展开的快捷面板，包含无线网络、蓝牙、多屏显示等功能选项及亮度、音量调节条');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

    // 步骤2: 跟随鼠标位置显示，点击主屏任务栏快捷面板图标
    await system.exec(SET_FOLLOW_MOUSE);
    await new Promise(r => setTimeout(r, 1500));
    await system.exec(`xdotool mousemove ${priCenterX} ${priBottomY}`);
    await new Promise(r => setTimeout(r, 2000));
    const ok2 = await scanClickOpenPanel(system, "panelpopup", [140, 120, 100, 80, 160, 60]);
    if (!ok2) throw new Error('步骤2失败：未能通过点击任务栏图标打开快捷面板');
    qpScreen = await getQuickPanelScreen(system);
    console.log(`步骤2：快捷面板所在屏=${qpScreen}`);
    if (qpScreen !== 'primary') throw new Error(`步骤2失败：鼠标在主屏底部时快捷面板应在主屏打开（实际=${qpScreen}）`);
    await agent.aiAssert('屏幕右下角显示展开的快捷面板，包含无线网络、蓝牙、多屏显示等功能选项及亮度、音量调节条');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

    // 步骤3: 打开快捷面板后，再鼠标移入副屏底部（副屏不在截图内，用 wmctrl 数据断言）
    const ok3 = await scanClickOpenPanel(system, "panelpopup", [140, 120, 100, 80, 160, 60]);
    if (!ok3) throw new Error('步骤3失败：未能通过点击任务栏图标打开快捷面板');
    await new Promise(r => setTimeout(r, 1000));
    const dockDuringPanel = await getDockGeo(system);
    await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
    await new Promise(r => setTimeout(r, 2500));
    const dockAfterMove = await getDockGeo(system);
    console.log(`步骤3：面板打开时dock x=${dockDuringPanel?.x}，移到副屏后dock x=${dockAfterMove?.x}`);
    // 预期3: 任务栏上有快捷面板时，不会跟随鼠标展现到副屏
    if (!dockDuringPanel || !dockAfterMove) throw new Error('步骤3失败：未获取到任务栏窗口信息');
    if (dockAfterMove.x !== dockDuringPanel.x || dockAfterMove.x >= SCREEN_W) {
      throw new Error(`步骤3失败：快捷面板打开时任务栏位置应保持不变且不跟随鼠标到副屏（面板打开时x=${dockDuringPanel.x}，移动后x=${dockAfterMove.x}）`);
    }
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

    // 步骤4: 点击收起快捷面板后，再鼠标移入副屏底部（用 wmctrl 数据断言）
    // 先在副屏中部点击桌面（解除任务栏焦点），再移到副屏底部触发跟随
    await system.exec(`xdotool mousemove ${secCenterX} ${hdmi.y + Math.floor(hdmi.height / 2)}`);
    await new Promise(r => setTimeout(r, 800));
    await system.exec('xdotool click 1');
    await new Promise(r => setTimeout(r, 1000));
    await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
    await new Promise(r => setTimeout(r, 3000));
    const dockFollow = await getDockGeo(system);
    console.log(`步骤4：收起面板后移到副屏，dock x=${dockFollow?.x}`);
    if (!dockFollow || dockFollow.x < SCREEN_W) {
      throw new Error(`步骤4失败：收起快捷面板后任务栏应跟随鼠标移动到副屏底部（实际x=${dockFollow?.x}）`);
    }

    // 步骤5: 再重新点击副屏任务栏快捷面板图标（用 wmctrl 数据断言）
    const ok5 = await scanClickOpenPanel(system, "panelpopup", [140, 120, 100, 80, 160, 60]);
    if (!ok5) throw new Error('步骤5失败：未能通过点击副屏任务栏图标打开快捷面板');
    qpScreen = await getQuickPanelScreen(system);
    console.log(`步骤5：快捷面板所在屏=${qpScreen}`);
    if (qpScreen !== 'secondary') throw new Error(`步骤5失败：任务栏在副屏时快捷面板应在副屏打开（实际=${qpScreen}）`);
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  }, { timeout: 600000, tags: ['1504327', 'level4'] });

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
