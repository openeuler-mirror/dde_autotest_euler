/**
 * 用例 PMSID: 1832159
 * 用例标题: 【启动器】【按分类】【文案】检查应用分类文案以及翻译
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

// ─────────────────────────────────────────────────────────────────────
// 实现说明：
// 1. 前置条件：启动器需为"按分类"模式（dde-dconfig categoryType=1），
//    用例结束后恢复为"自由排序"（categoryType=2）。
// 2. 分类覆盖：启动器只显示"已安装应用对应的分类"。系统默认缺失
//    社交沟通/游戏娱乐/阅读翻译/编程开发/其他应用 5 个分类，本用例
//    通过生成"用户级虚拟应用桌面文件"（~/.local/share/applications/）
//    补齐这 5 个分类（无需安装真实应用）：
//       - 社交沟通：Categories=Chat;
//       - 游戏娱乐：Categories=Game;
//       - 阅读翻译：Categories=Reading;
//       - 编程开发：Categories=Development;
//       - 其他应用：不带 Categories 字段（实测落入其他应用）
//    分类映射依据 dde-apps 的 parseDDECategoryString（分类名直接匹配）与实测验证。
// 3. 语言切换：Ctrl+Alt+Delete 弹出电源菜单 → 注销 → 登录界面输入密码重新登录，
//    使语言切换生效；切换就绪与否通过"语言切换成功，请注销后重新登录"通知确认。
// ─────────────────────────────────────────────────────────────────────

describe('1832159-【启动器】【按分类】【文案】检查应用分类文案以及翻译', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const langSelectorCmd = 'gdbus call --session --dest org.deepin.dde.LangSelector1 --object-path /org/deepin/dde/LangSelector1 --method org.deepin.dde.LangSelector1.';
  const desktopDir = '/home/uos/.local/share/applications';

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
  // Ctrl+Alt+Delete 弹出电源菜单 → AI 点击注销按钮 → 登录界面输入密码 → 回车
  // logoutBtn: 中文界面为"注销按钮"，英文界面为"Log out"
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

  // ── 工具函数：写入用户级桌面文件（base64 避免引号转义问题）──
  const writeDesktopFile = async (system, path, content) => {
    const b64 = Buffer.from(content).toString('base64');
    await system.exec(`echo ${b64} | base64 -d > ${path}`, 15000);
  };

  // ── 工具函数：生成缺失分类对应的虚拟应用（用户级桌面文件）──
  // 分类映射（依据 dde-apps parseDDECategoryString + 实测验证）：
  //   - 社交沟通：Categories=Chat;（"chat" 直接映射 Chat 分类）
  //   - 游戏娱乐：Categories=Game;（"game" 直接映射 Game 分类）
  //   - 阅读翻译：Categories=Reading;（"reading" 直接映射 Reading 分类）
  //   - 编程开发：Categories=Development;（"development" 直接映射 Development 分类）
  //   - 其他应用：不带 Categories 字段（实测落入其他应用）
  // 注：deepin-wine-builder 的 Categories=System;Utility 实测落入"系统管理"，不适用编程开发
  const installTestApps = async (system) => {
    console.log('  生成虚拟应用桌面文件（社交沟通/游戏娱乐/阅读翻译/编程开发/其他应用分类）');
    await system.exec(`mkdir -p ${desktopDir}`, 15000);
    await writeDesktopFile(system, `${desktopDir}/zz-chat-1832159.desktop`, `[Desktop Entry]
Type=Application
Name=Chat Test App
Name[zh_CN]=社交沟通测试
Categories=Chat;
Exec=/usr/bin/dde-file-manager
Icon=utilities-terminal
Terminal=false
`);
    await writeDesktopFile(system, `${desktopDir}/zz-game-1832159.desktop`, `[Desktop Entry]
Type=Application
Name=Game Test App
Name[zh_CN]=游戏娱乐测试
Categories=Game;
Exec=/usr/bin/dde-file-manager
Icon=utilities-terminal
Terminal=false
`);
    await writeDesktopFile(system, `${desktopDir}/zz-reading-1832159.desktop`, `[Desktop Entry]
Type=Application
Name=Reading Test App
Name[zh_CN]=阅读翻译测试
Categories=Reading;
Exec=/usr/bin/dde-file-manager
Icon=utilities-terminal
Terminal=false
`);
    await writeDesktopFile(system, `${desktopDir}/zz-dev-1832159.desktop`, `[Desktop Entry]
Type=Application
Name=Dev Test App
Name[zh_CN]=编程开发测试
Categories=Development;
Exec=/usr/bin/dde-file-manager
Icon=utilities-terminal
Terminal=false
`);
    await writeDesktopFile(system, `${desktopDir}/zz-others-1832159.desktop`, `[Desktop Entry]
Type=Application
Name=Others Test App
Name[zh_CN]=其他应用测试
Exec=/usr/bin/dde-file-manager
Icon=utilities-terminal
Terminal=false
`);
    console.log('  - 虚拟应用就绪');
  };

  // ── 工具函数：卸载测试应用（删除虚拟应用桌面文件），还原环境 ──
  const uninstallTestApps = async (system) => {
    console.log('  - 删除虚拟应用桌面文件');
    await system.exec(`rm -f ${desktopDir}/zz-chat-1832159.desktop ${desktopDir}/zz-game-1832159.desktop ${desktopDir}/zz-reading-1832159.desktop ${desktopDir}/zz-dev-1832159.desktop ${desktopDir}/zz-others-1832159.desktop`);
  };

  beforeAll(async ({ device, agent, system, env }) => {
    console.log('========== beforeAll: 环境初始化 ==========');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    console.log('  [1/5] 确保系统语言为简体中文基线（非中文则切回并注销生效）');
    await restoreZhCNLanguage(agent, device, system, passWord);

    console.log('  [2/5] 设置启动器为按分类模式（categoryType=1，DDE 风格分类）');
    await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType -v 1');

    console.log('  [3/5] 清理历史通知（删除通知库并重启 dde-shell，使按分类模式生效）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('  [4/5] 确保任务栏在底部');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('Super', 'd');

    console.log('  [5/5] 确保桌面在前台、启动器已关闭');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('esc');
    console.log('  - 环境初始化完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('========== beforeEach ==========');
  });

  test('1832159-【启动器】【按分类】【文案】检查应用分类文案以及翻译', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/7：生成虚拟应用桌面文件（补齐社交沟通/游戏娱乐/阅读翻译/编程开发/其他应用）──
    console.log('');
    console.log('[步骤 1/7] 生成虚拟应用桌面文件（5个缺失分类）');
    await installTestApps(system);
    console.log('  - 虚拟应用准备完成');

    // ── 步骤 2/7：切换系统语言为 American English（DBus 操作，无需 UI）──
    console.log('[步骤 2/7] 切换系统语言为 American English');
    const setLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "en_US.UTF-8"`);
    if (!setLocaleResult.success) {
      throw new Error('切换系统语言为 American English 失败');
    }

    // ── 步骤 3/7：等待"语言切换成功"通知，确认切换已生效 ──
    console.log('[步骤 3/7] 等待语言切换成功通知（最多60秒）');
    await waitForLangSwitchNotice(agent, device, '语言切换成功，请注销后重新登录');
    console.log('  - 语言切换成功通知已确认');

    // ── 步骤 4/7：注销登录，使英文语言生效 ──
    console.log('[步骤 4/7] 注销登录，使英文语言生效');
    await logoutAndLogin(agent, device, '注销按钮', passWord);
    console.log('  - 已重新登录（英文界面）');

    // ── 步骤 5/7：英文环境：打开启动器（按分类模式），点击 Internet 分类检查菜单翻译 ──
    // 注销重登后固定等待桌面加载完成（约15s），避免截屏为纯黑导致操作失败
    console.log('[步骤 5/7] 英文环境：打开启动器，点击 Internet 分类检查菜单翻译');
    await new Promise(resolve => setTimeout(resolve, 15000));
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('启动器窗口应用列表中的 Internet 分类标题', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    // 严格断言：11个英文分类必须全部存在，缺少任何一个都算失败；且不允许出现中文分类名
    await agent.aiAssert("点击 Internet 分类标题后弹出的分类菜单中，必须同时包含以下11个英文分类名：'Internet'、'Chat'、'Music'、'Video'、'Graphics'、'Games'、'Office'、'Reading'、'Development'、'System'、'Others'，且不存在中文分类名；缺少任何一个分类都视为失败");
    console.log('  - 英文分类菜单翻译断言通过');
    await device.pressKey('esc');
    await device.pressKey('esc');

    // ── 步骤 6/7：切回简体中文，删除英文语言 ──
    console.log('[步骤 6/7] 切回简体中文，删除 American English 语言');
    const restoreLocaleResult = await system.exec(`${langSelectorCmd}SetLocale "zh_CN.UTF-8"`);
    if (!restoreLocaleResult.success) {
      throw new Error('切回简体中文失败');
    }
    await waitForLangSwitchNotice(agent, device, 'System language changed, please log out and then log in');
    console.log('  - 语言切换成功通知已确认');
    await system.exec(`${langSelectorCmd}DeleteLocale "en_US.UTF-8"`);

    // ── 步骤 7/7：注销登录，使简体中文生效 ──
    console.log('[步骤 7/7] 注销登录，使简体中文生效');
    await logoutAndLogin(agent, device, 'Log out', passWord);
    console.log('  - 已重新登录（简体中文界面）');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 1800000, tags: ['1832159', 'level1', 'smoke', 'remote'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ agent, device, system, env }) => {
    console.log('========== afterAll: 环境清理 ==========');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    console.log('  [1/4] 兜底还原系统语言为简体中文（非中文则切回并注销生效）');
    await restoreZhCNLanguage(agent, device, system, passWord);

    console.log('  [2/4] 卸载测试应用，还原环境');
    await uninstallTestApps(system);

    console.log('  [3/4] 恢复启动器排序模式为自由排序');
    const { restoreLauncherSortMode } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');
    await restoreLauncherSortMode(system);

    console.log('  [4/4] 清理通知（删除通知库并重启 dde-shell）');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    console.log('========== 用例执行完成 ==========');
  });
});
