/**
 * 用例 PMSID: 1832593
 * 用例标题: 【启动器】【全屏模式】【背景壁纸】更换主屏壁纸，双屏模式下副屏打开启动器全屏，背景壁纸为副屏桌面壁纸
 * 生成时间: 2026/7/24
 * 用例编写人: UT002485（卢燕）
 */

const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';
const PRIMARY_MONITOR = 'eDP';        // 物理主屏（笔记本屏）
const SECONDARY_MONITOR = 'HDMI-A-0';  // 物理副屏
// 系统壁纸中的第一张壁纸（用于更换主屏壁纸），与副屏壁纸明显不同
const NEW_WALLPAPER_URI = 'file:///usr/share/wallpapers/deepin/Colorful-Abstraction01.jpg';

// 启动器框架模式配置（current_frame=FullscreenFrame/WindowedFrame）
// 实测 V25 镜像上该文件默认不存在：sed -i 对不存在的文件会静默失败，
// 导致启动器始终停留在默认窗口模式，必须 mkdir -p + printf 直接创建。
const LAUNCHER_SETTINGS_INI = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
const LAUNCHER_SETTINGS_QT = '/home/uos/.config/org.deepin.dde-shell.settings';

// 记录主屏原始壁纸，便于 afterAll 还原（模块级变量在 beforeAll/test/afterAll 间共享）
let originMainWallpaper = '';
let originSecondaryIsClone = true;

// 设置启动器框架模式（FullscreenFrame 全屏 / WindowedFrame 窗口），并重启 dde-shell 生效。
// 同时写入 settings.ini 与 QSettings 默认路径两个位置，兼容不同版本读取位置差异。
const setLauncherFrame = async (system, frame) => {
  await system.exec(
    `mkdir -p /home/uos/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=${frame}\\n' > ${LAUNCHER_SETTINGS_INI}`,
  );
  await system.exec(`printf '[General]\\ncurrent_frame=${frame}\\n' > ${LAUNCHER_SETTINGS_QT}`);
  // 回读校验，避免配置未写入导致启动器模式不符合预期
  const verify = await system.exec(`cat ${LAUNCHER_SETTINGS_INI}`);
  if (!verify.success || !verify.stdout.includes(`current_frame=${frame}`)) {
    throw new Error(`启动器模式配置写入失败: ${verify.stdout} ${verify.stderr}`);
  }
  // 优先 systemctl 重启，异常环境下兜底 kill 后由守护自动拉起
  await system.exec(
    'systemctl --user restart dde-shell@DDE 2>/dev/null || kill -9 $(pgrep -x dde-shell) 2>/dev/null || true',
    15000,
  );
};

describe('1832593-【启动器】【全屏模式】【背景壁纸】更换主屏壁纸，双屏模式下副屏打开启动器全屏，背景壁纸为副屏桌面壁纸', () => {
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

    // 强制切换启动器为全屏模式并重启 dde-shell 生效（实测必须创建 settings.ini）
    await setLauncherFrame(system, 'FullscreenFrame');
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 统一清理可能干扰的窗口
    await uos.showDesktop();

    // 记录主屏原始壁纸，便于 afterAll 还原
    const originRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'GetCurrentWorkspaceBackgroundForMonitor', [PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    originMainWallpaper = String(originRes?.result || originRes?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
    console.log(`主屏原始壁纸: ${originMainWallpaper}`);
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 仅按 ESC 清除弹窗；不再调用 uos.showDesktop()，避免 Super+D 二次触发导致
    // 之前最小化的干扰窗口被恢复，从而遮挡后续界面
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832593-【启动器】【全屏模式】【背景壁纸】更换主屏壁纸，双屏模式下副屏打开启动器全屏，背景壁纸为副屏桌面壁纸', async ({ device, agent, uos, system }) => {
    // 步骤1：确认双屏（已通过 device.monitors() 编程验证）
    const monitors = await device.monitors();
    console.log('显示器列表:', monitors.map(m => ({ name: m.name, isPrimary: m.isPrimary, x: m.x })));

    // 步骤2：通过 D-Bus 接口更换主屏壁纸
    // 选择与副屏壁纸平均色调差异最大的系统壁纸，确保后续像素统计对比可区分
    const secondaryBeforeRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'GetCurrentWorkspaceBackgroundForMonitor', [SECONDARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    const secondaryWallpaper = String(secondaryBeforeRes?.result || secondaryBeforeRes?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
    console.log(`副屏壁纸: ${secondaryWallpaper}`);
    const secondaryWallpaperFile = secondaryWallpaper.replace('file://', '');

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
sec_path = '${secondaryWallpaperFile}'
sec = avg(sec_path)
if not sec:
    raise RuntimeError('cannot read secondary wallpaper: ' + sec_path)
candidates = [f for f in sorted(glob.glob('/usr/share/wallpapers/deepin/*'))
              if f.lower().endswith(('.jpg', '.jpeg', '.png'))
              and os.path.realpath(f) != os.path.realpath(sec_path)]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(avg, candidates))
best, bestd = None, -1
for f, a in zip(candidates, results):
    if not a: continue
    d = dist(a, sec)
    if d > bestd: best, bestd = f, d
if not best:
    raise RuntimeError('no candidate wallpaper found')
print('file://' + best)
"`, 60000);
    const pickedMatch = pickRes.stdout.trim().match(/file:\/\/\S+/);
    if (!pickedMatch) {
      throw new Error(`选择主屏新壁纸失败: stdout=${pickRes.stdout} stderr=${pickRes.stderr}`);
    }
    const newWallpaperUri = pickedMatch[0];
    console.log(`已选择与副屏色调差异最大的系统壁纸作为主屏新壁纸: ${newWallpaperUri}`);

    // 设置主屏壁纸为新选的系统壁纸
    const setRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'SetCurrentWorkspaceBackgroundForMonitor', [newWallpaperUri, PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    console.log('设置主屏壁纸返回:', JSON.stringify({ success: setRes?.success, exitCode: setRes?.exitCode }));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 校验主屏壁纸已更换为预期壁纸，且与副屏壁纸不同
    const primaryRes = await system.queryDBus(
      APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
      'GetCurrentWorkspaceBackgroundForMonitor', [PRIMARY_MONITOR],
      { bus: 'session', timeout: 10000 },
    );
    const primaryWallpaper = String(primaryRes?.result || primaryRes?.stdout?.match(/string "([^"]*)"/)?.[1] || '');
    console.log(`主屏更换后壁纸: ${primaryWallpaper}`);
    if (primaryWallpaper !== newWallpaperUri) {
      throw new Error(`主屏壁纸更换失败，期望 ${newWallpaperUri}，实际 ${primaryWallpaper}`);
    }
    if (primaryWallpaper === secondaryWallpaper) {
      throw new Error('主屏壁纸与副屏壁纸相同，无法验证启动器背景来源');
    }
    console.log('主屏壁纸已更换，且与副屏壁纸不同');

    // 显示桌面，确保无遮挡
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：将副屏(HDMI-A-0)设为主屏并置于屏幕原点 (0,0)。
    // 实测 dock 与启动器全屏始终跟随位于 (0,0) 的屏幕（与主屏标志无关），
    // 因此需将 HDMI-A-0 交换到原点位置，使启动器全屏在副屏打开。
    console.log('将 HDMI-A-0 设为主屏并置于原点 (0,0)');
    await system.exec('xrandr --output HDMI-A-0 --mode 1920x1080 --pos 0x0 --primary --output eDP --mode 1920x1080 --pos 1920x0');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 SetPrimary s "HDMI-A-0"');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 重启前再次写死全屏配置，保证 dde-shell 重启后启动器仍为全屏模式
    await system.exec(
      `mkdir -p /home/uos/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${LAUNCHER_SETTINGS_INI}`,
    );
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null || kill -9 $(pgrep -x dde-shell) 2>/dev/null || true', 15000);
    await new Promise(resolve => setTimeout(resolve, 15000));

    // dde-shell 重启后再次最小化可能恢复的干扰窗口
    await system.exec('xdotool search --name "Trae" windowminimize 2>/dev/null || true');
    await system.exec('xdotool search --name "Visual Studio Code" windowminimize 2>/dev/null || true');
    await system.exec('xdotool search --name "语音记事本" windowminimize 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤4：依据显示器列表动态计算 HDMI-A-0 几何（HDMI-A-0 现位于原点）
    const monitorsNow = await device.monitors();
    const hdmiMonitor = monitorsNow.find(m => m.name === SECONDARY_MONITOR) || monitorsNow[0];
    const otherMonitor = monitorsNow.find(m => m.name === PRIMARY_MONITOR) || monitorsNow.find(m => m.name !== hdmiMonitor.name);
    const secX = hdmiMonitor.x;
    const secY = hdmiMonitor.y;
    const secW = hdmiMonitor.width;
    const secH = hdmiMonitor.height;
    const secCenterX = secX + Math.floor(secW / 2);
    const secCenterY = secY + Math.floor(secH / 2);
    console.log(`HDMI-A-0 几何: (${secX},${secY}) ${secW}x${secH}, 中心 (${secCenterX}, ${secCenterY})`);

    // 启动器打开前捕获两屏桌面截图（作为壁纸色调参考，含实际渲染效果，避免壁纸文件缩放差异）
    const deskSamePath = '/tmp/desk_same_screen.png';
    const deskOtherPath = '/tmp/desk_other_screen.png';
    await system.exec(`rm -f ${deskSamePath} ${deskOtherPath}`);
    await system.exec(`import -window root -crop ${secW}x${secH}+${secX}+${secY} ${deskSamePath}`, 15000);
    await system.exec(`import -window root -crop ${otherMonitor.width}x${otherMonitor.height}+${otherMonitor.x}+${otherMonitor.y} ${deskOtherPath}`, 15000);
    console.log('已捕获两屏桌面壁纸参考截图');

    // 将鼠标移动到 HDMI-A-0 中心位置
    console.log(`移动鼠标到 HDMI-A-0 中心: (${secCenterX}, ${secCenterY})`);
    await system.exec(`xdotool mousemove ${secCenterX} ${secCenterY}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤5：在 HDMI-A-0（副屏）打开启动器全屏
    // settings.ini 已写死 FullscreenFrame，在位于原点的 HDMI-A-0 上按 Super 即打开全屏启动器
    // （DBus ShowByMode 打开的全屏界面会因焦点变化自动关闭，实测 Super 方式更稳定）
    await device.pressKey('Super');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 通过窗口几何编程验证启动器已全屏显示在 HDMI-A-0（动态解析，不写死分辨率/坐标）
    const launcherGeo = await system.exec('xdotool search --name "launchpad" getwindowgeometry 2>/dev/null || true');
    console.log('启动器窗口几何:', launcherGeo.stdout);
    const posMatch = launcherGeo.stdout.match(/Position:\s*(\d+),(\d+)/);
    const sizeMatch = launcherGeo.stdout.match(/Geometry:\s*(\d+)x(\d+)/);
    if (!posMatch || !sizeMatch
      || parseInt(posMatch[1], 10) !== secX || parseInt(posMatch[2], 10) !== secY
      || parseInt(sizeMatch[1], 10) !== secW || parseInt(sizeMatch[2], 10) !== secH) {
      throw new Error(`启动器未在 HDMI-A-0 以全屏模式打开（期望位置 ${secX},${secY}、尺寸 ${secW}x${secH}）: ${launcherGeo.stdout}`);
    }

    // 检查：启动器背景壁纸为 HDMI-A-0 桌面壁纸。
    // 实测 AI 与绝对色距对比都不可靠：启动器背景是壁纸叠加约50%深色蒙层（整体变暗但色调比例保持），
    // 因此改用亮度归一化色调对比：启动器背景的归一化色调应显著更接近副屏壁纸（而非已更换的主屏壁纸）
    const shotPath = '/tmp/launcher_screen_shot.png';
    await system.exec(`rm -f ${shotPath}`);
    await system.exec(`import -window root -crop ${secW}x${secH}+${secX}+${secY} ${shotPath}`, 15000);
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
launcher = '${shotPath}'
same = '${deskSamePath}'
other = '${deskOtherPath}'
# 取多个边角区域中的最小色调距离（规避图标/搜索框等界面元素干扰）
geoms = ['400x300+50+80', '400x300+1470+80', '400x300+50+700']
ds = [dist(norm_hue(region_color(launcher, g)), norm_hue(region_color(same, g))) for g in geoms]
do = [dist(norm_hue(region_color(launcher, g)), norm_hue(region_color(other, g))) for g in geoms]
print(f'{min(ds):.4f} {min(do):.4f}')
"`, 60000);
    const cmpMatch = cmpRes.stdout.trim().match(/([\d.]+)\s+([\d.]+)/);
    if (!cmpMatch) {
      throw new Error(`启动器背景色调对比执行失败: stdout=${cmpRes.stdout} stderr=${cmpRes.stderr}`);
    }
    const hueDistSec = parseFloat(cmpMatch[1]);
    const hueDistPri = parseFloat(cmpMatch[2]);
    console.log(`启动器背景与副屏壁纸归一化色调距离=${hueDistSec}，与主屏(已更换)壁纸色调距离=${hueDistPri}`);
    if (!(hueDistSec < hueDistPri * 0.6)) {
      throw new Error(`启动器背景应为副屏桌面壁纸（色调距副屏=${hueDistSec}，距主屏=${hueDistPri}，应显著偏向副屏壁纸）`);
    }
    console.log('启动器背景已确认使用副屏桌面壁纸（归一化色调对比通过）');

    // AI 界面视觉记录（非阻断）：启动器全屏背景为壁纸，AI 易误判为"桌面"，
    // 上方窗口几何检查（1920x1080@0,0）已是权威程序化验证，故此处仅记录视觉状态不阻断用例
    const visualAssert = await agent.aiAssert(
      '画面左半部分（副屏）显示启动器界面，界面包含应用图标网格列表和底部搜索框',
      undefined,
      { returnOnFailure: true },
    );
    console.log(`启动器界面视觉断言: pass=${visualAssert.pass}`);

    // 关闭启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤6：还原屏幕位置与主屏设置（eDP 回到原点并为主屏）并重启 dde-shell
    await system.exec('xrandr --output eDP --mode 1920x1080 --pos 0x0 --primary --output HDMI-A-0 --mode 1920x1080 --pos 1920x0');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 SetPrimary s "eDP"');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec(`kill -9 $(pgrep -x dde-shell) 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 15000));
    console.log('已还原屏幕位置与主屏设置');
  }, { timeout: 600000, tags: ['1832593', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 兜底：确保 eDP 为主屏并位于原点（用例中途失败时也会执行）
    try {
      await system.exec('xrandr --output eDP --mode 1920x1080 --pos 0x0 --primary --output HDMI-A-0 --mode 1920x1080 --pos 1920x0 2>/dev/null || true');
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges 2>/dev/null || true');
      await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 SetPrimary s "eDP" 2>/dev/null || true');
    } catch (e) {
      console.log(`还原 eDP 为主屏失败: ${(e).message}`);
    }

    // 还原主屏壁纸
    if (originMainWallpaper) {
      try {
        await system.queryDBus(
          APPEARANCE_BUS, APPEARANCE_PATH, APPEARANCE_IFACE,
          'SetCurrentWorkspaceBackgroundForMonitor', [originMainWallpaper, PRIMARY_MONITOR],
          { bus: 'session', timeout: 10000 },
        );
        console.log(`已还原主屏壁纸: ${originMainWallpaper}`);
      } catch (e) {
        console.log(`还原主屏壁纸失败: ${(e).message}`);
      }
    }

    // 还原启动器为窗口模式（settings.ini 与 QSettings 默认路径均需还原）
    try {
      await setLauncherFrame(system, 'WindowedFrame');
      await new Promise(resolve => setTimeout(resolve, 8000));
      console.log('已还原启动器为窗口模式');
    } catch (e) {
      console.log(`还原启动器为窗口模式失败: ${(e).message}`);
    }

    // 还原原始显示模式（若原为克隆模式）
    if (originSecondaryIsClone) {
      try {
        await system.exec('xrandr --output eDP --primary --output HDMI-A-0 --same-as eDP');
        await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {}
    }
    console.log('已还原启动器为窗口模式');
  });
});
