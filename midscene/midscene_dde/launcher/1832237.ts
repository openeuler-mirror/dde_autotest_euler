/**
 * 用例 PMSID: 1832237
 * 用例标题: 【启动器】【窗口模式】文案翻译检查----待定
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 * 注：用例内容待补充，此处按启动器窗口模式快捷访问菜单文案的中英文翻译检查实现
 */

describe('1832237-【启动器】【窗口模式】文案翻译检查----待定', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const langSelectorCmd = 'gdbus call --session --dest org.deepin.dde.LangSelector1 --object-path /org/deepin/dde/LangSelector1 --method org.deepin.dde.LangSelector1.';

  // ── 工具函数：等待"语言切换成功"通知 ──
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
    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);
  };

  // ── 工具函数：DBus 直接打开启动器（dde-shell 重启后 Super 快捷键偶发失效，窗口模式用 DBus 更稳定）──
  const openLauncherByDbus = async (system) => {
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  beforeAll(async ({ device, agent, system, env }) => {
    console.log('========== beforeAll: 环境初始化 ==========');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    console.log('  [1/3] 确保系统语言为简体中文基线（非中文则切回并注销生效）');
    await restoreZhCNLanguage(agent, device, system, passWord);

    console.log('  [2/3] 清理历史通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('  [3/3] 确保桌面在前台');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('esc');
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式 ==========');
    const frameResult = await system.exec(`cat /home/uos/.config/deepin/org.deepin.dde-shell/settings.ini`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" /home/uos/.config/deepin/org.deepin.dde-shell/settings.ini`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    await device.pressKey('ESC');
  });

  test('1832237-【启动器】【窗口模式】文案翻译检查----待定', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // 工具函数：hover 图标后校验悬浮提示（tooltip）；hoverDesc 支持 string 或 { prompt, images } 对象（图片定位参考）
    const checkTooltip = async (hoverDesc, tooltipText) => {
      await agent.aiHover(hoverDesc, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`启动器界面中图标的悬浮提示（tooltip）显示"${tooltipText}"`);
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    // ── 步骤 1/6：切换系统语言为 American English（DBus 操作，无需 UI）──
    console.log('[步骤 1/6] 切换系统语言为 American English');
    const setLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "en_US.UTF-8"`);
    if (!setLocaleResult.success) {
      throw new Error('切换系统语言为 American English 失败');
    }

    // ── 步骤 2/6：等待"语言切换成功"通知 ──
    console.log('[步骤 2/6] 等待语言切换成功通知（最多60秒）');
    await waitForLangSwitchNotice(agent, device, '语言切换成功，请注销后重新登录');
    console.log('  - 语言切换成功通知已确认');

    // ── 步骤 3/6：注销登录，使英文语言生效 ──
    console.log('[步骤 3/6] 注销登录，使英文语言生效');
    await logoutAndLogin(agent, device, '注销按钮', passWord);
    console.log('  - 已重新登录（英文界面）');
    await new Promise(resolve => setTimeout(resolve, 15000));
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ── 步骤 4/6：打开启动器窗口模式，hover 检查设置/关机/排序模式图标 tooltip ──
    console.log('[步骤 4/6] 英文环境：检查启动器各图标悬浮提示');
    await openLauncherByDbus(system);
    await agent.aiWaitFor('启动器窗口模式已打开，界面显示英文文案');
    await checkTooltip({ prompt: '启动器窗口内部（非底部系统任务栏）底部工具栏中的齿轮形状设置图标', images: [{ name: '设置图标', url: 'http://10.7.62.32/midscene-uos/midscene_dde/resources/launcher/Settings.png' }], convertHttpImage2Base64: true }, 'Control Center');
    console.log('  验证通过：设置图标 tooltip 为 Control Center');
    await checkTooltip({ prompt: '启动器窗口内部（非底部系统任务栏）底部工具栏中的电源关机图标', images: [{ name: '关机图标', url: 'http://10.7.62.32/midscene-uos/midscene_dde/resources/launcher/power.png' }], convertHttpImage2Base64: true }, 'Power');
    console.log('  验证通过：关机图标 tooltip 为 Power');
    await checkTooltip('启动器窗口模式左上角的排序模式图标', 'Sorting Mode');
    console.log('  验证通过：排序模式图标 tooltip 为 Sorting Mode');

    // ── 步骤 5/6：点击排序模式图标，检查面板菜单三个选项 ──
    console.log('[步骤 5/6] 点击排序模式图标，检查面板菜单选项');
    await agent.aiTap('启动器窗口模式左上角的排序模式图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('启动器排序模式面板菜单中显示三个选项：Free sorting、Sort by category、Sort by name');
    console.log('  验证通过：排序模式菜单包含 Free sorting、Sort by category、Sort by name');
    await device.pressKey('esc');

    // ── 步骤 6/6：切回简体中文、删除英文语言并注销生效 ──
    console.log('[步骤 6/6] 切回简体中文，等待切换通知（英文界面通知为英文文案）');
    const restoreLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "zh_CN.UTF-8"`);
    if (!restoreLocaleResult.success) {
      throw new Error('切回简体中文失败');
    }
    await waitForLangSwitchNotice(agent, device, 'System language changed, please log out and then log in');
    console.log('  - 语言切换成功通知已确认');

    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);
    console.log('  - 已删除 American English 语言');

    await logoutAndLogin(agent, device, 'Log out', passWord);
    console.log('  - 已重新登录（简体中文界面）');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832237', 'level3', 'remote'] });

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