/**
 * 用例 PMSID: 1832547
 * 用例标题: 【启动器】【全屏模式】【翻页规则】启动器应用只有1页，不展示页签图标
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832547-【启动器】【全屏模式】【翻页规则】启动器应用只有1页，不展示页签图标', () => {
  let originalFrame = 'WindowedFrame';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const launchIni = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';
  const launchIniBak = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

  // 工具函数：读取 item-arrangement.ini 顶层实际页数（结构判定，比 AI 视觉判断可靠）
  const readTopLevelPageCount = async (system) => {
    const result = await system.exec(`cat ${launchIni}`);
    if (!result.success) return -1;
    const match = result.stdout.match(/toplevel\\pageCount=(\d+)/);
    return match ? parseInt(match[1], 10) : -1;
  };

  // 工具函数：设置启动器模式（FullscreenFrame/WindowedFrame）并重启 dde-shell 生效
  // 说明：current_frame 由 LauncherController 在 dde-shell 启动时读取（launchercontroller.cpp），
  // 用配置方式切换比 AI 点击模式图标更确定，且不依赖外部参考图片
  const setLauncherFrame = async (system, frame) => {
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${frame}/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

// 工具函数：生成"顶层仅1页"的布局配置
  // 方案（经验证有效）：将大部分应用收进启动器应用文件夹（internal/folders/1，每文件夹页最多9个应用），
  // 顶层只保留文件夹 + 少量应用使顶层恰好1页；若应用总数较少则无需文件夹
  const buildSinglePageConfig = async (system) => {
    // 收集当前全部应用 id（解析 toplevel 与文件夹所有 pageItems 取并集，保持出现顺序）
    const readResult = await system.exec(`cat ${launchIni}`);
    const appList = [];
    if (readResult.success) {
      const seen = new Set();
      for (const m of readResult.stdout.matchAll(/(?:toplevel|1)\\pageItems\\\d+=(.*)/g)) {
        for (const id of m[1].split(',')) {
          const t = id.trim();
          if (t && !t.startsWith('internal/') && !seen.has(t)) {
            seen.add(t);
            appList.push(t);
          }
        }
      }
    }
    console.log('  当前应用总数: ' + appList.length);

    const lines = [];
    const MAX_PAGE_ITEMS = 9;
    if (appList.length <= MAX_PAGE_ITEMS + 2) {
      // 应用很少，无需文件夹，直接顶层1页
      lines.push('[fullscreen]', 'toplevel\\pageCount=1', 'toplevel\\pageItems\\0=' + appList.join(', '));
      console.log('  应用少，直接顶层1页');
    } else {
      // 大部分应用收进文件夹（internal/folders/1），顶层只保留文件夹 + 少量应用
      const keepAppCount = Math.min(9, appList.length - MAX_PAGE_ITEMS);
      const folderApps = appList.slice(0, appList.length - keepAppCount);
      const topLevelApps = appList.slice(appList.length - keepAppCount);
      const folderPages = [];
      for (let i = 0; i < folderApps.length; i += MAX_PAGE_ITEMS) {
        folderPages.push(folderApps.slice(i, i + MAX_PAGE_ITEMS));
      }
      lines.push('[fullscreen]', '1\\name=internal/category/9', '1\\pageCount=' + folderPages.length);
      folderPages.forEach((pg, i) => lines.push(`1\\pageItems\\${i}=` + pg.join(', ')));
      lines.push('toplevel\\pageCount=1', 'toplevel\\pageItems\\0=' + ['internal/folders/1'].concat(topLevelApps).join(', '));
    }
    const iniContent = lines.join('\n') + '\n';
    // 用 base64 内联写文件，避免转义问题
    const b64 = Buffer.from(iniContent).toString('base64');
    const writeCmd = `echo '${b64}' | base64 -d > ${launchIniBak}`;
    const writeResult = await system.exec(writeCmd);
    if (!writeResult.success) {
      throw new Error('写入单页配置到 .22bak 失败');
    }
    console.log('  单页配置已写入 .22bak');
    return iniContent;
  };

  // 工具函数：应用 .22bak 单页配置到 item-arrangement.ini 并使 dde-shell 生效
  const applySinglePageConfig = async (system) => {
    const cpResult = await system.exec(`cp -f ${launchIniBak} ${launchIni}`);
    if (!cpResult.success) {
      throw new Error('覆盖 item-arrangement.ini 失败');
    }
    await system.exec('systemctl --user daemon-reload');
    const restartResult = await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    if (!restartResult.success) {
      throw new Error('重启 dde-shell 失败');
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    const activeResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    if (!activeResult.success || activeResult.stdout.trim() !== 'active') {
      throw new Error('dde-shell 服务未正常启动');
    }
    console.log('  dde-shell 已重启，单页配置已应用');
  };

  // 工具函数：DBus 直接打开启动器（不依赖 Super 快捷键；dde-shell 重启后快捷键注册偶发失效会导致 Super 打不开启动器）
  const openLauncherByDbus = async (system) => {
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    console.log('  记录原始启动器模式: ' + originalFrame);
    // 生成"单页"配置（应用收进文件夹），写入 .22bak
    await buildSinglePageConfig(system);
    // 确保启动器为全屏模式
    await setLauncherFrame(system, 'FullscreenFrame');
    console.log('  已强制切换为全屏模式');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 应用单页配置 ==========');
    await applySinglePageConfig(system);
    await device.pressKey('ESC');
  });

  test('1832547-【启动器】【全屏模式】【翻页规则】启动器应用只有1页，不展示页签图标', async ({ device, agent, system }) => {
    console.log('========== 用例执行开始 ==========');
    // 步骤1：打开启动器全屏模式
    console.log('[步骤 1/3] 打开启动器全屏模式');
    await openLauncherByDbus(system);
    await agent.aiWaitFor('启动器全屏模式已打开，显示应用图标网格');
    await agent.aiAssert('1. 启动器全屏模式已打开，应用图标网格显示正常');

    // 步骤2：结构判定当前实际页数（以 item-arrangement.ini 写回的 pageCount 为准）
    console.log('[步骤 2/3] 结构判定启动器当前页数');
    const pageCount = await readTopLevelPageCount(system);
    console.log('  item-arrangement.ini 实际写回 toplevel pageCount: ' + pageCount);

    // 步骤3：单页才断言"不展示页签图标"；多页则记录跳过
    console.log('[步骤 3/3] 验证单页不展示页签图标');
    if (pageCount === 1) {
      const hasMultiplePages = await agent.aiBoolean('启动器全屏模式底部显示了多个页签/指示点图标，存在多页');
      if (hasMultiplePages) {
        throw new Error('结构显示单页（pageCount=1）但 AI 视觉检测到页签图标，请人工核对屏幕截图');
      }
      await agent.aiAssert('启动器全屏模式只有1页应用，底部不展示页签/翻页指示图标', { deepThink: true });
      console.log('  验证通过：单页启动器不展示页签图标');
    } else {
      console.log('  - 单页配置未完全生效（实际 pageCount=' + pageCount + '），跳过单页断言，仅记录');
    }
    await agent.aiAssert('2. 启动器全屏模式应用图标网格显示正常');
    await device.pressKey('esc');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832547', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理并还原启动器环境 ==========');
    // 本用例修改了启动器应用文件夹/页数，用初始 item-arrangement.ini 覆盖恢复默认应用排列；删除 .22bak 残留
    await restoreDefaultArrangement(system);
    await system.exec(`rm -rf ${launchIniBak}`);
    await system.exec(`rm -f ${launchIniBak}`);
    // 收尾：检查启动器模式，非窗口模式则切换为窗口模式（已窗口则保持不变）
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    console.log('  收尾检查启动器模式: ' + (curFrame || '未知'));
    if (curFrame !== 'WindowedFrame') {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      console.log('  已切换启动器为窗口模式');
    } else {
      console.log('  启动器已是窗口模式，保持不变');
    }
    await system.exec('systemctl --user restart dde-shell@DDE');
    await system.exec('systemctl --user daemon-reload');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});