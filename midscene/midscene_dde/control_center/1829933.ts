/**
 * 用例 PMSID: 1829933
 * 用例标题: 【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换回"仅主屏显示"
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

describe('1829933-【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换回"仅主屏显示"', () => {
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('已设置扩展模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1829933-【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换回"仅主屏显示"', async ({ device, agent, uos, system }) => {
    const monitors = await device.monitors();
    const eDP = monitors.find(m => m.name === PRIMARY_MONITOR);
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const secBottomY = hdmi.y + hdmi.height - 10;
    const secCenterX = hdmi.x + Math.floor(hdmi.width / 2);

    // 步骤1: 任务栏展示在副屏时，再切换"多屏显示设置"选项值为【仅主屏显示】
    // 先设跟随鼠标，鼠标移到副屏底部使任务栏展示在副屏
    await system.exec(SET_FOLLOW_MOUSE);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    let dockScreen = await getDockScreen(system);
    console.log(`切换前任务栏所在屏: ${dockScreen}`);
    if (dockScreen !== 'secondary') {
      throw new Error(`任务栏应先展示在副屏（实际=${dockScreen}）`);
    }

    // 切换为"仅主屏显示"
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 预期1: 切换成功，任务栏即时更新到主屏展示
    dockScreen = await getDockScreen(system);
    console.log(`切换仅主屏后任务栏所在屏: ${dockScreen}`);
    if (dockScreen !== 'primary') {
      throw new Error(`切换仅主屏显示后，任务栏应即时更新到主屏（实际=${dockScreen}）`);
    }

    // 步骤2: 任务栏展示在主屏时，再切换"多屏显示设置"选项值为【仅主屏显示】
    await system.exec(SET_PRIMARY_ONLY);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 预期2: 切换成功，任务栏保持无变化
    dockScreen = await getDockScreen(system);
    console.log(`主屏时再次切换后任务栏所在屏: ${dockScreen}`);
    if (dockScreen !== 'primary') {
      throw new Error(`任务栏在主屏时切换仅主屏显示，应保持无变化（实际=${dockScreen}）`);
    }

    // 步骤3: 鼠标再移动到副屏底部移动，或hover
    await system.exec(`xdotool mousemove ${secCenterX} ${secBottomY}`);
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期3: 任务栏位置无变化，副屏底部不会展示任务栏
    dockScreen = await getDockScreen(system);
    console.log(`鼠标在副屏底部时任务栏所在屏: ${dockScreen}`);
    if (dockScreen !== 'primary') {
      throw new Error(`仅主屏显示模式下，副屏底部不应展示任务栏，任务栏仍在主屏（实际=${dockScreen}）`);
    }
  }, { timeout: 600000, tags: ['1829933', 'level3'] });

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
