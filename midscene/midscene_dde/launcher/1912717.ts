/**
 * 用例 PMSID: 1912717
 * 用例标题: 【启动器】【全屏模式】打印机管理连接打印机安装打印驱动，启动器打印驱动名称显示正常
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1912717-【启动器】【全屏模式】打印机管理连接打印机安装打印驱动，启动器打印驱动名称显示正常', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const hpPkg = 'com.hp.hplip';

  // 工具函数：设置启动器模式（FullscreenFrame/WindowedFrame）并重启 dde-shell 生效
  const setLauncherFrame = async (system, frame) => {
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${frame}/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

  // 工具函数：DBus 直接打开启动器（不依赖 Super 快捷键；dde-shell 重启后快捷键注册偶发失效会导致 Super 打不开启动器）
  const openLauncherByDbus = async (system) => {
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  // 工具函数：从初始资源站下载 item-arrangement.ini 覆盖系统配置，恢复启动器初始应用排列顺序（覆盖后需重启 dde-shell 生效）
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

  beforeAll(async ({ system, env, agent, device }) => {
    console.log('========== beforeAll: 检查并安装 HP 打印驱动 ==========');
    // 1. 先 apt update 更新软件包，避免过期索引导致 apt install 失败
    console.log('  [1/4] apt update 更新软件源');
    const updateResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt update`, 300000);
    if (!updateResult.success) {
      throw new Error('apt update 更新软件源失败');
    }
    // 2. 检查是否已安装（dpkg ^ii 才算已安装），已安装则跳过安装
    console.log('  [2/4] 检查 ' + hpPkg + ' 是否已安装');
    const installedResult = await system.exec(`dpkg -l ${hpPkg} 2>/dev/null | grep "^ii"`);
    let checkResult;
    if (installedResult.success && installedResult.stdout.trim() !== '') {
      console.log('  - 已安装，跳过重复安装');
      checkResult = installedResult;
    } else {
      console.log('  - 未安装，开始安装...');
      const installResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt install -y ${hpPkg}`, 900000);
      if (!installResult.success) {
        throw new Error('安装 ' + hpPkg + ' 失败');
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
      checkResult = await system.exec(`dpkg -l ${hpPkg} 2>/dev/null | grep "^ii"`);
    }
    // 3. dpkg 校验包已处于已安装状态
    if (!checkResult.success || checkResult.stdout.trim() === '') {
      throw new Error(hpPkg + ' 安装成功确认失败：包未处于已安装状态');
    }
    console.log('  - HP 打印驱动安装成功');
    // 4. 确保启动器窗口模式 + 重启 dde-shell 刷新应用列表（HP 驱动出现在"最近安装"）
    console.log('  [3/3] 确保窗口模式并重启 dde-shell 刷新应用列表');
    await setLauncherFrame(system, 'WindowedFrame');
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.pressKey('ESC');
  });

  test('1912717-【启动器】【全屏模式】打印机管理连接打印机安装打印驱动，启动器打印驱动名称显示正常', async ({ device, agent, system }) => {
    // 步骤1：打开启动器（窗口模式），检查"最近安装"中 HP 打印驱动图标
    console.log('[步骤 1/3] 打开启动器窗口模式，检查"最近安装"中的 HP 打印驱动图标');
    await openLauncherByDbus(system);
    await agent.aiAssert('启动器窗口界面"最近安装"区域显示了刚安装的 HP 打印驱动应用图标（名称包含 HP 字样，如 HP Device Manager、HP 打印机管理等条目）', { deepThink: true });
    console.log('  验证通过：窗口模式"最近安装"中 HP 打印驱动图标显示正常');
    await device.pressKey('esc');
    await new Promise(resolve => setTimeout(resolve, 800));

    // 步骤2：切换到启动器全屏模式，在搜索框输入 HP 搜索
    console.log('[步骤 2/3] 切换到全屏模式并搜索 HP');
    await setLauncherFrame(system, 'FullscreenFrame');
    await openLauncherByDbus(system);
    await agent.aiTap('启动器全屏模式顶部居中的搜索输入框，呈矩形，内有放大镜图标', { deepThink: true });
    await device.typeText('hp');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤3：检查搜索结果中的 HP 相关图标显示正常
    console.log('[步骤 3/3] 检查搜索"HP"结果中的 HP 相关图标');
    await agent.aiAssert('启动器全屏模式搜索结果中显示了 HP 打印驱动相关应用图标（名称包含 HP 字样，如 HP Device Manager、HP 打印机管理等）', { deepThink: true });
    console.log('  验证通过：搜索 HP 后相关应用图标显示正常');
    await agent.aiAssert('启动器全屏模式搜索结果中 HP 相关应用图标的名称可辨认且包含 HP 关键字', { deepThink: true });
    console.log('  验证通过：搜索 HP 后应用图标名称可辨认');
    await device.pressKey('esc');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1912717', 'level4'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system, env }) => {
    console.log('========== afterAll: 卸载驱动并还原启动器模式 ==========');
    // 1. 先卸载 HP 打印驱动
    console.log('  [1/2] apt remove 卸载 ' + hpPkg);
    const removeResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt remove -y ${hpPkg}`, 300000);
    if (!removeResult.success) {
      throw new Error('卸载 ' + hpPkg + ' 失败');
    }
    // 2. dpkg 校验已不在已安装状态
    const rmCheckResult = await system.exec(`dpkg -l ${hpPkg} 2>/dev/null | grep "^ii"`);
    if (rmCheckResult.success && rmCheckResult.stdout.trim() !== '') {
      throw new Error(hpPkg + ' 卸载后仍处于已安装状态');
    }
    console.log('  - 卸载成功');

    // 2.5 本用例安装过驱动应用（影响启动器应用列表/顺序），用初始 item-arrangement.ini 覆盖恢复默认排列
    await restoreDefaultArrangement(system);

    // 3. 收尾：检查启动器模式，非窗口模式则切换为窗口模式（已窗口则保持不变）；无论如何重启一次使初始排列生效
    console.log('  [2/2] 收尾检查启动器模式');
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
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
