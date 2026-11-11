/**
 * 用例 PMSID: 1829929
 * 用例标题: 【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换跟随鼠标位置显示
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SET_PRIMARY_ONLY = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v true`;
const SET_FOLLOW_MOUSE = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Show_In_Primary -v false`;
let originShowInPrimary = true;
let originSecondaryIsClone = true;

async function getDockScreen(system) {
  const res = await system.exec('wmctrl -l -G 2>/dev/null');
  for (const line of res.stdout.split('\n')) {
    if (line.includes('org.deepin.ds.dock')) {
      const x = parseInt(line.trim().split(/\s+/)[2], 10);
      return x >= SCREEN_W ? 'secondary' : 'primary';
    }
  }
  return 'unknown';
}

describe('1829929-【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换跟随鼠标位置显示', () => {
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

    // 扩展模式 + 仅主屏显示（默认）
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('已设置扩展模式 + 默认仅主屏显示');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1829929-【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换跟随鼠标位置显示', async ({ device, agent, uos, system }) => {
    const monitors = await device.monitors();
    const eDP = monitors.find(m => m.name === PRIMARY_MONITOR);
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const priCenterX = eDP.x + Math.floor(eDP.width / 2);
    const priCenterY = eDP.y + Math.floor(eDP.height / 2);
    const secBottomY = hdmi.y + hdmi.height - 10;
    const secCenterX = hdmi.x + Math.floor(hdmi.width / 2);

    // 步骤1: 切换"多屏显示设置"选项值为【跟随鼠标位置显示】（通过 dconfig）
    await system.exec(SET_FOLLOW_MOUSE);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 先将鼠标移到主屏底部，确保任务栏在主屏（跟随模式下任务栏跟随鼠标所在屏的底部）
    const priBottomY = eDP.y + eDP.height - 10;
    await system.exec(`xdotool mousemove ${priCenterX} ${priBottomY}`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    let dockPre = await getDockScreen(system);
    console.log(`鼠标在主屏底部时任务栏所在屏: ${dockPre}`);

    // 预期1: 切换成功，任务栏暂无变化（当前鼠标不在各屏底部时）
    // 鼠标移到主屏中部（非底部），任务栏应保持在主屏不变
    await system.exec(`xdotool mousemove ${priCenterX} ${priCenterY}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const dockScreenMid = await getDockScreen(system);
    console.log(`切换后鼠标在主屏中部时任务栏所在屏: ${dockScreenMid}`);
    if (dockScreenMid !== 'primary') {
      throw new Error(`切换跟随鼠标后，鼠标不在屏底时任务栏暂无变化，仍在主屏（实际=${dockScreenMid}）`);
    }
    await agent.aiAssert('主屏底部显示任务栏，任务栏上可见启动器图标、应用图标和系统托盘区域');

    // 步骤2: 鼠标hover副屏底部
    await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期2: 当前鼠标所在的屏(副屏)底部会更新显示任务栏，另一屏(主屏)的任务栏即时消失
    const dockScreenSec = await getDockScreen(system);
    console.log(`鼠标在副屏底部时任务栏所在屏: ${dockScreenSec}`);
    if (dockScreenSec !== 'secondary') {
      throw new Error(`跟随鼠标模式下，鼠标在副屏底部时任务栏应更新到副屏（实际=${dockScreenSec}）`);
    }
    await agent.aiAssert('画面左半部分（主屏）底部没有显示任务栏，主屏显示桌面壁纸和桌面图标；画面右半部分（副屏）底部显示任务栏，任务栏上可见应用图标和托盘区域');
  }, { timeout: 600000, tags: ['1829929', 'level2'] });

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
