/**
 * 用例 PMSID: 1832503
 * 用例标题: 【启动器】【右键菜单】应用右键菜单功能验证---"开机自动启动"功能
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832503-【启动器】【右键菜单】应用右键菜单功能验证---"开机自动启动"功能', () => {
  // 控制中心 AutoStart 属性对应的 ApplicationManager1 object path（desktop id 转义：`.`→`_2e`、`-`→`_2d`）
  const controlCenterPath = '/org/desktopspec/ApplicationManager1/org_2edeepin_2edde_2econtrol_2dcenter';
  const getAutoStartCmd = `gdbus call --session --dest org.desktopspec.ApplicationManager1 --object-path ${controlCenterPath} --method org.freedesktop.DBus.Properties.Get org.desktopspec.ApplicationManager1.Application AutoStart`;
  const setAutoStartCmd = (enabled) => `gdbus call --session --dest org.desktopspec.ApplicationManager1 --object-path ${controlCenterPath} --method org.freedesktop.DBus.Properties.Set org.desktopspec.ApplicationManager1.Application AutoStart '<${enabled}>'`;

  // ── 工具函数：注销并重新登录 ──
  // logoutBtn: 电源菜单中注销按钮文案（中文界面为"注销按钮"）
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

    console.log('  [1/2] 确保启动器为窗口模式');
    const frameResult = await system.exec('cat /home/uos/.config/deepin/org.deepin.dde-shell/settings.ini');
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec('sed -i "s/current_frame=.*/current_frame=WindowedFrame/" /home/uos/.config/deepin/org.deepin.dde-shell/settings.ini');
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }

    console.log('  [2/2] 确保控制中心当前未开机自启（基线）');
    const asResult = await system.exec(getAutoStartCmd);
    const isAutoStart = asResult.success && asResult.stdout.includes('true');
    if (isAutoStart) {
      console.log('  - 控制中心已自启，先取消');
      await system.exec(setAutoStartCmd(false));
    } else {
      console.log('  - 控制中心未自启，基线正常');
    }

    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('  - 环境初始化完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('========== beforeEach ==========');
  });

  test('1832503-【启动器】【右键菜单】应用右键菜单功能验证---"开机自动启动"功能', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/5：打开启动器窗口模式 ──
    console.log('');
    console.log('[步骤 1/5] 打开启动器窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('启动器窗口已显示，左侧为应用列表区域');

    // ── 步骤 2/5：搜索控制中心并右键，勾选"开机自动启动" ──
    console.log('[步骤 2/5] 搜索控制中心并右键，勾选"开机自动启动"');
    await uos.searchInLauncher('控制中心');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiRightClick('搜索结果中名称为控制中心的应用图标', { deepThink: true });
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiAssert("应用右键菜单中显示'开机自动启动'菜单项");
    await agent.aiTap('右键菜单中的"开机自动启动"选项', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('esc');
    await device.pressKey('esc');

    // ── 步骤 3/5：DBus 验证 AutoStart 已置为 true ──
    console.log('[步骤 3/5] DBus 验证控制中心 AutoStart 属性');
    const asResult = await system.exec(getAutoStartCmd);
    assertTrue(asResult.success && asResult.stdout.includes('true'), '控制中心 AutoStart 属性应已置为 true');
    console.log('  - AutoStart 属性已确认为 true');

    // ── 步骤 4/5：注销并重新登录 ──
    console.log('[步骤 4/5] 注销并重新登录');
    await logoutAndLogin(agent, device, '注销按钮', passWord);
    console.log('  - 已重新登录');

    // ── 步骤 5/5：检查控制中心是否自启动 ──
    console.log('[步骤 5/5] 检查控制中心是否自启动');
    await agent.aiWaitFor('桌面已显示');
    let ccFound = false;
    for (let i = 0; i < 6; i++) {
      const procResult = await system.exec('pgrep -f dde-control-center');
      if (procResult.success && procResult.stdout.trim().length > 0) {
        ccFound = true;
        console.log('  - 控制中心进程已自启动');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    assertTrue(ccFound, '注销重新登录后控制中心进程应已自启动');

    // 窗口级验证：wmctrl 确认标题为"控制中心"的窗口已出现（比 AI 语义判断更可靠）
    let winFound = false;
    for (let i = 0; i < 6; i++) {
      const winResult = await system.exec('wmctrl -l');
      if (winResult.success && winResult.stdout.includes('控制中心')) {
        winFound = true;
        console.log('  - 控制中心窗口已自启动');
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    assertTrue(winFound, '注销重新登录后控制中心窗口应已自动打开');
    await agent.aiAssert('屏幕中间显示标题为"系统"的控制中心设置窗口，左侧有系统、网络等设置项');
    console.log('  - 控制中心窗口已自动打开');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832503', 'level3', 'remote'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('========== afterAll: 环境清理 ==========');

    console.log('  [1/2] 取消控制中心开机自启');
    await system.exec(setAutoStartCmd(false));
    console.log('  - 控制中心 AutoStart 已置为 false');

    console.log('  [2/2] 关闭控制中心窗口并显示桌面');
    await system.exec('wmctrl -c "控制中心"');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('========== 用例执行完成 ==========');
  });
});
