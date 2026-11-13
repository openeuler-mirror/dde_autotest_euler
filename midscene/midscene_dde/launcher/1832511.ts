/**
 * 用例 PMSID: 1832511
 * 用例标题: 【启动器】【右键菜单】应用右键菜单文案和翻译检查
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832511-【启动器】【右键菜单】应用右键菜单文案和翻译检查', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const langSelectorCmd = 'gdbus call --session --dest org.deepin.dde.LangSelector1 --object-path /org/deepin/dde/LangSelector1 --method org.deepin.dde.LangSelector1.';

  // ── 工具函数：等待"语言切换成功"通知 ──
  // 通过 super+M 打开通知中心，每5秒检查一次，最多轮询60秒；找到即返回，超时抛错
  const waitForLangSwitchNotice = async (agent, device, noticeText) => {
    let found = false;
    const checkDeadline = Date.now() + 60000;
    while (Date.now() < checkDeadline) {
      await device.pressKey('super', 'm');
      await new Promise(resolve => setTimeout(resolve, 500));
      found = await agent.aiBoolean(`通知中心长驻区域显示'${noticeText}'的通知`);
      await device.pressKey('esc');
      if (found) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    throw new Error(`60秒内未检测到"${noticeText}"通知`);
  };

  // ── 工具函数：注销并重新登录 ──
  // logoutBtn: 电源菜单中注销按钮文案（中文界面为"注销按钮"，英文界面为"Log out"）
  const logoutAndLogin = async (agent, device, logoutBtn, passWord) => {
    await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
    await agent.aiTap(logoutBtn, { deepThink: true });
    const isBlocked = await agent.aiBoolean('显示以上程序阻止注销');
    if (isBlocked) {
      await agent.aiTap(logoutBtn);
    }
    await agent.aiTap('登录界面的密码输入框', { deepThink: true });
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
  };

  // ── 工具函数：兜底还原系统语言为简体中文 ──
  // 收尾调用：若当前语言非中文，切回中文→注销生效→重新登录→删除其他非中文语言；已是中文则跳过
  const restoreZhCNLanguage = async (agent, device, system, passWord) => {
    const curLocaleResult = await system.exec('gdbus call --session --dest org.deepin.dde.LangSelector1 --object-path /org/deepin/dde/LangSelector1 --method org.freedesktop.DBus.Properties.Get org.deepin.dde.LangSelector1 CurrentLocale');
    const isZhCN = curLocaleResult.success && curLocaleResult.stdout.includes('zh_CN');
    if (isZhCN) {
      console.log('  - 系统语言已是中文，无需处理');
      return;
    }
    console.log('  - 系统语言非中文，切换回简体中文并注销生效');
    await system.exec(`${langSelectorCmd}SetLocale "zh_CN.UTF-8"`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await logoutAndLogin(agent, device, 'Log out', passWord);

    console.log('  - 已重新登录，删除 American English 语言');
    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);
  };

  // ── 工具函数：打开启动器并校验其已显示 ──
  // 应用自启动（本用例前置设置了音乐自启）可能打断启动器导致其关闭；
  // 通过 Launcher1.Visible 属性轮询确认启动器已打开，最多重试3次
  const openLauncherAndEnsureVisible = async (uos, system) => {
    console.log('  - 打开启动器并校验（规避自启动应用打断启动器导致其关闭，轮询 Visible 最多3次）');
    for (let attempt = 1; attempt <= 3; attempt++) {
      await uos.openLauncher();
      await new Promise(resolve => setTimeout(resolve, 2000));
      const visibleResult = await system.exec('gdbus call --session --dest org.deepin.dde.Launcher1 --object-path /org/deepin/dde/Launcher1 --method org.freedesktop.DBus.Properties.Get org.deepin.dde.Launcher1 Visible');
      const isVisible = visibleResult.success && visibleResult.stdout.includes('true');
      console.log(`  - 启动器 Visible 校验（第${attempt}次）: ${isVisible}`);
      if (isVisible) {
        return;
      }
    }
    throw new Error('启动器打开失败：3次轮询后仍未检测到启动器显示（可能被自启动应用打断）');
  };

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('========== beforeAll: 环境初始化 ==========');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    console.log('  [1/4] 确保系统语言为简体中文基线（非中文则切回并注销生效）');
    await restoreZhCNLanguage(agent, device, system, passWord);

    console.log('  [2/4] 清理历史通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('  [3/4] 确保任务栏在底部（保证通知横幅位置一致）');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('Super', 'd');

    console.log('  [4/4] 前置条件：音乐应用发送到桌面并设置开机自启');
    await system.exec('gdbus call --session --dest org.desktopspec.ApplicationManager1 --object-path /org/desktopspec/ApplicationManager1/deepin_2dmusic --method org.desktopspec.ApplicationManager1.Application.SendToDesktop');
    await system.exec("gdbus call --session --dest org.desktopspec.ApplicationManager1 --object-path /org/desktopspec/ApplicationManager1/deepin_2dmusic --method org.freedesktop.DBus.Properties.Set org.desktopspec.ApplicationManager1.Application AutoStart '<true>'");
    console.log('  - 环境初始化完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('========== beforeEach ==========');
  });

  test('1832511-【启动器】【右键菜单】应用右键菜单文案和翻译检查', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/8：确保英文语言环境（已为英文则跳过切换与注销）──
    console.log('');
    console.log('[步骤 1/8] 检查系统语言，确保英文环境');
    const curLocaleResult = await system.exec('gdbus call --session --dest org.deepin.dde.LangSelector1 --object-path /org/deepin/dde/LangSelector1 --method org.freedesktop.DBus.Properties.Get org.deepin.dde.LangSelector1 CurrentLocale');
    const alreadyEnglish = curLocaleResult.success && curLocaleResult.stdout.includes('en_US');
    if (alreadyEnglish) {
      console.log('  - 系统已是英文环境，跳过语言切换与注销登录');
    } else {
      console.log('  - 系统当前非英文环境，切换系统语言为 American English');
      const setLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "en_US.UTF-8"`);
      if (!setLocaleResult.success) {
        throw new Error('切换系统语言为 American English 失败');
      }

      // ── 步骤 2/8：等待"语言切换成功"通知，确认切换已生效 ──
      console.log('[步骤 2/8] 等待语言切换成功通知（最多60秒）');
      await waitForLangSwitchNotice(agent, device, '语言切换成功，请注销后重新登录');
      console.log('  - 语言切换成功通知已确认');

      // ── 步骤 3/8：注销登录，使英文语言生效 ──
      console.log('[步骤 3/8] 注销登录，使英文语言生效');
      await logoutAndLogin(agent, device, '注销按钮', passWord);
      console.log('  - 已重新登录（英文界面）');
    }

    // ── 步骤 4/8：打开启动器，右键应用图标检查英文右键菜单文案（保留）──
    console.log('[步骤 4/8] 打开启动器，右键应用图标检查英文右键菜单文案');
    await openLauncherAndEnsureVisible(uos, system);
    await agent.aiRightClick('启动器中的控制中心应用图标');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiAssert("应用右键菜单同时显示英文菜单项'Open'、'Send to desktop'、'Add to startup'、'Uninstall'");
    console.log('  - 英文右键菜单文案断言通过');
    await device.pressKey('esc');
    await device.pressKey('esc');

    // ── 步骤 5/8：右键音乐应用，检查已发送到桌面/已自启状态下的菜单翻译 ──
    console.log('[步骤 5/8] 右键音乐应用，检查菜单翻译');
    await openLauncherAndEnsureVisible(uos, system);
    await agent.aiRightClick('启动器中的音乐应用图标');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiAssert("音乐应用右键菜单同时显示英文菜单项'Remove from desktop'、'Send to dock'、'Remove from startup'");
    console.log('  - 音乐应用右键菜单翻译断言通过');
    await device.pressKey('esc');
    await device.pressKey('esc');

    // ── 步骤 6/8：切回简体中文并等待切换成功通知 ──
    console.log('[步骤 6/8] 切回简体中文，等待语言切换成功通知（最多60秒）');
    const restoreLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "zh_CN.UTF-8"`);
    if (!restoreLocaleResult.success) {
      throw new Error('切回简体中文失败');
    }
    await waitForLangSwitchNotice(agent, device, 'System language changed, please log out and then log in');
    console.log('  - 语言切换成功通知已确认');

    // ── 步骤 7/8：删除 American English 语言 ──
    console.log('[步骤 7/8] 删除 American English 语言');
    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);

    // ── （注销前）：还原环境——移除桌面音乐图标、取消开机自启 ──
    console.log('  - 环境还原：移除桌面音乐图标');
    await system.exec('gdbus call --session --dest org.desktopspec.ApplicationManager1 --object-path /org/desktopspec/ApplicationManager1/deepin_2dmusic --method org.desktopspec.ApplicationManager1.Application.RemoveFromDesktop');
    console.log('  - 环境还原：取消音乐开机自启');
    await system.exec("gdbus call --session --dest org.desktopspec.ApplicationManager1 --object-path /org/desktopspec/ApplicationManager1/deepin_2dmusic --method org.freedesktop.DBus.Properties.Set org.desktopspec.ApplicationManager1.Application AutoStart '<false>'");

    // ── 步骤 8/8：注销登录，使简体中文生效 ──
    console.log('[步骤 8/8] 注销登录，使简体中文生效');
    await logoutAndLogin(agent, device, 'Log out', passWord);
    console.log('  - 已重新登录（简体中文界面）');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832511', 'level4', 'remote'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('========== afterAll: 环境清理 ==========');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    console.log('  [1/2] 兜底还原系统语言为简体中文（非中文则切回并注销生效）');
    await restoreZhCNLanguage(agent, device, system, passWord);

    console.log('  [2/2] 清理通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    console.log('========== 用例执行完成 ==========');
  });
});
