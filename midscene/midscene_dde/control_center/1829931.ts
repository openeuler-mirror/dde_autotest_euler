/**
 * 用例 PMSID: 1829931
 * 用例标题: 【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换跟随鼠标位置显示后，鼠标多次在不同屏底部移动
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

describe('1829931-【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换跟随鼠标位置显示后，鼠标多次在不同屏底部移动', () => {
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

    // 扩展模式 + 跟随鼠标位置显示
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(SET_FOLLOW_MOUSE);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('已设置扩展模式 + 跟随鼠标位置显示');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1829931-【控制中心】【个性化】【任务栏】多屏-扩展模式下，切换跟随鼠标位置显示后，鼠标多次在不同屏底部移动', async ({ device, agent, uos, system }) => {
    const monitors = await device.monitors();
    const eDP = monitors.find(m => m.name === PRIMARY_MONITOR);
    const hdmi = monitors.find(m => m.name === SECONDARY_MONITOR);
    const primaryBottomY = eDP.y + eDP.height - 10;
    const primaryCenterX = eDP.x + Math.floor(eDP.width / 2);
    const secondaryBottomY = hdmi.y + hdmi.height - 10;
    const secondaryCenterX = hdmi.x + Math.floor(hdmi.width / 2);

    // 鼠标多次在不同屏底部移动，每次验证任务栏跟随（wmctrl数据断言精确校验）
    for (let i = 0; i < 3; i++) {
      console.log(`第${i + 1}次：鼠标移到副屏底部`);
      await system.exec(`xdotool mousemove ${secondaryCenterX} ${secondaryBottomY}`);
      await new Promise(resolve => setTimeout(resolve, 2500));
      const dockSec = await getDockScreen(system);
      console.log(`  任务栏所在屏: ${dockSec}`);
      if (dockSec !== 'secondary') {
        throw new Error(`第${i + 1}次：鼠标在副屏底部时任务栏应在副屏，主屏任务栏即时消失（实际=${dockSec}）`);
      }

      console.log(`第${i + 1}次：鼠标移到主屏底部`);
      await system.exec(`xdotool mousemove ${primaryCenterX} ${primaryBottomY}`);
      await new Promise(resolve => setTimeout(resolve, 2500));
      const dockPri = await getDockScreen(system);
      console.log(`  任务栏所在屏: ${dockPri}`);
      if (dockPri !== 'primary') {
        throw new Error(`第${i + 1}次：鼠标在主屏底部时任务栏应在主屏，副屏任务栏即时消失（实际=${dockPri}）`);
      }
    }
    // 循环结束后，鼠标停留在主屏底部，做一次视觉总结性断言（此时无中间日志干扰）
    await agent.aiAssert('画面左半部分（主屏）底部显示任务栏，任务栏上可见应用图标和托盘区域；画面右半部分（副屏）底部没有显示任务栏');
  }, { timeout: 600000, tags: ['1829931', 'level3'] });

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
