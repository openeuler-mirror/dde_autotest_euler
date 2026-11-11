/**
 * 用例 PMSID: 1504517
 * 用例标题: 【控制中心】【个性化】【任务栏】个性化任务栏设置状态切换
 * 生成时间: 2026-09-20
 * 用例编写人: UT003165(吴磊)
 */

// 实现说明：参考同类用例 1846877（任务栏状态"一直隐藏"即时生效）的实现模式。
// 注意：环境恢复统一放在 afterAll 中执行，避免用例失败时污染后续用例。

// xdotool 执行所需的显示环境前缀
const DISP = 'export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority;';

// 任务栏（Dock）高度：用于判断窗口是否与任务栏区域重叠（实测本机为 48px）
const DOCK_HEIGHT = 48;

describe('1504517-【控制中心】【个性化】【任务栏】个性化任务栏设置状态切换', () => {
  // 工具函数：将任务栏状态恢复为"一直显示"（避免影响后续用例）
  const restoreTaskbarStatus = async (agent, uos) => {
    console.log('[恢复] 打开控制中心，将任务栏状态恢复为"一直显示"');
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化", { deepThink: true });
    await agent.aiTap("桌面和任务栏", { deepThink: true });
    await agent.aiTap("点击“状态”设置项右侧的下拉框", { deepThink: true });
    await agent.aiTap("点击下拉菜单框的菜单项：一直显示", { deepThink: true });
    await agent.aiAssert("“状态”设置项的最右侧状态文案更新为“一直显示”");
    await uos.closeCurrentWindow();
    console.log('[恢复] 任务栏状态已恢复为"一直显示"');
  };

  // 工具函数：将鼠标移动至屏幕底部中央唤起任务栏
  // （"一直隐藏"状态下任务栏仅在鼠标触底时显示，Super+Down 快捷键在此场景不生效）
  const showTaskbar = async (system) => {
    const geo = await system.exec(`${DISP} xdotool getdisplaygeometry`);
    const parts = geo.stdout.toString().trim().split(/\s+/).map(Number);
    const screenW = parts[0];
    const screenH = parts[1];
    const cx = Math.round(screenW / 2);
    // 先将鼠标移开再移到屏幕底部，确保可靠触发任务栏显示
    await system.exec(`${DISP} xdotool mousemove ${cx} ${Math.round(screenH / 2)}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    await system.exec(`${DISP} xdotool mousemove ${cx} ${screenH - 2}`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log(`  [操作] 鼠标已移至屏幕底部 (${cx}, ${screenH - 2})，唤起任务栏`);
  };

  // 工具函数：在任务栏上执行右键
  // （鼠标此时已停在任务栏上，直接用 xdotool 发送右键事件，比 AI 定位更可靠）
  const rightClickTaskbar = async (agent, system) => {
    await system.exec(`${DISP} xdotool click 3`);
    await new Promise(resolve => setTimeout(resolve, 1800));
    console.log('  [操作] 已通过 xdotool 在任务栏上执行右键');
  };

  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos }) => {
    console.log('2. beforeEach: 每个测试前的准备，确保回到桌面');
    await uos.showDesktop();
  });

  test('1504517-【控制中心】【个性化】【任务栏】个性化任务栏设置状态切换', async ({ agent, uos, system }) => {
    // ========== 步骤1：查看个性化任务栏设置的状态 ==========
    console.log('步骤1：打开控制中心-个性化-桌面和任务栏，查看任务栏状态设置');
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化", { deepThink: true });
    await agent.aiAssert("导航栏显示：个性化");
    await agent.aiTap("桌面和任务栏", { deepThink: true });
    console.log('断言1：任务栏状态默认为"一直显示"');
    await agent.aiAssert("导航栏显示：个性化 / 桌面和任务栏；右侧区域存在设置项标题：状态，其最右侧展示状态文案：一直显示，并带有下拉箭头图标");

    // ========== 步骤2：点击切换为"一直隐藏" ==========
    console.log('步骤2：点击状态下拉框，切换为"一直隐藏"');
    await agent.aiTap("点击“状态”右侧显示“一直显示”的下拉框", { deepThink: true });
    await agent.aiAssert("展示下拉菜单框，存在三个菜单项标题：一直显示、一直隐藏、智能隐藏");
    await agent.aiTap("点击下拉菜单框的菜单项：一直隐藏", { deepThink: true });
    console.log('断言2：切换成功，状态文案更新为"一直隐藏"');
    await agent.aiAssert("下拉菜单框已关闭，“状态”设置项的最右侧状态文案更新为“一直隐藏”");

    // ========== 步骤3：查看任务栏状态显示（一直隐藏下任务栏隐藏，鼠标移至底部唤起） ==========
    // 关闭控制中心窗口，露出桌面，以便验证任务栏状态与右键菜单
    console.log('步骤3：关闭控制中心窗口，露出桌面任务栏');
    // 按窗口 ID 精确关闭控制中心：uos.closeCurrentWindow 关闭的是当前活动窗口，
    // 控制中心非活动时会关错窗口，导致界面残留影响后续断言
    const ccWin = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-control-center" | head -1 | awk '{print $1}'`);
    const ccWinId = ccWin.stdout.toString().trim();
    console.log('步骤3：控制中心窗口ID =', ccWinId);
    if (ccWinId) {
      await system.exec(`${DISP} wmctrl -i -c ${ccWinId}`, 30000);
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 确认控制中心确已关闭，避免界面残留导致断言误判
    const ccLeft = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -c "dde-control-center"`);
    console.log('步骤3：关闭后剩余控制中心窗口数 =', ccLeft.stdout.toString().trim());
    // 鼠标停留在屏幕底部会唤起任务栏，断言前先将鼠标移到屏幕中部
    await system.exec(`${DISP} xdotool mousemove 960 400`, 30000);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('步骤3：查看任务栏状态显示，验证任务栏已隐藏');
    await agent.aiAssert("桌面底部不存在任务栏（底部未显示应用图标与固定区图标）");
    console.log('步骤3：鼠标移动至屏幕底部，验证任务栏可被唤起');
    await showTaskbar(system);
    console.log('断言3：鼠标移动至任务栏处可唤起任务栏');
    await agent.aiAssert("桌面底部展现了任务栏区域（存在应用图标与固定区图标）");

    // ========== 步骤4：任务栏右键菜单后鼠标移动到状态菜单，查看勾选状态 ==========
    console.log('步骤4：在任务栏空白处右键，鼠标移动到"状态"菜单，查看勾选状态');
    // 智能隐藏状态下任务栏会再次隐藏，右键前先唤起任务栏
    await showTaskbar(system);
    await rightClickTaskbar(agent, system);
    await agent.aiAssert("任务栏右键菜单已展开");
    await agent.aiHover("任务栏右键菜单的“状态”选项", { deepThink: true });
    console.log('断言4："一直隐藏"为勾选状态');
    await agent.aiAssert("“状态”子菜单已展开，其中“一直隐藏”菜单项为勾选状态（菜单项前方有勾选标记）");

    // ========== 步骤5：点击智能隐藏，查看勾选状态 ==========
    console.log('步骤5：点击"状态"子菜单中的"智能隐藏"');
    await agent.aiTap("“状态”子菜单中的菜单项：智能隐藏", { deepThink: true });
    console.log('步骤5：鼠标移动至屏幕底部唤起任务栏，再次右键打开"状态"菜单，验证"智能隐藏"勾选状态');
    await showTaskbar(system);
    await rightClickTaskbar(agent, system);
    await agent.aiAssert("任务栏右键菜单已展开");
    await agent.aiHover("任务栏右键菜单的“状态”选项", { deepThink: true });
    console.log('断言5："智能隐藏"为勾选状态，且"一直隐藏"已取消勾选');
    await agent.aiAssert("“状态”子菜单已展开，其中“智能隐藏”菜单项为勾选状态（菜单项前方有勾选标记），且“一直隐藏”菜单项已无勾选标记");

    // ========== 步骤6：开启任一窗口移动至任务栏处，查看任务栏状态 ==========
    console.log('步骤6：打开文件管理器并移动窗口至任务栏处（窗口与任务栏区域重叠），验证智能隐藏下任务栏自动隐藏');
    // 先关闭可能残留的文件管理器窗口，确保后续按窗口 ID 操作的是本次打开的窗口
    await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-file-manager" | awk '{print $1}' | xargs -r -n1 wmctrl -i -c`, 30000);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await uos.openApp("文件管理器");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("文件管理器窗口已打开");
    // 取文件管理器窗口ID，用原生 X11 事件（wmctrl/xdotool）调整窗口，比框架注入事件可靠
    const fmWin = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-file-manager" | head -1 | awk '{print $1}'`);
    const fmWinId = fmWin.stdout.toString().trim();
    console.log('步骤6：文件管理器窗口ID =', fmWinId);
    // 先取消最大化（本系统最大化窗口高度为 1152，任务栏占位 48px，不会与任务栏重叠），
    // 再调整窗口尺寸与位置，使窗口下沿覆盖屏幕底部 1152~1200 的任务栏区域
    await system.exec(`${DISP} wmctrl -i -r ${fmWinId} -b remove,maximized_vert,maximized_horz`, 30000);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await system.exec(`${DISP} xdotool windowsize ${fmWinId} 1200 900`, 30000);
    await system.exec(`${DISP} xdotool windowmove ${fmWinId} 300 350`, 30000);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 由窗口几何确定性地校验窗口已与任务栏区域重叠（窗口下沿应超过任务栏顶部），
    // 避免用 AI 视觉判断"窗口是否移动到底部"这类几何问题造成误判
    const screenOut = await system.exec(`${DISP} xdotool getdisplaygeometry`);
    const screenH = parseInt(screenOut.stdout.toString().trim().split(/\s+/)[1] || '1200', 10);
    const dockTop = screenH - DOCK_HEIGHT;
    const fmGeo = await system.exec(`${DISP} wmctrl -l -G 2>/dev/null | grep "${fmWinId}" | head -1`);
    const geoText = fmGeo.stdout.toString().trim();
    console.log('步骤6：移动后文件管理器窗口几何 =', geoText);
    // wmctrl -l -G 输出列：窗口ID 桌面 x y 宽 高 主机名 标题
    const geoMatch = geoText.match(/^\S+\s+\S+\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
    const winBottom = geoMatch ? Number(geoMatch[2]) + Number(geoMatch[4]) : -1;
    console.log(`步骤6：窗口下沿 = ${winBottom}，任务栏顶部 = ${dockTop}，已重叠 = ${winBottom > dockTop}`);
    assert.assertTrue(winBottom > dockTop, `文件管理器窗口未与任务栏区域重叠（窗口下沿${winBottom}，任务栏顶部${dockTop}），无法验证智能隐藏`);
    console.log('断言6：窗口移动至任务栏处时，任务栏按智能隐藏规则自动隐藏');
    // 鼠标停留在屏幕底部会唤起任务栏，断言前先将鼠标移到屏幕中部
    await system.exec(`${DISP} xdotool mousemove 960 500`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 智能隐藏规则：窗口与任务栏区域重叠时，任务栏应自动隐藏——此处必须校验任务栏确实不可见
    await agent.aiAssert("桌面底部未显示任务栏（任务栏已按智能隐藏规则自动隐藏）");
    console.log('步骤6：关闭文件管理器窗口');
    // 按窗口 ID 精确关闭，避免 Alt+F4 受框架注入事件不可靠的影响
    await system.exec(`${DISP} wmctrl -i -c ${fmWinId}`, 30000);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ========== 步骤7：查看控制中心-个性化-桌面和任务栏-状态 ==========
    console.log('步骤7：回到控制中心查看任务栏状态设置');
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化", { deepThink: true });
    await agent.aiTap("桌面和任务栏", { deepThink: true });
    console.log('断言7：状态显示为"智能隐藏"');
    await agent.aiAssert("“状态”设置项的最右侧状态文案显示为“智能隐藏”");

    // ========== 步骤8：恢复任务栏状态为"一直显示" ==========
    console.log('步骤8：恢复任务栏状态为"一直显示"');
    await agent.aiTap("点击“状态”右侧显示“智能隐藏”的下拉框", { deepThink: true });
    await agent.aiTap("点击下拉菜单框的菜单项：一直显示", { deepThink: true });
    await agent.aiAssert("“状态”设置项的最右侧状态文案更新为“一直显示”");
  }, { timeout: 600000, tags: ["1504517", "level3"] });

  afterEach(async ({ uos }) => {
    console.log('4. afterEach: 每个测试后的清理，回到桌面');
    await uos.showDesktop();
  });

  // 后置清理：兜底恢复任务栏状态，避免用例中途失败导致环境残留
  afterAll(async ({agent, uos, system}) => {
    console.log('后置清理：确认任务栏状态已恢复为"一直显示"');
    await restoreTaskbarStatus(agent, uos);
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
