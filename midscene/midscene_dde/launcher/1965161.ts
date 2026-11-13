/**
 * 用例 PMSID: 1965161
 * 用例标题: 【启动器】【wine应用卸载】同时卸载多个wine应用
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1965161-【启动器】【wine应用卸载】同时卸载多个wine应用', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const wineApps = [
    { name: '植物大战僵尸', pkg: 'com.popcap.plantsvszombies.deepin' },
    { name: '汽水音乐', pkg: 'com.sodamusic.deepin' },
  ];

  // ── 工具函数：等待两个"卸载成功"通知 ──
  // 点击"确认卸载"后两个应用都已卸载，此时：
  //   super+M 打开通知中心 → 等待5秒 → 点击通知中心面板"通知中心"菜单下方的重叠通知信息
  //   → 展开后用 aiAssert 判断是否为卸载成功通知；
  // 每轮等待5秒后检查，最多轮询60秒；两个通知都确认到即返回，超时抛错
  const waitForUninstallNotices = async (agent, device) => {
    let foundPvz = false;
    let foundSoda = false;
    const checkDeadline = Date.now() + 60000;
    while (Date.now() < checkDeadline && !(foundPvz && foundSoda)) {
      // super+M 打开通知中心面板
      await device.pressKey('super', 'm');
      // 等待5秒，让两条卸载成功通知都进入通知中心
      await new Promise(resolve => setTimeout(resolve, 5000));
      // 点击通知中心面板"通知中心"菜单下方的重叠的通知信息（点击展开堆叠/折叠的多条通知）
      try {
        await agent.aiTap('通知中心面板中"通知中心"菜单下方的重叠的通知信息（多条通知堆叠在一起，点击展开所有通知详情）', { deepThink: true });
      } catch (e) {
        console.log('  - 点击重叠通知未命中，继续检查');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!(foundPvz && foundSoda)) {
        try {
          await agent.aiAssert('通知中心面板中"通知中心"菜单下方展开的通知信息显示"植物大战僵尸"和"汽水音乐"两条卸载成功通知（文案分别包含植物大战僵尸/汽水音乐和卸载成功字样）');
          foundPvz = true;
          foundSoda = true;
          console.log('  - 植物大战僵尸、汽水音乐卸载成功通知信息均已确认');
          return;
        } catch (e) {
          console.log('  - 本轮断言未通过（两条卸载成功通知未同时可见），继续轮询');
        }
      }
      await device.pressKey('esc');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    throw new Error('60秒内未同时检测到"植物大战僵尸"和"汽水音乐"的卸载成功通知');
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('========== beforeAll ==========');
    // 清理历史通知，避免干扰后续"卸载成功"通知判断
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.releaseAllKeys();
  });

  test('1965161-【启动器】【wine应用卸载】同时卸载多个wine应用', async ({ device, agent, uos, system, env }) => {
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/7：终端下载2个 wine 应用，确认都下载成功 ──
    console.log('[步骤 1/7] 先 apt update 更新软件源，再下载 wine 应用：植物大战僵尸、汽水音乐');
    // 先更新软件源，避免过期索引导致 apt install 找不到/安装失败
    const updateCmd = `echo '${env.testPassword}' | sudo -S apt update`;
    const updateResult = await system.exec(updateCmd, 300000);
    if (!updateResult.success) {
      throw new Error('apt update 更新软件源失败');
    }
    for (const app of wineApps) {
      const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y ${app.pkg}`;
      const installResult = await system.exec(installCmd, 600000);
      if (!installResult.success) {
        throw new Error(`终端下载安装${app.name}失败`);
      }
      const checkResult = await system.exec(`dpkg -l ${app.pkg} 2>/dev/null | grep "^ii"`);
      if (!checkResult.success || checkResult.stdout.trim() === '') {
        throw new Error(`${app.name}下载成功确认失败：包未处于已安装状态`);
      }
      console.log(`  - ${app.name}下载安装成功`);
    }
    // 重启 dde-shell，确保启动器刷新应用列表并出现在"最近安装"
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));

    // ── 步骤 2/7：右键植物大战僵尸 → 卸载，弹出卸载窗口后不操作 ──
    console.log('[步骤 2/7] 打开启动器，右键植物大战僵尸 → 卸载，弹窗不操作');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('启动器最近安装区域中的植物大战僵尸应用图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('卸载');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查植物大战僵尸卸载确认弹窗已弹出
    await agent.aiAssert('屏幕中央显示标题包含"是否确定卸载植物大战僵尸"的卸载确认弹窗，包含确认卸载按钮');
    console.log('  - 植物大战僵尸卸载确认弹窗已弹出，暂不操作（不按 esc，保留弹窗）');

    // ── 步骤 3/7：再次打开启动器，右键汽水音乐 → 卸载 ──
    console.log('[步骤 3/7] 再次打开启动器，右键汽水音乐 → 卸载');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('启动器最近安装区域中的汽水音乐应用图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('卸载');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查汽水音乐卸载确认弹窗已弹出
    await agent.aiAssert('屏幕中央显示标题为"是否确定卸载汽水音乐"的卸载确认弹窗，包含确认卸载按钮');
    console.log('  - 汽水音乐卸载确认弹窗已弹出');

    // ── 步骤 4/7：点击汽水音乐弹窗的"确认卸载"按钮 ──
    console.log('[步骤 4/7] 点击汽水音乐卸载弹窗的确认卸载按钮');
    await agent.aiTap('标题为"是否确定卸载汽水音乐"的卸载确认弹窗中的确认卸载按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ── 步骤 5/7：再点击植物大战僵尸弹窗的"确认卸载"按钮 ──
    console.log('[步骤 5/7] 点击植物大战僵尸卸载弹窗的确认卸载按钮');
    const pvzDialogOpen = await agent.aiBoolean('界面显示标题包含"是否确定卸载植物大战僵尸"的卸载确认弹窗', { deepThink: true });
    if (pvzDialogOpen) {
      await agent.aiTap('标题包含"是否确定卸载植物大战僵尸"的卸载确认弹窗中的确认卸载按钮', { deepThink: true });
      console.log('  - 已点击植物大战僵尸卸载弹窗的确认卸载按钮');
    } else {
      console.log('  - 植物大战僵尸卸载弹窗未检测到（可能被汽水音乐弹窗复用覆盖），交由卸载通知校验');
    }
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ── 步骤 6/7：super+M 等待两个卸载成功通知（轮询60秒，超时即报错）──
    console.log('[步骤 6/7] super+M 等待植物大战僵尸、汽水音乐卸载成功通知（最多60秒）');
    await waitForUninstallNotices(agent, device);

    // ── 步骤 7/7：打开启动器，检查是否存在"最近安装"菜单 ──
    console.log('[步骤 7/7] 打开启动器，检查是否存在"最近安装"菜单');
    // 重启 dde-shell 规避应用列表"隐形缓存"（dde-application-manager 可能把已删应用写回）
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasRecentMenu = await agent.aiBoolean('启动器界面存在"最近安装"菜单');
    if (!hasRecentMenu) {
      console.log('  - 启动器已无"最近安装"菜单');
    } else {
      await agent.aiAssert('启动器"最近安装"菜单中不显示植物大战僵尸和汽水音乐应用');
      console.log('  - "最近安装"菜单仍在但已无植物大战僵尸、汽水音乐（可能还有其他最近安装应用）');
    }
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1965161', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ agent, device, system, env }) => {
    console.log('========== afterAll ==========');
    // 终端 apt remove 兜底卸载植物大战僵尸、汽水音乐
    console.log('[1/2] 终端 apt remove 卸载植物大战僵尸、汽水音乐（兜底）');
    for (const app of wineApps) {
      const removeCmd = `echo '${env.testPassword}' | sudo -S apt remove -y ${app.pkg}`;
      await system.exec(removeCmd, 300000);
    }
    // 清理通知并恢复桌面
    console.log('[2/2] 清理通知并恢复桌面');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
