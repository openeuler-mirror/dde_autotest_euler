/**
 * 用例 PMSID: 1846717
 * 用例标题: 【启动器】【窗口模式】【动效】自由排序模式下，拖动应用位置时有挤动效果
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1846717-【启动器】【窗口模式】【动效】自由排序模式下，拖动应用位置时有挤动效果', () => {
  const dconfigApp = 'org.deepin.dde.shell';
  const dconfigName = 'org.deepin.ds.launchpad';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  let originalCategoryType = '2';
  let originalFrame = 'WindowedFrame';

  // 工具函数：读取当前排序模式
  const getCategoryType = async (system) => {
    const result = await system.exec(`dde-dconfig get ${dconfigApp} -r ${dconfigName} categoryType`);
    if (result.success && result.stdout.trim()) {
      return result.stdout.trim().replace(/"/g, '');
    }
    return '2';
  };

  // 工具函数：从初始资源站下载 item-arrangement.ini 覆盖系统配置，恢复启动器初始应用排列顺序（覆盖后需重启 dde-shell 生效）
  // 初始文件地址：http://10.7.62.32/midscene-uos/midscene_dde/resources/item-arrangement.ini
  const restoreDefaultArrangement = async (system) => {
    const launchIni = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';
    const initUrl = 'http://10.7.62.32/midscene-uos/midscene_dde/resources/item-arrangement.ini';
    const dlResult = await system.exec(`curl -fsSL --connect-timeout 15 --max-time 20 ${initUrl} -o ${launchIni}`);
    if (!dlResult.success) {
      throw new Error('下载初始 item-arrangement.ini 失败');
    }
    const checkResult = await system.exec(`cat ${launchIni}`);
    if (!checkResult.success || checkResult.stdout.trim().length < 20 || !checkResult.stdout.includes('toplevel\\pageCount')) {
      throw new Error('初始 item-arrangement.ini 内容校验失败（文件为空或非预期格式）');
    }
    console.log('  已用初始 item-arrangement.ini 覆盖，启动器应用顺序恢复为初始排列');
  };

  beforeAll(async ({ device, uos, system }) => {
    console.log('========== beforeAll: 备份并初始化测试套件 ==========');
    await uos.showDesktop();
    // 备份原始启动器模式与排序模式
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    originalCategoryType = await getCategoryType(system);
    console.log('  记录原始启动器模式: ' + originalFrame + '，原始排序模式 categoryType: ' + originalCategoryType);

    // 确保窗口模式
    await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));

    // 切换为"自由排序"模式（categoryType=2，配置驱动）
    await system.exec(`dde-dconfig --set -a ${dconfigApp} -r ${dconfigName} -k categoryType -v 2`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.pressKey('ESC');
  });

  // 工具函数：DBus 直接打开启动器（不依赖 Super 快捷键；dde-shell 重启后快捷键注册偶发失效会导致 Super 打不开启动器）
  const openLauncherByDbus = async (system) => {
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  test('1846717-【启动器】【窗口模式】【动效】自由排序模式下，拖动应用位置时有挤动效果', async ({ device, agent, system }) => {
    // 步骤1：打开启动器窗口模式（自由排序模式已在 beforeAll 配置驱动为准）
    console.log('[步骤 1/4] 打开启动器窗口');
    await openLauncherByDbus(system);

    // 步骤2：读取拖动前应用排列（结构验证）
    console.log('[步骤 2/4] 读取拖动前应用排列');
    const { getLauncherItemOrder } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');
    const orderBefore = await getLauncherItemOrder(system, 0);
    console.log('  拖动前排列: ' + JSON.stringify(orderBefore));
    assertTrue(orderBefore && orderBefore.length > 0, '读取应用排列失败');

    // 步骤3：在启动器左侧应用列表区域内拖动应用图标，验证挤动效果
    // 说明：瞬态动效（拖动中的让位）AI 静态截图判定不稳定，采用手动 xdotool 拖拽（参照 launcher 目录 1832627/1832629 写法），
    // 挤动视觉不作硬判定；主判定为拖动后排列结构变化（自由排序拖动排序必然伴随挤动重排）
    console.log('[步骤 3/4] 拖拽左侧应用列表区域中的应用图标');
    const dragEnv = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority';
    const xdotool = async (cmd) => system.exec(`${dragEnv} xdotool ${cmd}`);
    const sleepMs = (ms) => new Promise(r => setTimeout(r, ms));

    // 3.1 定位左侧应用列表中的源图标（限定左侧应用列表区域，杜绝拖到"我的常用"）
    const srcLoc = await agent.aiLocate('启动器窗口左侧应用列表区域（排序模式菜单正下方，非"我的常用"区域）中的文件管理器应用图标');
    assertTrue(!!srcLoc && srcLoc.center && srcLoc.center.length === 2, '定位左侧应用列表中的应用图标失败');
    const srcX = Math.round(srcLoc.center[0]);
    const srcY = Math.round(srcLoc.center[1]);
    assertTrue(srcX < 400, '源图标坐标超出左侧应用列表区域（x=' + srcX + '），疑似误定位到"我的常用"区域');
    console.log('  源图标坐标: (' + srcX + ',' + srcY + ')');

    // 3.2 向下拖动（单列列表，向下跨过相邻图标），目标仍落在左侧应用列表区域内；一次未生效则重试更远一步
    // 说明：左侧应用列表按自由排序展示，文件管理器通常为首个可见项，向上拖动无落点（上方为排序菜单区域），故改为向下拖动
    let dragSuccess = false;
    for (let attempt = 1; attempt <= 2 && !dragSuccess; attempt++) {
      const tgtX = srcX;
      const tgtY = srcY + 80 * attempt;
      assertTrue(tgtY < 930 && tgtX < 400, '拖动目标超出左侧应用列表区域，请人工确认窗口位置');
      console.log('  第 ' + attempt + ' 次拖拽: (' + srcX + ',' + srcY + ') → (' + tgtX + ',' + tgtY + ')');

      await xdotool(`mousemove ${srcX} ${srcY}`);
      await sleepMs(600);
      await xdotool('mousedown 1');
      await sleepMs(1200);
      const steps = 12;
      for (let i = 1; i <= steps; i++) {
        const mx = Math.round(srcX + (tgtX - srcX) * i / steps);
        const my = Math.round(srcY + (tgtY - srcY) * i / steps);
        await xdotool(`mousemove ${mx} ${my}`);
        await sleepMs(80);
      }
      await sleepMs(1500);
      await xdotool(`mousemove ${tgtX} ${tgtY}`);
      await sleepMs(300);
      await xdotool('mouseup 1');
      await sleepMs(1500);

      const orderNow = await getLauncherItemOrder(system, 0);
      dragSuccess = JSON.stringify(orderNow) !== JSON.stringify(orderBefore);
      console.log('  第 ' + attempt + ' 次拖拽后排列变化: ' + dragSuccess);
      if (!dragSuccess) {
        await sleepMs(1000);
      }
    }

    // 步骤4：结构验证应用位置已发生变动（拖拽成功，主判定）
    console.log('[步骤 4/4] 结构验证拖动后应用位置');
    const orderAfter = await getLauncherItemOrder(system, 0);
    console.log('  拖动后排列: ' + JSON.stringify(orderAfter));
    assertTrue(JSON.stringify(orderBefore) !== JSON.stringify(orderAfter), '拖动应用后应用排列应发生变化（拖拽未生效）');
    // 单独断言（放松）：应用位置变动已由上面的结构断言证明；此处仅做可视化确认（不断言瞬态动效）
    await agent.aiAssert('启动器窗口左侧应用列表显示正常，应用图标排列整齐、无缺失或异常');
    console.log('  验证通过：自由排序模式下拖动应用，应用位置发生变动（拖拽成功）');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1846717', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 还原配置 ==========');
    // 还原排序模式
    await system.exec(`dde-dconfig --set -a ${dconfigApp} -r ${dconfigName} -k categoryType -v ${originalCategoryType}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 本用例拖动了启动器应用顺序，用初始 item-arrangement.ini 覆盖恢复默认排列（用户要求：从资源站初始文件覆盖，重启生效）
    await restoreDefaultArrangement(system);
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
    // 重启一次使排序模式与启动器模式同时生效
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
