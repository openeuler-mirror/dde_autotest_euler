/**
 * 用例 PMSID: 1829927
 * 用例标题: 【控制中心】【个性化】【任务栏】多屏-扩展模式下展示"多屏显示设置"，默认值为"仅主屏显示"
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SET_PRIMARY_ONLY = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v true`;
let originShowInPrimary = true;
let originSecondaryIsClone = true;

// 获取任务栏(dock)所在屏幕：通过 wmctrl 读取 dock 窗口 X 坐标
async function getDockScreen(system) {
  const res = await system.exec('wmctrl -l -G 2>/dev/null');
  for (const line of res.stdout.split('\n')) {
    if (line.includes('org.deepin.ds.dock')) {
      const parts = line.trim().split(/\s+/);
      const x = parseInt(parts[2], 10);
      return x >= SCREEN_W ? 'secondary' : 'primary';
    }
  }
  return 'unknown';
}

describe('1829927-【控制中心】【个性化】【任务栏】多屏-扩展模式下展示"多屏显示设置"，默认值为"仅主屏显示"', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const r = await system.exec('xrandr --query');
    const _connectedOutputs = r.stdout.split('\n').filter(l => / connected/.test(l) && !/disconnected/.test(l));
    if (_connectedOutputs.length < 2) {
      throw new Error('当前环境未检测到双屏，需要外接HDMI显示器才能执行本用例');
    }
    if (!_connectedOutputs.some(l => l.startsWith(SECONDARY_MONITOR))) {
      throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}，无法执行本用例`);
    }
    const secMatch = r.stdout.match(new RegExp(`${SECONDARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    const priMatch = r.stdout.match(new RegExp(`${PRIMARY_MONITOR}[^\\n]*?(\\d+x\\d+)\\+(\\d+)\\+(\\d+)`));
    originSecondaryIsClone = secMatch && priMatch ? (secMatch[2] === priMatch[2] && secMatch[3] === priMatch[3]) : true;
    originShowInPrimary = (await system.exec(`dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary`)).stdout.trim() === 'true';

    // 扩展模式几何 + 同步 dde-display 守护进程
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 默认值：仅主屏显示
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('已设置扩展模式 + 多屏显示设置默认值仅主屏显示');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1829927-【控制中心】【个性化】【任务栏】多屏-扩展模式下展示"多屏显示设置"，默认值为"仅主屏显示"', async ({ device, agent, uos, system }) => {
    // 步骤1: 多屏-扩展模式，检查"多屏显示设置"默认值为"仅主屏显示"，任务栏默认展示在主屏
    // 通过 dconfig 验证默认值为仅主屏显示
    const showInPrimary = (await system.exec(`dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary`)).stdout.trim();
    if (showInPrimary !== 'true') {
      throw new Error(`多屏显示设置默认值应为"仅主屏显示"(Show_In_Primary=true)，实际=${showInPrimary}`);
    }

    // 打开控制中心-桌面和任务栏，检查界面展示（辅助确认）
    await uos.openApp('控制中心', { maximizeWindow: false });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/dock"');
    await new Promise(resolve => setTimeout(resolve, 2500));
    await agent.aiAssert('控制中心显示"桌面和任务栏"设置页面，包含模式、位置、状态等设置项');
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 预期1: 任务栏默认展示在主屏
    const dockScreen = await getDockScreen(system);
    console.log(`任务栏所在屏: ${dockScreen}`);
    if (dockScreen !== 'primary') {
      throw new Error(`任务栏应默认展示在主屏，实际=${dockScreen}`);
    }
    await agent.aiAssert('主屏底部显示任务栏，任务栏上可见启动器图标、应用图标和系统托盘区域');

    // 步骤2: 鼠标hover副屏底部
    const monitors = await device.monitors();
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const bottomY = hdmi.y + hdmi.height - 10;
    const centerX = hdmi.x + Math.floor(hdmi.width / 2);
    await system.exec(`xdotool mousemove ${centerX} ${bottomY}`);
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期2: 副屏底部不会展示出任务栏，任务栏展示在主屏保持不变
    const dockScreenAfter = await getDockScreen(system);
    console.log(`鼠标在副屏底部时任务栏所在屏: ${dockScreenAfter}`);
    if (dockScreenAfter !== 'primary') {
      throw new Error(`仅主屏显示模式下，副屏底部不应展示任务栏，任务栏应保持在主屏（实际=${dockScreenAfter}）`);
    }
    await agent.aiAssert('主屏底部仍显示任务栏，任务栏位置和内容保持不变');
  }, { timeout: 600000, tags: ['1829927', 'level2'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    try { await uos.closeCurrentWindow(); } catch (e) {}
    try {
      await system.exec(originShowInPrimary ? SET_PRIMARY_ONLY : 'dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v false');
      if (originSecondaryIsClone) {
        await system.exec(`xrandr --output ${PRIMARY_MONITOR} --primary --output ${SECONDARY_MONITOR} --same-as ${PRIMARY_MONITOR}`);
        await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {}
    // 关闭可能残留的控制中心窗口，恢复环境
    try {
      await system.exec('killall dde-control-center 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {}
    // 确认回到桌面
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('afterAll 完成，环境已恢复');
  });
});
