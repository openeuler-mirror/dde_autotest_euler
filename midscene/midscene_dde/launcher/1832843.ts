/**
 * 用例 PMSID: 1832843
 * 用例标题: 【启动器】各类系统语言下，启动器tips文案翻译检查
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832843-【启动器】各类系统语言下，启动器tips文案翻译检查', () => {
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

  beforeAll(async ({ device, agent, system, env }) => {
    console.log('========== beforeAll: 环境初始化 ==========');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    console.log('  [1/4] 确保系统语言为简体中文基线（非中文则切回并注销生效）');
    await restoreZhCNLanguage(agent, device, system, passWord);

    console.log('  [2/4] 清理历史通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('  [3/4] 确保任务栏在底部（保证启动器图标位置一致）');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('Super', 'd');

    console.log('  [4/4] 确保桌面在前台、启动器已关闭');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('esc');
    console.log('  - 环境初始化完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('========== beforeEach ==========');
  });

  test('1832843-【启动器】各类系统语言下，启动器tips文案翻译检查', async ({ device, agent, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/6：中文环境 hover 任务栏启动器图标，检查中文 tips ──
    console.log('');
    console.log('[步骤 1/6] 中文环境：hover 任务栏启动器图标，检查 tips');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiHover('任务栏最左侧的启动器图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiAssert("任务栏启动器图标上方弹出的 tips 提示文字显示'启动器'");

    // ── 步骤 2/6：切换系统语言为 American English（DBus 操作，无需 UI）──
    console.log('[步骤 2/6] 切换系统语言为 American English');
    const setLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "en_US.UTF-8"`);
    if (!setLocaleResult.success) {
      throw new Error('切换系统语言为 American English 失败');
    }

    // ── 步骤 3/6：等待"语言切换成功"通知，确认切换已生效 ──
    console.log('[步骤 3/6] 等待语言切换成功通知（最多60秒）');
    await waitForLangSwitchNotice(agent, device, '语言切换成功，请注销后重新登录');
    console.log('  - 语言切换成功通知已确认');

    // ── 步骤 4/6：注销登录，使英文语言生效 ──
    console.log('[步骤 4/6] 注销登录，使英文语言生效');
    await logoutAndLogin(agent, device, '注销按钮', passWord);
    console.log('  - 已重新登录（英文界面）');

    // ── 步骤 5/6：英文环境 hover 任务栏启动器图标，检查英文 tips ──
    // 注销重登后固定等待桌面加载完成（约15s），避免截屏为纯黑导致 hover 失败
    console.log('[步骤 5/6] 英文环境：hover 任务栏启动器图标，检查 tips');
    await new Promise(resolve => setTimeout(resolve, 15000));
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiHover('任务栏最左侧的启动器图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiAssert("任务栏启动器图标上方弹出的 tips 提示文字显示'Launchpad'");

    // ── 步骤 6/6：切回简体中文、删除英文语言并注销生效 ──
    console.log('[步骤 6/6] 切回简体中文，等待切换通知（英文界面通知为英文文案）');
    const restoreLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "zh_CN.UTF-8"`);
    if (!restoreLocaleResult.success) {
      throw new Error('切回简体中文失败');
    }
    await waitForLangSwitchNotice(agent, device, 'System language changed, please log out and then log in');
    console.log('  - 语言切换成功通知已确认');

    console.log('  - 删除 American English 语言');
    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);

    console.log('  - 注销登录，使简体中文生效');
    await logoutAndLogin(agent, device, 'Log out', passWord);
    console.log('  - 已重新登录（简体中文界面）');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832843', 'level3', 'remote'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
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
