/**
 * 用例 PMSID: 1832591
 * 用例标题: 【启动器】【全屏模式】【背景壁纸】更换副屏壁纸，双屏模式下主屏打开启动器全屏，背景壁纸为主屏桌面壁纸
 * 生成时间: 2026/7/24
 * 用例编写人: UT002485（卢燕）
 * 优化说明: 参考 1832593.ts，改用配置文件创建+Super 打开+窗口几何+归一化色调对比，避免 AI 误判。
 */

const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';
const SECONDARY_MONITOR = 'HDMI-A-0';
const PRIMARY_MONITOR = 'eDP';

const LAUNCHER_SETTINGS_INI = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
const LAUNCHER_SETTINGS_QT = '/home/uos/.config/org.deepin.dde-shell.settings';

let originSecondaryWallpaper = '';
let originSecondaryIsClone = true;

// 设置启动器框架模式（FullscreenFrame 全屏 / WindowedFrame 窗口），并重启 dde-shell 生效。
const setLauncherFrame = async (system, frame) => {
  await system.exec(
    `mkdir -p /home/uos/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=${frame}\\n' > ${LAUNCHER_SETTINGS_INI}`,
  );
  await system.exec(`printf '[General]\\ncurrent_frame=${frame}\\n' > ${LAUNCHER_SETTINGS_QT}`);
  const verify = await system.exec(`cat ${LAUNCHER_SETTINGS_INI}`);
  if (!verify.success || !verify.stdout.includes(`current_frame=${frame}`)) {
    throw new Error(`启动器模式配置写入失败: ${verify.stdout} ${verify.stderr}`);
  }
  await system.exec(
    'systemctl --user restart dde-shell@DDE 2>/dev/null || kill -9 $(pgrep -x dde-shell) 2>/dev/null || true',
    15000,
  );
};

// 通过 D-Bus 获取指定显示器当前壁纸
const getMonitorWallpaper = async (system, monitor) => {
  const res = await system.queryDBus(
    APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
    'GetCurrentWorkspaceBackgroundForMonitor', [monitor],
    { bus: 'session', timeout: 10000 },
  );
  return String(res?.result || res?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
};

// 使用归一化色调距离比较两张图片的多个边角区域
const compareRegionHue = async (system, launcherPath, samePath, otherPath) => {
  const cmpRes = await system.exec(
    `python3 -c "
import subprocess
def region_color(path, geom):
    r = subprocess.run(['convert', path, '-crop', geom, '+repage', '-scale', '1x1', 'txt:-'], capture_output=True, text=True, timeout=10)
    if r.returncode != 0: raise RuntimeError('convert failed: ' + path + ' ' + geom)
    line = [l for l in r.stdout.splitlines() if l.startswith('0,0:')][0]
    rgb_str = line.split('(')[1].split(')')[0]
    return tuple(int(x) for x in rgb_str.split(','))
def norm_hue(rgb):
    s = sum(rgb)
    if s <= 0: raise RuntimeError('black region')
    return tuple(c/s for c in rgb)
def dist(a, b): return sum((x-y)**2 for x, y in zip(a, b))**0.5
launcher = '${launcherPath}'
same = '${samePath}'
other = '${otherPath}'
geoms = ['400x300+50+80', '400x300+1470+80', '400x300+50+700']
ds = [dist(norm_hue(region_color(launcher, g)), norm_hue(region_color(same, g))) for g in geoms]
do = [dist(norm_hue(region_color(launcher, g)), norm_hue(region_color(other, g))) for g in geoms]
print(f'{min(ds):.4f} {min(do):.4f}')
"`, 60000);
  const cmpMatch = cmpRes.stdout.trim().match(/([\d.]+)\s+([\d.]+)/);
  if (!cmpMatch) {
    throw new Error(`启动器背景色调对比执行失败: stdout=${cmpRes.stdout} stderr=${cmpRes.stderr}`);
  }
  return { sameDist: parseFloat(cmpMatch[1]), otherDist: parseFloat(cmpMatch[2]) };
};

describe('1832591-【启动器】【全屏模式】【背景壁纸】更换副屏壁纸，双屏模式下主屏打开启动器全屏，背景壁纸为主屏桌面壁纸', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 克隆模式下 device.monitors() 仅返回1个，需先确保双屏扩展模式（eDP 在原点为主屏）
    const xr = await system.exec('xrandr --query');
    const secMatch = xr.stdout.match(/HDMI-A-0[^\n]*?(\d+x\d+)\+(\d+)\+(\d+)/);
    const priMatch = xr.stdout.match(/\beDP[^\n]*?(\d+x\d+)\+(\d+)\+(\d+)/);
    originSecondaryIsClone = secMatch && priMatch ? (secMatch[2] === priMatch[2] && secMatch[3] === priMatch[3]) : true;
    if (originSecondaryIsClone) {
      await system.exec('xrandr --output eDP --mode 1920x1080 --pos 0x0 --primary --output HDMI-A-0 --mode 1920x1080 --pos 1920x0');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 检查是否为双屏环境
    const monitors = await device.monitors();
    console.log(`检测到 ${monitors.length} 个显示器`);
    if (monitors.length < 2) {
      throw new Error('当前环境未检测到双屏，需要外接HDMI显示器才能执行本用例');
    }
    const hasSecondary = monitors.some(m => m.name === SECONDARY_MONITOR);
    if (!hasSecondary) {
      throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}，无法执行本用例`);
    }

    // 强制切换启动器为全屏模式并重启 dde-shell 生效
    await setLauncherFrame(system, 'FullscreenFrame');
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 记录副屏原始壁纸，便于 afterAll 还原
    originSecondaryWallpaper = await getMonitorWallpaper(system, SECONDARY_MONITOR);
    console.log(`副屏原始壁纸: ${originSecondaryWallpaper}`);

    await uos.showDesktop();
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832591-【启动器】【全屏模式】【背景壁纸】更换副屏壁纸，双屏模式下主屏打开启动器全屏，背景壁纸为主屏桌面壁纸', async ({ device, agent, uos, system }) => {
    // 步骤1：确认双屏并获取主/副屏信息
    const monitors = await device.monitors();
    const primaryMonitor = monitors.find(m => m.isPrimary) || monitors.find(m => m.name === PRIMARY_MONITOR) || monitors[0];
    console.log('显示器列表:', JSON.stringify(monitors.map(m => ({ name: m.name, isPrimary: m.isPrimary, x: m.x }))));
    console.log(`主屏: ${primaryMonitor.width}x${primaryMonitor.height}, 坐标(${primaryMonitor.x}, ${primaryMonitor.y})`);

    // 确保 eDP 在原点并为主屏
    if (primaryMonitor.x !== 0 || primaryMonitor.y !== 0 || primaryMonitor.name !== PRIMARY_MONITOR) {
      await system.exec('xrandr --output eDP --mode 1920x1080 --pos 0x0 --primary --output HDMI-A-0 --mode 1920x1080 --pos 1920x0');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 SetPrimary s "eDP"');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 步骤2：通过 D-Bus 接口更换副屏壁纸，取一张与主屏壁纸色调差异最大的系统壁纸
    const primaryWallpaper = await getMonitorWallpaper(system, PRIMARY_MONITOR);
    console.log(`主屏当前壁纸: ${primaryWallpaper}`);

    const pickRes = await system.exec(
      `python3 -c "
import subprocess, glob, os, concurrent.futures
def avg(p):
    try:
        r = subprocess.run(['convert', p, '-scale', '1x1', 'txt:-'], capture_output=True, text=True, timeout=10)
        if r.returncode != 0: return None
        line = [l for l in r.stdout.splitlines() if l.startswith('0,0:')][0]
        rgb_str = line.split('(')[1].split(')')[0]
        return tuple(int(x) for x in rgb_str.split(','))
    except Exception:
        return None
def dist(a, b): return sum((x-y)**2 for x, y in zip(a, b))**0.5
pri_path = '${primaryWallpaper.replace('file://', '')}'
pri = avg(pri_path)
if not pri:
    raise RuntimeError('cannot read primary wallpaper: ' + pri_path)
candidates = [f for f in sorted(glob.glob('/usr/share/wallpapers/deepin/*'))
              if f.lower().endswith(('.jpg', '.jpeg', '.png'))
              and os.path.realpath(f) != os.path.realpath(pri_path)]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(avg, candidates))
best, bestd = None, -1
for f, a in zip(candidates, results):
    if not a: continue
    d = dist(a, pri)
    if d > bestd: best, bestd = f, d
if not best:
    raise RuntimeError('no candidate wallpaper found')
print('file://' + best)
"`, 60000);
    const pickedMatch = pickRes.stdout.trim().match(/file:\/\/\S+/);
    if (!pickedMatch) {
      throw new Error(`选择副屏新壁纸失败: stdout=${pickRes.stdout} stderr=${pickRes.stderr}`);
    }
    const newWallpaperUri = pickedMatch[0];
    console.log(`已选择与主屏色调差异最大的系统壁纸作为副屏新壁纸: ${newWallpaperUri}`);

    const setRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'SetCurrentWorkspaceBackgroundForMonitor', [newWallpaperUri, SECONDARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    console.log('设置副屏壁纸返回:', JSON.stringify({ success: setRes?.success, exitCode: setRes?.exitCode }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 校验副屏壁纸已更换为预期壁纸，且与主屏壁纸不同
    const secondaryWallpaper = await getMonitorWallpaper(system, SECONDARY_MONITOR);
    console.log(`副屏更换后壁纸: ${secondaryWallpaper}`);
    if (secondaryWallpaper !== newWallpaperUri) {
      throw new Error(`副屏壁纸更换失败，期望 ${newWallpaperUri}，实际 ${secondaryWallpaper}`);
    }
    if (secondaryWallpaper === primaryWallpaper) {
      throw new Error('副屏壁纸与主屏壁纸相同，无法验证启动器背景来源');
    }
    console.log('副屏壁纸已更换，且与主屏壁纸不同');

    // 步骤3：捕获两屏桌面壁纸参考截图
    const deskSamePath = '/tmp/desk_same_screen.png';
    const deskOtherPath = '/tmp/desk_other_screen.png';
    await system.exec(`rm -f ${deskSamePath} ${deskOtherPath}`);
    await system.exec(`import -window root -crop 1920x1080+0+0 ${deskSamePath}`, 15000);
    await system.exec(`import -window root -crop 1920x1080+1920+0 ${deskOtherPath}`, 15000);
    console.log('已捕获两屏桌面壁纸参考截图');

    // 显示桌面，确保无遮挡后再打开启动器
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤4：将鼠标移动到主屏中心位置
    const priCenterX = Math.floor(1920 / 2);
    const priCenterY = Math.floor(1080 / 2);
    console.log(`移动鼠标到主屏中心: (${priCenterX}, ${priCenterY})`);
    await system.exec(`xdotool mousemove ${priCenterX} ${priCenterY}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤5：在主屏打开启动器全屏
    await device.pressKey('Super');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 通过窗口几何编程验证启动器已全屏显示在主屏
    const launcherGeo = await system.exec('xdotool search --name "launchpad" getwindowgeometry 2>/dev/null || true');
    console.log('启动器窗口几何:', launcherGeo.stdout);
    const posMatch = launcherGeo.stdout.match(/Position:\s*(\d+),(\d+)/);
    const sizeMatch = launcherGeo.stdout.match(/Geometry:\s*(\d+)x(\d+)/);
    if (!posMatch || !sizeMatch
      || parseInt(posMatch[1], 10) !== 0 || parseInt(posMatch[2], 10) !== 0
      || parseInt(sizeMatch[1], 10) !== 1920 || parseInt(sizeMatch[2], 10) !== 1080) {
      throw new Error(`启动器未在主屏以全屏模式打开（期望位置 0,0、尺寸 1920x1080）: ${launcherGeo.stdout}`);
    }

    // 步骤6：检查启动器背景壁纸为主屏桌面壁纸（而非副屏已更换的新壁纸）
    const shotPath = '/tmp/launcher_screen_shot.png';
    await system.exec(`rm -f ${shotPath}`);
    await system.exec(`import -window root -crop 1920x1080+0+0 ${shotPath}`, 15000);
    const { sameDist, otherDist } = await compareRegionHue(system, shotPath, deskSamePath, deskOtherPath);
    console.log(`启动器背景与主屏壁纸归一化色调距离=${sameDist}，与副屏(已更换)壁纸色调距离=${otherDist}`);
    if (!(sameDist < otherDist * 0.6)) {
      throw new Error(`启动器背景应为主屏桌面壁纸（色调距主屏=${sameDist}，距副屏=${otherDist}）`);
    }
    console.log('启动器背景已确认使用主屏桌面壁纸（归一化色调对比通过）');

    // AI 界面视觉记录（非阻断）
    const visualAssert = await agent.aiAssert(
      '画面左半部分（主屏）显示启动器界面，界面包含应用图标网格列表和底部搜索框',
      undefined,
      { returnOnFailure: true },
    );
    console.log(`启动器界面视觉断言: pass=${visualAssert.pass}`);

    // 关闭启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1832591', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 还原副屏壁纸
    if (originSecondaryWallpaper) {
      try {
        await system.queryDBus(
          APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
          'SetCurrentWorkspaceBackgroundForMonitor', [originSecondaryWallpaper, SECONDARY_MONITOR],
          { bus: 'session', timeout: 10000 },
        );
        console.log(`已还原副屏壁纸: ${originSecondaryWallpaper}`);
      } catch (e) {
        console.log(`还原副屏壁纸失败: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 还原启动器为窗口模式
    try {
      await setLauncherFrame(system, 'WindowedFrame');
      await new Promise(resolve => setTimeout(resolve, 8000));
      console.log('已还原启动器为窗口模式');
    } catch (e) {
      console.log(`还原启动器为窗口模式失败: ${e instanceof Error ? e.message : String(e)}`);
    }

    // 还原原始显示模式（若原为克隆模式）
    if (originSecondaryIsClone) {
      try {
        await system.exec('xrandr --output eDP --primary --output HDMI-A-0 --same-as eDP');
        await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {}
    }

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('afterAll 完成，环境已恢复');
  });
});
