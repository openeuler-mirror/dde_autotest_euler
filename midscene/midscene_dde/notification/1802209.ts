/**
 * 用例 PMSID: 1802209
 * 用例标题: 【通知中心】多屏扩展模式通知横幅和通知只在主屏显示
 * 生成时间: 2026-09-03
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';
const SCREEN_W = 1920;
const SCREEN_H = 1080;
const BANNER_TIMEOUT_MS = 12000;

describe('1802209-【通知中心】多屏扩展模式通知横幅和通知只在主屏显示', () => {
  // 设置扩展模式：eDP 在左 0x0，HDMI 在右 1920x0，并指定主屏
  async function setExtendedMode(system, primaryName) {
    await system.exec(
      `xrandr --output ${PRIMARY_MONITOR} --mode ${SCREEN_W}x${SCREEN_H} --pos 0x0 --output ${SECONDARY_MONITOR} --mode ${SCREEN_W}x${SCREEN_H} --pos ${SCREEN_W}x0 2>/dev/null`
    );
    await system.exec(`xrandr --output ${primaryName} --primary 2>/dev/null`);
    await new Promise(r => setTimeout(r, 3000));
    // 输出当前 xrandr 状态用于验证
    const xr = await system.exec('xrandr --current 2>/dev/null');
    console.log('xrandr 当前状态:\n' + xr.stdout);
  }

  // 恢复镜像模式：两个显示器都在 0x0
  async function setMirroredMode(system) {
    await system.exec(
      `xrandr --output ${PRIMARY_MONITOR} --primary --mode ${SCREEN_W}x${SCREEN_H} --pos 0x0 --output ${SECONDARY_MONITOR} --mode ${SCREEN_W}x${SCREEN_H} --pos 0x0 2>/dev/null`
    );
    await new Promise(r => setTimeout(r, 2000));
  }

  // 以当前用户触发通知
  async function notifyAsUser(system, app, summary, body, t) {
    return await system.exec(
      `notify-send -a '${app}' '${summary}' '${body}' -t ${t}`
    );
  }

  // 通过 wmctrl 获取指定窗口名称的几何位置
  async function getWindowGeo(system, pattern) {
    const res = await system.exec(`wmctrl -l -G 2>/dev/null`);
    console.log('wmctrl 输出:\n' + res.stdout);
    for (const line of res.stdout.split('\n')) {
      if (line.includes(pattern)) {
        const p = line.trim().split(/\s+/);
        const x = parseInt(p[2], 10);
        const y = parseInt(p[3], 10);
        const w = parseInt(p[4], 10);
        const h = parseInt(p[5], 10);
        if (Number.isNaN(x) || Number.isNaN(w)) continue;
        return { x, y, w, h, cx: x + Math.floor(w / 2), cy: y + Math.floor(h / 2) };
      }
    }
    return null;
  }

  // 根据中心 x 判断属于哪个显示器
  function monitorForX(monitors, cx) {
    return monitors.find(m => cx >= m.x && cx < m.x + m.width);
  }

  // 将鼠标移动到指定显示器中心，避免通知跟随鼠标
  async function moveMouseToMonitor(system, monitor) {
    const cx = monitor.x + Math.floor(monitor.width / 2);
    const cy = monitor.y + Math.floor(monitor.height / 2);
    await system.exec(`xdotool mousemove ${cx} ${cy}`);
    await new Promise(r => setTimeout(r, 500));
  }

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    console.log('beforeAll: 以当前用户执行，无需新建用户');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1802209-【通知中心】多屏扩展模式通知横幅和通知只在主屏显示', async ({ device, agent, uos, system }) => {
    // ===== 设置扩展模式：eDP 主屏在左，HDMI 副屏在右 =====
    console.log('设置扩展模式: eDP主屏在左, HDMI副屏在右');
    await setExtendedMode(system, PRIMARY_MONITOR);

    let monitors = await device.monitors();
    console.log('当前显示器: ' + JSON.stringify(monitors.map(m => ({ name: m.name, primary: m.isPrimary, x: m.x, y: m.y, w: m.width, h: m.height }))));
    const primary1 = monitors.find(m => m.isPrimary) || monitors.find(m => m.name === PRIMARY_MONITOR);
    if (!primary1) throw new Error('应检测到主屏');
    console.log(`主屏: ${primary1.name} (x=${primary1.x}, w=${primary1.width})`);

    // ===== 步骤1: 触发通知，验证通知横幅展示在主屏 =====
    console.log('步骤1: 触发通知，验证横幅在主屏');
    // 将鼠标移到主屏中心，避免通知跟随鼠标位置
    await moveMouseToMonitor(system, primary1);
    await notifyAsUser(system, 'dde-control-center', '多屏扩展横幅测试', '横幅应显示在主屏', BANNER_TIMEOUT_MS);
    await new Promise(r => setTimeout(r, 3000));

    const bubble1 = await getWindowGeo(system, 'org.deepin.ds.notificationbubble');
    console.log('notificationbubble geo1: ' + JSON.stringify(bubble1));
    if (!bubble1) throw new Error('通知横幅窗口应已出现');
    const bubbleMon1 = monitorForX(monitors, bubble1.cx);
    console.log(`横幅中心x=${bubble1.cx}，所在显示器=${bubbleMon1 ? bubbleMon1.name : '未知'}，主屏=${primary1.name}`);
    if (!bubbleMon1 || bubbleMon1.name !== primary1.name) {
      throw new Error(`通知横幅应展示在主屏(${primary1.name})上，不应在副屏`);
    }

    // ===== 步骤2: 打开通知中心，验证展示在主屏 =====
    console.log('步骤2: 打开通知中心，验证在主屏');
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const nc1 = await getWindowGeo(system, 'org.deepin.ds.notificationcenter');
    console.log('notificationcenter geo1: ' + JSON.stringify(nc1));
    if (!nc1) throw new Error('通知中心窗口应已出现');
    const ncMon1 = monitorForX(monitors, nc1.cx);
    console.log(`通知中心中心x=${nc1.cx}，所在显示器=${ncMon1 ? ncMon1.name : '未知'}，主屏=${primary1.name}`);
    if (!ncMon1 || ncMon1.name !== primary1.name) {
      throw new Error(`通知中心应展示在主屏(${primary1.name})上，不应在副屏`);
    }
    await device.pressKey('Escape');
    await new Promise(r => setTimeout(r, 2000));

    // ===== 步骤3: 切换主屏为 HDMI，重复步骤1-2 =====
    console.log('步骤3: 切换主屏为 ' + SECONDARY_MONITOR);
    await setExtendedMode(system, SECONDARY_MONITOR);
    monitors = await device.monitors();
    console.log('切换后显示器: ' + JSON.stringify(monitors.map(m => ({ name: m.name, primary: m.isPrimary, x: m.x, y: m.y, w: m.width, h: m.height }))));
    const primary2 = monitors.find(m => m.isPrimary) || monitors.find(m => m.name === SECONDARY_MONITOR);
    if (!primary2 || primary2.name !== SECONDARY_MONITOR) {
      throw new Error(`主屏应已切换为${SECONDARY_MONITOR}`);
    }
    console.log(`新主屏: ${primary2.name} (x=${primary2.x}, w=${primary2.width})`);
    await new Promise(r => setTimeout(r, 2000));

    // 触发通知
    console.log('步骤3-1: 触发通知，验证横幅在新主屏');
    // 将鼠标移到新主屏中心
    await moveMouseToMonitor(system, primary2);
    await notifyAsUser(system, 'dde-control-center', '切换主屏后横幅测试', '横幅应显示在新主屏', BANNER_TIMEOUT_MS);
    await new Promise(r => setTimeout(r, 3000));

    const bubble2 = await getWindowGeo(system, 'org.deepin.ds.notificationbubble');
    console.log('notificationbubble geo2: ' + JSON.stringify(bubble2));
    if (!bubble2) throw new Error('切换主屏后通知横幅窗口应已出现');
    const bubbleMon2 = monitorForX(monitors, bubble2.cx);
    console.log(`横幅2中心x=${bubble2.cx}，所在显示器=${bubbleMon2 ? bubbleMon2.name : '未知'}，新主屏=${primary2.name}`);
    if (!bubbleMon2 || bubbleMon2.name !== primary2.name) {
      throw new Error(`切换主屏后通知横幅应展示在新主屏(${primary2.name})上`);
    }

    // 打开通知中心
    console.log('步骤3-2: 打开通知中心，验证在新主屏');
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 15000 });
    await new Promise(r => setTimeout(r, 2000));

    const nc2 = await getWindowGeo(system, 'org.deepin.ds.notificationcenter');
    console.log('notificationcenter geo2: ' + JSON.stringify(nc2));
    if (!nc2) throw new Error('切换主屏后通知中心窗口应已出现');
    const ncMon2 = monitorForX(monitors, nc2.cx);
    console.log(`通知中心2中心x=${nc2.cx}，所在显示器=${ncMon2 ? ncMon2.name : '未知'}，新主屏=${primary2.name}`);
    if (!ncMon2 || ncMon2.name !== primary2.name) {
      throw new Error(`切换主屏后通知中心应展示在新主屏(${primary2.name})上`);
    }
    await device.pressKey('Escape');
    await new Promise(r => setTimeout(r, 2000));

    // ===== 恢复显示器为镜像模式 =====
    console.log('恢复显示器为镜像模式');
    await setMirroredMode(system);
    await new Promise(r => setTimeout(r, 2000));
  }, { timeout: 1800000, tags: ['1802209', 'level3','multi-screen'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 兜底：还原显示器为镜像模式
    try {
      await system.exec(
        `xrandr --output ${PRIMARY_MONITOR} --primary --mode ${SCREEN_W}x${SCREEN_H} --pos 0x0 --output ${SECONDARY_MONITOR} --mode ${SCREEN_W}x${SCREEN_H} --pos 0x0 2>/dev/null`
      );
    } catch {}

    try {
      await system.exec('killall dde-control-center 2>/dev/null || true');
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {}

    try { await uos.showDesktop(); } catch {}
    await device.releaseAllKeys();
    console.log('afterAll 完成，环境已恢复');
  });
});
