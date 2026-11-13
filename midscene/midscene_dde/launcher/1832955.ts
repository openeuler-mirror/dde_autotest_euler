/**
 * 用例 PMSID: 1832955
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，关闭启动器后再打开，应用文件夹被收起
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832955-【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，关闭启动器后再打开，应用文件夹被收起', () => {
  let originalFrame = 'WindowedFrame';
  let originalCategoryType = '2';
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const iniFile = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';
  const dconfigApp = 'org.deepin.dde.shell';
  const dconfigName = 'org.deepin.ds.launchpad';
  const FOLDER_APPS = ['deepin-movie.desktop', 'deepin-music.desktop'];

  // 工具函数：从初始资源站下载 item-arrangement.ini 覆盖系统配置，恢复启动器初始应用排列顺序（覆盖后需重启 dde-shell 生效）
  const restoreDefaultArrangement = async (system) => {
    const initUrl = 'http://10.7.62.32/midscene-uos/midscene_dde/resources/item-arrangement.ini';
    const dlResult = await system.exec(`curl -fsSL --connect-timeout 15 --max-time 20 ${initUrl} -o ${iniFile}`);
    if (!dlResult.success) {
      throw new Error('下载初始 item-arrangement.ini 失败');
    }
    const checkResult = await system.exec(`cat ${iniFile}`);
    if (!checkResult.success || checkResult.stdout.trim().length < 20 || !checkResult.stdout.includes('toplevel\\pageCount')) {
      throw new Error('初始 item-arrangement.ini 内容校验失败（文件为空或非预期格式）');
    }
    console.log('  已用初始 item-arrangement.ini 覆盖，启动器应用顺序恢复为初始排列');
  };

  // 工具函数：读取当前排序模式
  const getCategoryType = async (system) => {
    const result = await system.exec(`dde-dconfig get ${dconfigApp} -r ${dconfigName} categoryType`);
    if (result.success && result.stdout.trim()) {
      return result.stdout.trim().replace(/"/g, '');
    }
    return '2';
  };

  // 工具函数：构造"影院+音乐合并为应用文件夹"的 item-arrangement.ini 配置（动态基于当前应用清单生成，base64 内联写文件避免转义问题）
  const buildFolderConfig = async (system) => {
    const readResult = await system.exec(`cat ${iniFile}`);
    const appList = [];
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
    const topLevelApps = appList.filter((a) => FOLDER_APPS.indexOf(a) === -1);
    console.log('  应用总数: ' + appList.length + '，放入文件夹: ' + FOLDER_APPS.join(', '));

    // 文件夹：影院 + 音乐
    const lines = ['[fullscreen]', '1\\name=internal/category/9', '1\\pageCount=1', '1\\pageItems\\0=' + FOLDER_APPS.join(', ')];
    // 顶层：文件夹图标置于首位，其余应用按每页最多 30 个铺页，全部列出避免 launcher 追加缺失应用导致重排
    const PER_PAGE = 30;
    const pages = [];
    for (let i = 0; i < topLevelApps.length; i += PER_PAGE) {
      pages.push(topLevelApps.slice(i, i + PER_PAGE));
    }
    pages[0] = ['internal/folders/1'].concat(pages[0] || []);
    lines.push('toplevel\\pageCount=' + pages.length);
    pages.forEach((pg, i) => lines.push('toplevel\\pageItems\\' + i + '=' + pg.join(', ')));

    const content = lines.join('\n') + '\n';
    const b64 = Buffer.from(content).toString('base64');
    const writeCmd = `python3 -c "import base64; f=open('${iniFile}','w'); f.write(base64.b64decode('${b64}').decode()); f.close()"`;
    const writeResult = await system.exec(writeCmd);
    if (!writeResult.success) {
      throw new Error('写入应用文件夹配置失败');
    }
    console.log('  已写入含"影院+音乐"应用文件夹的 item-arrangement.ini');
  };

  // 工具函数：DBus 直接打开启动器（不依赖 Super 快捷键；dde-shell 重启后快捷键注册偶发失效）
  const openLauncherByDbus = async (system) => {
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  beforeAll(async ({ device, uos, system }) => {
    console.log('========== beforeAll: 构造应用文件夹并初始化测试套件 ==========');
    await uos.showDesktop();
    // 记录原始启动器模式与排序模式
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    originalCategoryType = await getCategoryType(system);
    console.log('  记录原始启动器模式: ' + originalFrame + '，原始排序模式 categoryType: ' + originalCategoryType);

    // 构造"影院+音乐"应用文件夹配置 + 全屏模式 + 自由排序，一次重启同时生效
    await buildFolderConfig(system);
    await system.exec(`dde-dconfig --set -a ${dconfigApp} -r ${dconfigName} -k categoryType -v 2`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(`sed -i "s/current_frame=.*/current_frame=FullscreenFrame/" ${settingsIni}`);
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    // 读回校验排序模式确为自由排序（categoryType=2），确保应用文件夹在网格中可见
    const catTypeCheck = await getCategoryType(system);
    console.log('  重启后排序模式 categoryType: ' + catTypeCheck);
    if (catTypeCheck !== '2') {
      throw new Error('排序模式未切换为自由排序（categoryType=' + catTypeCheck + '），应用文件夹将不可见');
    }

    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.pressKey('ESC');
  });

  test('1832955-【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，关闭启动器后再打开，应用文件夹被收起', async ({ device, agent, system }) => {
    // 步骤1：打开启动器全屏模式
    console.log('========== 用例执行开始 ==========');
    console.log('[步骤 1/4] 打开启动器全屏模式');
    await openLauncherByDbus(system);
    await agent.aiWaitFor('启动器全屏模式已打开，界面中显示了名称为"系统管理"的应用文件夹图标');
    console.log('  验证通过：启动器已显示且应用网格含应用文件夹图标');

    // 步骤2：点击"系统管理"应用文件夹图标，将其打开
    console.log('[步骤 2/4] 点击"系统管理"应用文件夹图标，打开文件夹');
    await agent.aiTap('启动器全屏模式中名称为"系统管理"的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('2. 应用文件夹已打开，界面显示文件夹内应用图标（影院、音乐）');

    // 步骤3：按 Super 关闭整个启动器，再按 Super 重新打开
    console.log('[步骤 3/4] 按 Super 关闭启动器，再按 Super 重新打开');
    await device.pressKey('Super');
    await new Promise(resolve => setTimeout(resolve, 1200));
    await agent.aiWaitFor('启动器已关闭，界面回到桌面');
    console.log('  启动器已关闭');
    await device.pressKey('Super');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiWaitFor('启动器已重新打开');

    // 步骤4：验证应用文件夹被收起（未展开显示文件夹内应用）
    console.log('[步骤 4/4] 验证应用文件夹被收起');
    await agent.aiAssert('3. 重新打开启动器后，窗口内没有展开的应用文件夹内容（影院、音乐未被内联展开显示，应用文件夹处于收起状态）');
    console.log('  验证通过：关闭启动器再打开后应用文件夹被收起');
    await device.pressKey('esc');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832955', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 恢复启动器默认排列并还原配置 ==========');
    // 本用例构造了应用文件夹并修改了应用排列，用初始 item-arrangement.ini 覆盖恢复默认排序
    await restoreDefaultArrangement(system);
    // 还原排序模式
    await system.exec(`dde-dconfig --set -a ${dconfigApp} -r ${dconfigName} -k categoryType -v ${originalCategoryType}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    // 一次重启使初始排列 + 排序模式 + 启动器模式同时生效
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});