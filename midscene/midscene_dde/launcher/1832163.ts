/**
 * 用例 PMSID: 1832163
 * 用例标题: 【启动器】【全屏模式】【搜索框】在不同分辨率下，搜索框长驻显示
 * 生成时间: 2026-09-14
 * 用例编写人: UT005571(王艺桥)
 */

// dde-shell 启动器模式配置文件（current_frame 决定窗口/全屏模式）
const SETTINGS_INI = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 启动器模式配置备份路径（用于恢复进入用例前的模式）
const SETTINGS_BACKUP = '/tmp/dde-shell-settings-1832163.ini';

describe('1832163-【启动器】【全屏模式】【搜索框】在不同分辨率下，搜索框长驻显示', () => {
  // 用例前的初始分辨率（xrandr 动态解析），afterAll 恢复为该值
  let initialOutput = 'eDP-1';
  let initialMode = '1920x1080';

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化 - 备份模式配置、记录初始分辨率、确保全屏模式');
    await uos.showDesktop();

    const XENV = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority ';
    // 动态解析当前主输出（connected primary）与其生效模式（带 * 的行），避免硬编码 output 名
    const q = await system.exec(`${XENV}xrandr --query`);
    const out = (q.stdout || '').toString();
    const outM = out.match(/^(\S+)\s+connected\s+primary/m) || out.match(/^(\S+)\s+connected/m);
    const modeM = out.match(/^\s*(\d{3,4}x\d{3,4})\s+[\d. ]+\*/m);
    if (outM) initialOutput = outM[1];
    if (modeM) initialMode = modeM[1];
    console.log(`初始显示环境：output=${initialOutput}，mode=${initialMode}`);

    // 关闭可能残留的 GNOME 放大镜并复位 RandR scale，保证缩放基线为 100%
    // 注意：放大镜开关键在 org.gnome.desktop.a11y.applications（magnifier schema 无 enabled 键）
    await system.exec('DISPLAY=:0 gsettings set org.gnome.desktop.a11y.applications screen-magnifier-enabled false');
    await system.exec(`${XENV}xrandr --output ${initialOutput} --mode ${initialMode} --scale 1x1`);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 备份启动器模式配置（afterAll 还原进入用例前的窗口/全屏模式）
    await system.exec(`cp -f ${SETTINGS_INI} ${SETTINGS_BACKUP} 2>/dev/null`);
    // 无条件写全屏模式配置（UI 点击切换不持久化、重开启动器会回退；写配置+重启最可靠）
    await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${SETTINGS_INI}`);
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
    await new Promise((resolve) => setTimeout(resolve, 8000));
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832163-【启动器】【全屏模式】【搜索框】在不同分辨率下，搜索框长驻显示', async ({ device, agent, uos, system }) => {
    const XENV = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority ';
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /** 检查项：分辨率切换后校验实际生效值（xrandr 当前模式） */
    const checkResolution = async (target) => {
      let cur = '';
      for (let i = 0; i < 4; i++) {
        const r = await system.exec(`${XENV}xrandr --query`);
        // 带 * 的行即当前生效分辨率（如 "   1920x1080     60.06*+"）
        const m = r.stdout ? r.stdout.match(/^\s*(\d{3,4}x\d{3,4})\s+[\d. ]+\*/m) : null;
        cur = m ? m[1] : '';
        if (cur === target) {
          console.log(`CHECK 分辨率校验 OK: 当前 ${cur} == 期望 ${target}`);
          return true;
        }
        await sleep(3000);
      }
      throw new Error(`分辨率校验失败：期望 ${target}，实际 ${cur || '未知'}`);
    };

    /** 检查项：缩放比切换后校验帧缓冲尺寸（xrandr Screen 行 current 值，scale 后与物理模式不同） */
    const checkFramebuffer = async (target) => {
      let cur = '';
      for (let i = 0; i < 4; i++) {
        const r = await system.exec(`${XENV}xrandr --query`);
        // 首行如 "Screen 0: minimum 320 x 200, current 1536 x 864, maximum ..."
        const m = r.stdout ? r.stdout.match(/current\s+(\d+)\s*x\s*(\d+)/) : null;
        cur = m ? `${m[1]}x${m[2]}` : '';
        if (cur === target) {
          console.log(`CHECK 缩放帧缓冲校验 OK: 当前 ${cur} == 期望 ${target}`);
          return true;
        }
        await sleep(3000);
      }
      throw new Error(`缩放帧缓冲校验失败：期望 ${target}，实际 ${cur || '未知'}`);
    };

    /** 检查项：启动器为全屏模式（打开或切换后） */
    const checkLauncherFullscreen = async (label) => {
      await agent.aiAssert(`启动器处于全屏模式（${label}）：界面铺满整个屏幕，无窗口边框，显示应用图标网格`, { timeoutMs: 10000 });
      console.log(`CHECK 全屏模式 OK (${label})`);
    };

    /** 检查项：搜索框长驻可见 */
    const checkSearchBoxVisible = async (label) => {
      await agent.aiAssert(`启动器底部可见搜索框（${label}）：搜索框长驻显示、清晰可见`, { timeoutMs: 10000 });
      console.log(`CHECK 搜索框长驻可见 OK (${label})`);
    };

    /** 检查项：搜索框样式、位置一致（允许随界面等比缩放，不允许变形/截断/偏移） */
    const checkSearchBoxConsistent = async (label) => {
      await agent.aiAssert(`启动器底部搜索框在当前显示设置（${label}）下完整可见、显示正常：搜索框与界面整体等比缩放，未被屏幕边缘截断，未变形、未模糊、未偏移，仍位于底部居中，宽度与启动器界面匹配`, { timeoutMs: 10000 });
      console.log(`CHECK 搜索框样式一致 OK (${label})`);
    };

    // ============ 步骤 1: 默认分辨率下打开启动器全屏模式 ============
    console.log('步骤 1: 默认分辨率下打开启动器全屏模式（beforeAll 已写全屏配置并重启，打开即全屏）');
    await uos.openLauncher();
    await sleep(2500);
    // 检查项 1-1: 全屏模式生效
    await checkLauncherFullscreen('步骤1 默认分辨率');
    // 检查项 1-2: 底部搜索框长驻显示
    await checkSearchBoxVisible('步骤1 默认分辨率');
    // 检查项 1-3: 搜索框样式位置一致
    await checkSearchBoxConsistent('步骤1 默认分辨率');
    await device.pressKey('Escape');
    await sleep(1500);
    console.log('步骤 1 完成（检查项 1-1/1-2/1-3 全部通过）');

    // ============ 步骤 2: 依次调节分辨率、缩放比，检查搜索框保持一致 ============
    console.log('步骤 2: 依次调节系统分辨率、缩放比，并逐项检查');
    // 说明：V25 上 Super++/Super-- 快捷键触发的是 GNOME 放大镜（2倍视口平移），并非控制中心的
    //   DPI 缩放档，且放大镜下无法验证"搜索框长驻"；缩放档改用 RandR CRTC scale 实现。
    //   注意 xrandr --scale 是帧缓冲倍数：scale<1（0.8）帧缓冲变小、UI 视觉变大=放大1档；
    //   scale>1（1.25）帧缓冲变大、UI 视觉变小=缩小1档
    const combos = [
      { res: '1600x900', scale: '1x1', fb: '1600x900', label: '分辨率1600x900@默认缩放' },
      { res: '1920x1080', scale: '1x1', fb: '1920x1080', label: '分辨率1920x1080@默认缩放' },
      { res: '1920x1080', scale: '0.8x0.8', fb: '1536x864', label: '分辨率1920x1080@放大1档' },
      { res: '1600x900', scale: '1.25x1.25', fb: '2000x1125', label: '分辨率1600x900@缩小1档' },
    ];
    for (const c of combos) {
      console.log(`--- 组合: ${c.label} ---`);
      // 检查项 2-a: 切换分辨率+缩放比（同一条 xrandr 命令同时设置 mode 和 scale），并校验实际生效
      await system.exec(`${XENV}xrandr --output ${initialOutput} --mode ${c.res} --scale ${c.scale}`);
      await sleep(4500);
      await checkResolution(c.res);
      if (c.scale !== '1x1') {
        await checkFramebuffer(c.fb);
        console.log(`CHECK 缩放档已生效 (${c.label})`);
      }
      // 检查项 2-b: 打开启动器且保持全屏模式
      await uos.openLauncher();
      await sleep(2200);
      await checkLauncherFullscreen(c.label);
      // 检查项 2-c: 搜索框长驻可见
      await checkSearchBoxVisible(c.label);
      // 检查项 2-d: 搜索框样式/大小/位置一致
      await checkSearchBoxConsistent(c.label);
      await device.pressKey('Escape');
      await sleep(1200);
      // 每个组合后复位缩放为 1x1（分辨率在最后一个组合后统一复位，此处保持当前组合分辨率即可）
      if (c.scale !== '1x1') {
        await system.exec(`${XENV}xrandr --output ${initialOutput} --mode ${c.res} --scale 1x1`);
        await sleep(3000);
      }
    }

    // ============ 步骤 2 收尾: 复位并校验 ============
    console.log('步骤 2 收尾: 复位分辨率与缩放');
    await system.exec(`${XENV}xrandr --output ${initialOutput} --mode ${initialMode} --scale 1x1`);
    await sleep(4500);
    await checkResolution(initialMode);
    await uos.showDesktop();
    console.log('步骤 2 完成：4 个分辨率/缩放组合的检查项全部通过，复位校验通过');
  }, { timeout: 600000, tags: ['1832163', 'level4', 'remote'] });

  afterEach(async ({ device, uos }) => {
    console.log('afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 恢复初始环境 - 分辨率、缩放、启动器模式');
    const XENV = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority ';
    // 1. 恢复用例前的初始分辨率并复位 RandR scale
    await system.exec(`${XENV}xrandr --output ${initialOutput} --mode ${initialMode} --scale 1x1`);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    // 2. 关闭可能开启的 GNOME 放大镜（开关键在 org.gnome.desktop.a11y.applications）
    await system.exec('DISPLAY=:0 gsettings set org.gnome.desktop.a11y.applications screen-magnifier-enabled false');
    // 3. 还原启动器模式配置（进入用例前的窗口/全屏模式）
    await system.exec(`cp -f ${SETTINGS_BACKUP} ${SETTINGS_INI} 2>/dev/null`);
    console.log(`后置：分辨率已恢复 ${initialMode}，缩放已复位，启动器模式配置已还原`);
    // 4. 重启 dde-shell 让模式还原生效
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
    await new Promise((resolve) => setTimeout(resolve, 8000));
    await uos.showDesktop();
  });
});
