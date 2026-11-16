/**
 * 用例 PMSID: 1700157
 * 用例标题: 【控制中心】【通知】通知横幅展示数量配置的翻译检查
 * 生成时间: 2026-08-14 17:30:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1700157-【控制中心】【通知】通知横幅展示数量配置的翻译检查', () => {
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

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('========== beforeAll: 环境初始化 ==========');

    console.log('  [1/2] 清理历史通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('  [2/2] 确保任务栏在底部（保证通知横幅位置一致）');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('Super', 'd');
    console.log('  - 环境初始化完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('========== beforeEach ==========');
  });

  test('1700157-通知横幅展示数量配置的翻译检查', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/7：切换系统语言为 American English（DBus 操作，无需 UI）──
    console.log('');
    console.log('[步骤 1/7] 切换系统语言为 American English');
    const setLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "en_US.UTF-8"`);
    if (!setLocaleResult.success) {
      throw new Error('切换系统语言为 American English 失败');
    }

    // ── 步骤 2/7：等待"语言切换成功"通知，确认切换已生效 ──
    console.log('[步骤 2/7] 等待语言切换成功通知（最多60秒）');
    await waitForLangSwitchNotice(agent, device, '语言切换成功，请注销后重新登录');
    console.log('  - 语言切换成功通知已确认');

    // ── 步骤 3/7：注销登录，使英文语言生效 ──
    console.log('[步骤 3/7] 注销登录，使英文语言生效');
    await logoutAndLogin(agent, device, '注销按钮', passWord);
    console.log('  - 已重新登录（英文界面）');

    // ── 步骤 4/7：打开控制中心，检查通知横幅配置的英文翻译文案 ──
    console.log('[步骤 4/7] 打开控制中心，检查通知横幅配置英文翻译文案');
    await uos.openApp("ControlCenter");
    await agent.aiTap("右侧导航栏中的 Notification 设置项", { deepThink: true });
    await agent.aiAssert("通知设置页面同时显示英文文案'Enable Do Not Disturb'、'Do Not Disturb Settings'、'Number of notifications shown on the desktop'");
    console.log('  - 三个英文文案断言通过');

    // ── 步骤 5/7：切回简体中文并等待切换成功通知 ──
    console.log('[步骤 5/7] 切回简体中文，等待语言切换成功通知（最多60秒）');
    const restoreLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "zh_CN.UTF-8"`);
    if (!restoreLocaleResult.success) {
      throw new Error('切回简体中文失败');
    }
    await waitForLangSwitchNotice(agent, device, 'System language changed, please log out and then log in');
    console.log('  - 语言切换成功通知已确认');

    // ── 步骤 6/7：删除 American English 语言 ──
    console.log('[步骤 6/7] 删除 American English 语言');
    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);

    // ── 步骤 7/7：注销登录，使简体中文生效 ──
    console.log('[步骤 7/7] 注销登录，使简体中文生效');
    await logoutAndLogin(agent, device, 'Log out', passWord);
    console.log('  - 已重新登录（简体中文界面）');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1700157', 'level4', 'remote'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('========== afterAll: 环境清理 ==========');
    console.log('  [1/1] 清理通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    console.log('========== 用例执行完成 ==========');
  });
});
