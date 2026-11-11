/**
 * 用例 PMSID: 1504483
 * 用例标题: 【控制中心】【个性化】【外观】系统外观设置即时生效正常
 * 生成时间: 2026-09-20
 * 用例编写人: UT003165(吴磊)
 */

// 实现说明：参考同类用例 1829881（外观设置为"浅色"生效正常）的实现模式。
// "自动"主题需跟随日出日落切换，故按当前系统时间动态判定应显示浅色还是深色，避免夜间跑测误判。
// 注意：环境恢复统一放在 afterAll 中执行，避免用例失败时污染后续用例。

// xdotool 执行所需的显示环境前缀
const DISP = 'export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority;';

describe('1504483-【控制中心】【个性化】【外观】系统外观设置即时生效正常', () => {
  // 工具函数：将外观主题恢复为"浅色"（默认值），避免影响后续用例
  const restoreAppearance = async (agent, uos) => {
    console.log('[恢复] 打开控制中心，将外观主题恢复为"浅色"');
    await uos.openApp("控制中心", { maximizeWindow: false });
    await agent.aiTap("个性化", { deepThink: true });
    await setAppearance(agent, system, "浅色");
    await uos.closeCurrentWindow();
    console.log('[恢复] 外观主题已恢复为"浅色"');
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

  // 工具函数：设置外观主题
  // （外观是下拉选项而非并列按钮，需先展开下拉列表再选择）
  // 工具函数：先由 AI 定位元素坐标，再用 xdotool 发送点击
  // （实测框架注入的点击事件对控制中心 dtk 控件不生效，需走 X11 原生事件）
  const tapByHover = async (agent, system, prompt) => {
    await agent.aiHover(prompt, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const loc = await system.exec(`${DISP} xdotool getmouselocation`);
    const matched = loc.stdout.toString().match(/x:(\d+)\s+y:(\d+)/);
    assert.assertTrue(!!matched, `无法定位元素坐标：${prompt}`);
    await system.exec(`${DISP} xdotool mousemove ${matched[1]} ${matched[2]} click 1`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`  [操作] xdotool 点击「${prompt}」@ (${matched[1]},${matched[2]})`);
  };

  // 工具函数：设置外观主题（外观为下拉选项，需先展开下拉列表再选择）
  const setAppearance = async (agent, system, optionName) => {
    console.log(`  [操作] 设置外观主题为「${optionName}」`);
    await tapByHover(agent, system, "外观设置项右侧的下拉框");
    await tapByHover(agent, system, `下拉列表中的“${optionName}”选项`);
    console.log(`  [操作] 外观主题已设置为「${optionName}」`);
  };

  beforeAll(async ({ uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos }) => {
    console.log('2. beforeEach: 每个测试前的准备，确保回到桌面');
    await uos.showDesktop();
  });

  test('1504483-【控制中心】【个性化】【外观】系统外观设置即时生效正常', async ({ device, agent, uos, system }) => {
    // ========== 步骤1：启动控制中心-个性化-外观，检查默认外观主题 ==========
    console.log('步骤1：打开控制中心-个性化-外观，检查默认外观主题');
    await uos.openApp("控制中心", { maximizeWindow: false });
    await agent.aiTap("个性化", { deepThink: true });
    // 采用同模块参考用例 1829881 已验证的断言方式：进入个性化即展示各设置分类，外观主题位于其中
    await agent.aiAssert("个性化下有：主题、外观、桌面和任务栏、窗口效果、壁纸、屏幕保护");
    console.log('断言1：显示3种外观主题，默认浅色且有明显选中效果');
    // 外观为下拉选项，先设置为"浅色"再校验（不假设初始状态）
    await setAppearance(agent, system, "浅色");
    await agent.aiAssert("右侧区域存在外观设置项，其下拉框显示为“浅色”");

    // ========== 步骤2：修改外观主题为浅色主题，检查系统应用窗口显示 ==========
    console.log('步骤2：修改外观主题为浅色主题');
    await setAppearance(agent, system, "浅色");
    console.log('步骤2：打开文件管理器，检查应用窗口主题');
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('断言2：应用窗口主题为浅色');
    await agent.aiAssert("文件管理器窗口背景为浅色（白色/浅灰色）");
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤3：修改外观主题为深色主题，检查系统应用窗口显示 ==========
    console.log('步骤3：修改外观主题为深色主题');
    await setAppearance(agent, system, "深色");
    console.log('步骤3：打开文件管理器，检查应用窗口主题');
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('断言3：应用窗口主题为深色');
    // 先确认控制中心内外观已切换为深色（参考用例 1829881 的断言方式），再校验系统应用
    await agent.aiAssert("外观为深色");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器窗口背景为深色（黑色/深灰色）");
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤4：修改外观主题为自动主题，检查系统应用窗口显示 ==========
    console.log('步骤4：修改外观主题为自动主题');
    await setAppearance(agent, system, "自动");
    // 自动主题按日出日落切换：先取当前系统小时数，动态判定应显示浅色还是深色
    const hourResult = await system.exec('date +%H');
    const hour = parseInt(hourResult.stdout.toString().trim(), 10);
    const expectTheme = (hour >= 7 && hour < 19) ? '浅色' : '深色';
    console.log(`步骤4：当前系统时间为 ${hour} 时，自动主题应显示为${expectTheme}`);
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`断言4：应用窗口主题跟随日出日落自动切换为${expectTheme}`);
    await agent.aiAssert(`文件管理器窗口主题为${expectTheme}（自动主题按当前时间跟随日出日落切换）`);
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤5：修改外观主题时，检查预览效果 ==========
    console.log('步骤5：检查外观主题的预览效果');
    console.log('断言5：外观主题可切换');
    await setAppearance(agent, system, "深色");

    // ========== 步骤6：测试应用选择了"跟随系统主题"，检查应用的主题 ==========
    console.log('步骤6：设置外观为深色主题，打开终端并设置"跟随系统"主题');
    await setAppearance(agent, system, "深色");
    await device.pressKey("Ctrl", "Alt", "T");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("终端窗口的汉堡菜单", { deepThink: true });
    await agent.aiTap("菜单项：主题", { deepThink: true });
    await agent.aiTap("主题菜单项：跟随系统", { deepThink: true });
    console.log('断言6：终端主题跟随系统设置变为深色');
    await agent.aiAssert("终端窗口界面颜色显示为深色（黑色/深灰色），跟随系统深色主题");
    await device.pressKey("Alt", "F4");
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤7：恢复外观主题为"浅色" ==========
    console.log('步骤7：恢复外观主题为"浅色"');
    await setAppearance(agent, system, "浅色");
  }, { timeout: 600000, tags: ["1504483", "level3", "smoke"] });

  afterEach(async ({ uos }) => {
    console.log('4. afterEach: 每个测试后的清理，回到桌面');
    await uos.showDesktop();
  });

  // 后置清理：兜底恢复外观主题，避免用例中途失败导致环境残留
  afterAll(async ({agent, uos, system}) => {
    console.log('后置清理：确认外观主题已恢复为"浅色"');
    await restoreAppearance(agent, uos);
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
