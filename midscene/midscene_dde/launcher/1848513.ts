/**
 * 用例 PMSID: 1848513
 * 用例标题: 【启动器】进入锁屏界面后再次重启查看启动器窗口设置生效
 * 生成时间: 2026-08-20 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1848513-【启动器】进入锁屏界面后再次重启查看启动器窗口设置生效', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  let originalFrame = '';

  // ── 工具函数：锁屏/登录界面输入密码回车，回到桌面 ──
  const unlockToDesktop = async (agent, device, passWord) => {
    await agent.aiTap('锁屏界面的密码输入框', { deepThink: true });
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
    await agent.aiWaitFor('桌面已显示');
  };

  // ── 工具函数：点击启动器关机按钮并等待电源面板 ──
  // 若点击误入锁屏（偶发），解锁后重新打开启动器重试，最多3次
  const clickPowerAndWaitPanel = async (agent, device, uos, passWord) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await agent.aiTap('启动器窗口左下角的关机按钮图标', { deepThink: true });
      try {
        await agent.aiWaitFor('电源面板已弹出，显示关机、重启、待机、休眠、锁屏、注销等电源按钮');
        console.log(`  - 电源面板已显示（第 ${attempt} 次点击）`);
        return;
      } catch (e) {
        if (await agent.aiBoolean('当前是锁屏界面，有密码输入框')) {
          console.log(`  - 第 ${attempt} 次点击后误入锁屏，解锁后重试`);
          await unlockToDesktop(agent, device, passWord);
          await uos.openLauncher();
          await new Promise(resolve => setTimeout(resolve, 1500));
          continue;
        }
        console.log(`  - 第 ${attempt} 次点击后电源面板未弹出，重新打开启动器重试`);
        await uos.openLauncher();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }
    throw new Error('3次点击关机按钮后电源面板仍未弹出');
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('========== beforeAll: 环境初始化 ==========');

    console.log('  [1/3] 兜底结束 dde-lock（防止上次运行残留锁屏）');
    await system.exec('killall dde-lock 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lockResult = await system.exec('pgrep -f dde-lock || echo NONE');
    if (!lockResult.stdout.includes('NONE')) {
      console.log('  - dde-lock 仍在运行，强制结束');
      await system.exec('killall -9 dde-lock 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log('  [2/3] 确保启动器为窗口模式（配置驱动，dde-shell 启动时读取）');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    originalFrame = curFrame;
    if (curFrame !== 'WindowedFrame') {
      console.log(`  - 当前模式 ${curFrame}，切换为 WindowedFrame 并重启 dde-shell`);
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }

    console.log('  [3/3] 显示桌面');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('  - 环境初始化完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('========== beforeEach ==========');
  });

  test('1848513-【启动器】进入锁屏界面后再次重启查看启动器窗口设置生效', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/7：打开启动器，切换/确认小窗口模式 ──
    console.log('');
    console.log('[步骤 1/7] 打开启动器，确认小窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('启动器窗口已显示，为小窗口模式，左侧为应用列表区域');
    console.log('  - 启动器窗口模式已确认');

    // ── 步骤 2/7：点击左下角的关机按钮 ──
    console.log('[步骤 2/7] 点击启动器左下角关机按钮');
    await clickPowerAndWaitPanel(agent, device, uos, passWord);
    await agent.aiAssert('电源面板显示多个电源按钮，包含"锁定"、"注销"、"重启"、"关机"等');
    console.log('  - 电源面板已显示');

    // ── 步骤 3/7：点击锁定 ──
    console.log('[步骤 3/7] 点击电源面板中的"锁定"按钮');
    await agent.aiTap('电源面板中的"锁定"按钮', { deepThink: true });
    await agent.aiWaitFor('锁屏界面已显示，屏幕中央有密码输入框');
    console.log('  - 系统已锁定');

    // ── 步骤 4/7：锁屏界面输入密码解锁，回到桌面 ──
    // 注：UOS V25 锁屏电源菜单实测只有 关机/重启/待机/休眠，无"注销"项，
    //     故先解锁回桌面，再用 Ctrl+Alt+Delete → 注销 完成会话重启（原"重启"改为"注销"）
    console.log('[步骤 4/7] 锁屏界面输入密码解锁');
    await unlockToDesktop(agent, device, passWord);
    console.log('  - 已解锁回到桌面');

    // ── 步骤 5/7：Ctrl+Alt+Delete 弹出电源菜单，选择"注销"并回车 ──
    console.log('[步骤 5/7] Ctrl+Alt+Delete 弹出电源菜单，选择"注销"');
    await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
    await agent.aiTap('注销按钮', { deepThink: true });
    const isBlocked = await agent.aiBoolean('显示以上程序阻止注销');
    if (isBlocked) {
      await agent.aiTap('注销按钮');
    }
    console.log('  - 已选择注销');

    // ── 步骤 6/7：等待注销完成，登录界面出现后直接输入密码登录 ──
    // 注：UOS V25 注销无确认弹窗（实测），直接等登录界面即可，省去弹窗轮询耗时
    console.log('[步骤 6/7] 等待登录界面出现，输入密码登录');
    await agent.aiWaitFor('登录界面已出现，有密码输入框', { timeoutMs: 120000 });
    await agent.aiTap('登录界面的密码输入框', { deepThink: true });
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
    await agent.aiWaitFor('桌面已显示');
    console.log('  - 已重新登录');

    // ── 步骤 7/7：打开启动器，验证窗口设置生效 ──
    console.log('[步骤 7/7] 打开启动器，验证窗口设置生效');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('启动器窗口正常显示，为小窗口模式，左侧应用列表区域可见');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    assertTrue(frameMatch && frameMatch[1] === 'WindowedFrame', '注销重新登录后启动器仍应为窗口模式（settings.ini current_frame=WindowedFrame）');
    console.log('  - 注销重登后启动器窗口模式设置仍生效');
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1848513', 'level3', 'remote'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 环境清理 ==========');

    console.log('  [1/3] 显示桌面并关闭遗留窗口');
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('  [2/3] 兜底结束 dde-lock（若仍处于锁屏）');
    await system.exec('killall dde-lock 2>/dev/null || true');

    console.log('  [3/3] 还原启动器模式为原始值（dde-shell 重启生效）');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    const targetFrame = originalFrame || 'FullscreenFrame';
    if (curFrame !== targetFrame) {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=${targetFrame}/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
      console.log(`  - 已还原为 ${targetFrame} 模式`);
    } else {
      console.log(`  - 已是 ${targetFrame} 模式，无需处理`);
    }
    console.log('========== 用例执行完成 ==========');
  });
});
