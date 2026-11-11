/**
 * 用例 PMSID: 1504511
 * 用例标题: 【控制中心】【个性化】【通用】通用自动主题跟随时区修改
 * 生成时间: 2026-09-20
 * 用例编写人: UT003165(吴磊)
 */

// 实现说明：
// 1. 文本用例的"通用"即当前版本控制中心的"个性化 / 外观"页面（已实测确认）。
// 2. 时区/时间修改采用 UI 优先、命令兜底：先按用例在控制中心-时间和日期中操作，若 UI 未生效
//    则回退为 timedatectl 命令，保证测试点（自动主题随时区切换）可靠验证。
//    时区换算依据：本地时间固定为 09:00，上海(UTC+8)为白天→浅色；马塞卢(UTC+2)为 03:00 夜间→深色；
//    中科雷姆斯克(UTC+11)为 12:00 白天→浅色，与文本用例预期 浅色/深色/浅色 一致。
// 3. 前置条件（通用主题为"自动"、系统时区为"上海"、打开文件管理器）在 beforeAll 中构造；
//    环境恢复（时区还原为上海、恢复时间自动同步）在 afterAll 中执行。

const caseDir = process.env.TESTCASE_DIR;
// 时区配置：中文名（用于 UI 搜索）与 IANA 名（用于命令兜底）
const TZ_SHANGHAI = { cn: '上海', iana: 'Asia/Shanghai' };
const TZ_MASERU = { cn: '马塞卢', iana: 'Africa/Maseru' };
const TZ_SREDNEKOLYMSK = { cn: '中科雷姆斯克', iana: 'Asia/Srednekolymsk' };
const TEST_TIME = '09:00';

// xdotool 执行所需的显示环境前缀
const DISP = 'export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority;';

describe('1504511-【控制中心】【个性化】【通用】通用自动主题跟随时区修改', () => {
  // 工具函数：设置系统时区（UI 优先，命令兜底），返回当前时区
  const setTimeZone = async (agent, system, env, tz) => {
    console.log(`  [操作] 设置系统时区为 ${tz.cn}（${tz.iana}）`);
    let uiSuccess = false;
    try {
      // 控制中心左侧导航栏较长，"时间和日期"位于列表后部，先滚动导航栏再点击
      await agent.aiScroll("控制中心左侧导航栏区域", { direction: 'down', distance: 300 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("时间和日期", { deepThink: true });
      await agent.aiTap("时区列表", { deepThink: true });
      await agent.aiTap("修改系统时区按钮", { deepThink: true });
      await agent.aiTap("时区搜索框", { deepThink: true });
      await agent.aiInput("时区搜索框", tz.cn, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await agent.aiTap(`搜索结果中的时区项：${tz.cn}`, { deepThink: true });
      await agent.aiTap("确定按钮", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      uiSuccess = true;
      console.log('  [操作] 已通过控制中心 UI 修改时区');
    } catch (err) {
      console.log('  [操作] UI 修改时区未成功，回退为命令方式：', err.message);
    }
    const currentTz = await system.exec('timedatectl show -p Timezone --value 2>/dev/null');
    if (!uiSuccess || currentTz.stdout.toString().trim() !== tz.iana) {
      const setResult = await system.exec(`echo '${env.testPassword}' | sudo -S timedatectl set-timezone ${tz.iana} 2>&1`, 30000);
      console.log('  [操作] 命令设置时区结果：', setResult.stdout.toString().trim() || '成功');
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    const nowTz = await system.exec('timedatectl show -p Timezone --value 2>/dev/null');
    const localTime = await system.exec('date "+%H:%M"');
    console.log(`  [校验] 当前时区 = ${nowTz.stdout.toString().trim()}，本地时间 = ${localTime.stdout.toString().trim()}`);
    return nowTz.stdout.toString().trim();
  };

  // 前置条件：系统时区为"上海"、关闭时间自动同步、控制中心个性化中通用主题已设置为"自动"
  // 工具函数：等待自动主题跟随时间/时区切换生效
  // 说明：dde-daemon 以定时任务检测时间并切换自动主题（非实时），故修改时间后需轮询等待
  const waitForAutoTheme = async (agent, expectDark, maxWaitMs = 180000) => {
    const startTime = Date.now();
    let matched = false;
    while (Date.now() - startTime < maxWaitMs) {
      matched = await agent.aiBoolean(expectDark
        ? '文件管理器窗口的背景为深色（黑色/深灰色）'
        : '文件管理器窗口的背景为浅色（白色/浅灰色）');
      if (matched) {
        console.log(`  [等待] 自动主题已切换（耗时 ${Math.round((Date.now() - startTime) / 1000)}s）`);
        break;
      }
      console.log(`  [等待] 自动主题尚未切换，10 秒后重试（已等待 ${Math.round((Date.now() - startTime) / 1000)}s）`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    return matched;
  };

  // 工具函数：用 xdotool 滚轮滚动右侧内容区
  // （实测框架的 aiScroll 对控制中心页面不生效，需走 X11 原生滚轮事件）
  const scrollPage = async (system, clicks = 8, direction = 'down') => {
    const geo = await system.exec(`${DISP} xdotool getdisplaygeometry`);
    const parts = geo.stdout.toString().trim().split(/\s+/).map(Number);
    const cx = Math.round(parts[0] * 0.62);
    const cy = Math.round(parts[1] * 0.5);
    const btn = direction === 'down' ? 5 : 4;
    await system.exec(`${DISP} xdotool mousemove ${cx} ${cy} click --repeat ${clicks} --delay 120 ${btn}`, 30000);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`  [操作] 已用滚轮${direction === 'down' ? '下' : '上'}滚页面 ${clicks} 格`);
  };

  beforeAll(async ({ uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件，构造前置条件');
    await uos.showDesktop();
    // 前置1：系统时区设置为"上海"，并关闭时间自动同步（便于后续手动设置时间）
    await system.exec(`echo '${env.testPassword}' | sudo -S timedatectl set-timezone ${TZ_SHANGHAI.iana} 2>&1`, 30000);
    await system.exec(`echo '${env.testPassword}' | sudo -S timedatectl set-ntp false 2>&1`, 30000);
    const tzCheck = await system.exec('timedatectl show -p Timezone --value 2>/dev/null');
    console.log(`1. beforeAll: 系统时区已设置为 ${TZ_SHANGHAI.cn}，当前时区 = ${tzCheck.stdout.toString().trim()}`);
    // 前置2：控制中心个性化中设置通用主题为"自动"
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化", { deepThink: true });
    await scrollPage(system, 8);
    // 外观为下拉选项，需先展开下拉列表再选择"自动"
    await agent.aiTap("外观设置项右侧的下拉框", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1200));
    await agent.aiTap("下拉列表中的“自动”选项", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    await agent.aiAssert("“自动”处于选中状态，系统外观跟随日出日落自动切换");
    console.log('1. beforeAll: 通用主题已设置为"自动"，前置条件构造完成');
  });

  beforeEach(async ({ uos }) => {
    console.log('2. beforeEach: 每个测试前的准备，确保回到桌面');
    await uos.showDesktop();
  });

  test('1504511-【控制中心】【个性化】【通用】通用自动主题跟随时区修改', async ({ device, agent, uos, system, env }) => {
    // ========== 步骤1：修改时间为09:00，检查文件管理器窗口主题（上海时区，预期浅色） ==========
    console.log(`步骤1：关闭自动同步并将系统时间修改为 ${TEST_TIME}（上海时区为白天）`);
    let timeUiSuccess = false;
    try {
      // 控制中心左侧导航栏较长，"时间和日期"位于列表后部，先滚动导航栏再点击
      await agent.aiScroll("控制中心左侧导航栏区域", { direction: 'down', distance: 300 });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("时间和日期", { deepThink: true });
      await agent.aiTap("自动同步配置开关", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await agent.aiTap(`修改时间为${TEST_TIME}`, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      timeUiSuccess = true;
      console.log('步骤1：已通过控制中心 UI 关闭自动同步并修改时间');
    } catch (err) {
      console.log('步骤1：UI 修改时间未成功，回退为命令方式：', err.message);
    }
    if (!timeUiSuccess) {
      await system.exec(`echo '${env.testPassword}' | sudo -S timedatectl set-time "${TEST_TIME}" 2>&1`, 30000);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    const timeNow = await system.exec('date "+%H:%M"');
    console.log('步骤1：当前本地时间 =', timeNow.stdout.toString().trim());
    console.log('步骤1：打开文件管理器，检查窗口主题');
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 3500));
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('断言1：上海时区白天时段，自动主题显示浅色');
    const ok1 = await waitForAutoTheme(agent, false);
    assert.assertTrue(ok1, '等待 180 秒后文件管理器窗口主题仍未切换为浅色（上海时区应为白天）');
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤2：修改系统时区为"马塞卢"，检查文件管理器窗口颜色（预期深色） ==========
    console.log('步骤2：打开控制中心-时间和日期-时区列表，修改系统时区为"马塞卢"');
    await uos.openApp("控制中心", { maximizeWindow: true });
    await setTimeZone(agent, system, env, TZ_MASERU);
    console.log('步骤2：打开文件管理器，检查窗口颜色');
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 3500));
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('断言2：马塞卢时区（UTC+2）当地时间为凌晨，自动主题显示深色');
    const ok2 = await waitForAutoTheme(agent, true);
    assert.assertTrue(ok2, '等待 180 秒后文件管理器窗口主题仍未切换为深色（马塞卢时区应为凌晨）');
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤3：修改系统时区为"中科雷姆斯克"，检查文件管理器窗口颜色（预期浅色） ==========
    console.log('步骤3：打开控制中心-时间和日期-时区列表，修改系统时区为"中科雷姆斯克"');
    await uos.openApp("控制中心", { maximizeWindow: true });
    await setTimeZone(agent, system, env, TZ_SREDNEKOLYMSK);
    console.log('步骤3：打开文件管理器，检查窗口颜色');
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 3500));
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('断言3：中科雷姆斯克时区（UTC+11）当地时间为中午，自动主题显示浅色');
    const ok3 = await waitForAutoTheme(agent, false);
    assert.assertTrue(ok3, '等待 180 秒后文件管理器窗口主题仍未切换为浅色（中科雷姆斯克时区应为中午）');
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));
  }, { timeout: 600000, tags: ["1504511", "level3"] });

  afterEach(async ({ uos }) => {
    console.log('4. afterEach: 每个测试后的清理，回到桌面');
    await uos.showDesktop();
  });

  // 后置清理：恢复系统时区为"上海"并恢复时间自动同步，避免影响后续用例
  afterAll(async ({ system, env, uos }) => {
    console.log('后置清理：恢复系统时区为"上海"，并恢复时间自动同步');
    await system.exec(`echo '${env.testPassword}' | sudo -S timedatectl set-timezone ${TZ_SHANGHAI.iana} 2>&1`, 30000);
    await system.exec(`echo '${env.testPassword}' | sudo -S timedatectl set-ntp true 2>&1`, 30000);
    const tzNow = await system.exec('timedatectl show -p Timezone --value 2>/dev/null');
    const timeNow = await system.exec('date "+%Y-%m-%d %H:%M:%S"');
    console.log('后置清理：当前时区 =', tzNow.stdout.toString().trim(), '当前时间 =', timeNow.stdout.toString().trim());
    // 环境恢复：按窗口 ID 精确操作控制中心——先激活、再取消最大化、最后关闭，避免误关其他窗口
    const ccWin = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-control-center" | head -1 | awk '{print $1}'`);
    const ccWinId = ccWin.stdout.toString().trim();
    if (ccWinId) {
      console.log('后置清理：激活控制中心并取消最大化，窗口ID =', ccWinId);
      await system.exec(`${DISP} wmctrl -i -a ${ccWinId}`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1200));
      await system.exec(`${DISP} xdotool key alt+F10`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1200));
      console.log('后置清理：关闭控制中心窗口');
      await system.exec(`${DISP} wmctrl -i -c ${ccWinId}`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log('后置清理：控制中心窗口未打开，无需关闭');
    }
    await uos.showDesktop();
    // 关闭可能残留的启动器窗口：uos.openApp 会通过 Super 键打开启动器查找应用且不会自动关闭。
    // 启动器的出现时机可能晚于其它清理动作，故放在 showDesktop 之后并等待其稳定后再关闭。
    await new Promise(resolve => setTimeout(resolve, 3000));
    const lpWin = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-shell/launchpad" | head -1 | awk '{print $1}'`);
    const lpWinId = lpWin.stdout.toString().trim();
    if (lpWinId) {
      console.log('后置清理：关闭残留的启动器窗口，窗口ID =', lpWinId);
      await system.exec(`${DISP} wmctrl -i -c ${lpWinId}`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log('后置清理：启动器窗口未打开，无需关闭');
    }
  });
});
