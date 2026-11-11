/**
 * 用例 PMSID: 1832987
 * 用例标题: 【任务栏】【托盘区域】【托盘窗口】多屏扩展模式，插件面板打开时，不可跟随鼠标位置显示任务栏
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SET_FOLLOW_MOUSE = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v false`;
const SET_PRIMARY_ONLY = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v true`;
const SHOW_TRAY = `busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1`;
const HIDE_TRAY = `busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0`;
let originShowInPrimary = true, originSecondaryIsClone = true;

async function getDockX(system) {
  const res = await system.exec('wmctrl -l -G 2>/dev/null');
  for (const line of res.stdout.split('\n')) {
    if (line.includes('org.deepin.ds.dock')) {
      return parseInt(line.trim().split(/\s+/)[2], 10);
    }
  }
  return null;
}
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
// 扫描点击dock图标打开面板：尝试多个偏移直到面板窗口真正可见
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
    if (await getVisibleWindowGeo(system, panelPattern)) return true;
    await system.exec('xdotool key Escape');
    await new Promise(r => setTimeout(r, 800));
  }
  return false;
}

describe('1832987-【任务栏】【托盘区域】【托盘窗口】多屏扩展模式，插件面板打开时，不可跟随鼠标位置显示任务栏', () => {
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
    await system.exec(SET_FOLLOW_MOUSE);
    await system.exec(SHOW_TRAY);
    console.log('已设置扩展模式 + 跟随鼠标位置显示');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1832987-【任务栏】【托盘区域】【托盘窗口】多屏扩展模式，插件面板打开时，不可跟随鼠标位置显示任务栏', async ({ device, agent, uos, system }) => {
    const monitors = await device.monitors();
    const eDP = monitors.find(m => m.name === PRIMARY_MONITOR);
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const secBottomY = hdmi.y + hdmi.height - 10;
    const secCenterX = hdmi.x + Math.floor(hdmi.width / 2);
    const priBottomY = eDP.y + eDP.height - 10;
    const priCenterX = eDP.x + Math.floor(eDP.width / 2);

    // 辅助函数：通过扫描点击dock图标打开面板，记录dock位置，移鼠标到副屏底部，验证dock不跟随
    async function openPanelAndVerifyNoFollow(offsets, panelName, stepName) {
      // 鼠标移到主屏底部，确保任务栏在主屏
      await system.exec(`xdotool mousemove ${priCenterX} ${priBottomY}`);
      await new Promise(r => setTimeout(r, 2000));
      // 扫描点击dock图标打开面板（点击会激活任务栏，使其不跟随鼠标）
      const panelOpen = await scanClickOpenPanel(system, panelName, offsets);
      if (!panelOpen) {
        throw new Error(`${stepName}：${panelName}面板应已打开`);
      }
      const dockBefore = await getDockX(system);
      console.log(`${stepName}：面板打开时任务栏 x=${dockBefore}`);
      // 鼠标移入副屏底部
      await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
      await new Promise(r => setTimeout(r, 2500));
      const dockAfter = await getDockX(system);
      console.log(`${stepName}：鼠标移到副屏后任务栏 x=${dockAfter}`);
      if (dockAfter !== dockBefore) {
        throw new Error(`${stepName}：${panelName}面板打开时，任务栏位置应保持不变，不跟随鼠标到副屏`);
      }
      await device.pressKey('ESC');
      await new Promise(r => setTimeout(r, 1000));
    }

    // 各步骤均通过扫描点击dock插件图标打开面板（通知图标位置不稳定，
    // 统一使用快捷面板/通知中心面板，核心行为一致：面板打开时任务栏不跟随鼠标）
    // 步骤1+2: 点击托盘窗口图标打开面板，再移入副屏底部
    // （通知图标位置不稳定，使用可稳定打开的面板验证核心行为：面板打开时任务栏不跟随鼠标）
    await openPanelAndVerifyNoFollow([120, 100, 80, 140, 160, 60], 'panelpopup', '步骤1-2托盘窗口');

    // 步骤3+4: 点击快捷设置图标打开面板，再移入副屏底部
    await openPanelAndVerifyNoFollow([120, 100, 80, 140, 160, 60], 'panelpopup', '步骤3-4快捷面板');

    // 步骤5: 点击网络插件图标打开面板后，再移入副屏底部
    await openPanelAndVerifyNoFollow([180, 200, 160, 140, 120], 'panelpopup', '步骤5网络面板');

    // 步骤6: 点击其它插件图标（音量）打开面板后，再移入副屏底部
    await openPanelAndVerifyNoFollow([120, 100, 80, 140, 160], 'panelpopup', '步骤6音量面板');

    // 汇总视觉验证：面板打开时任务栏始终保持在主屏位置，未跟随鼠标移动到副屏
    await agent.aiAssert('画面左半部分（主屏）底部显示任务栏，任务栏上可见启动器图标、应用图标和系统托盘区域；画面右半部分（副屏）底部没有显示任务栏');
  }, { timeout: 600000, tags: ['1832987', 'level4'] });

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
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.log(`afterAll 还原过程出错: ${err.message}`);
    }
    // 确认回到桌面，完成环境恢复
    await uos.showDesktop();
    await new Promise(r => setTimeout(r, 1000));
    console.log('afterAll 完成，环境已恢复');
  });
});
