/**
 * 用例 PMSID: 1813255
 * 用例标题: 添加到我的共享根目录-从保险箱拖拽文件/文件夹添加
 * 用例模块: 文件管理器/主界面区域/外设/SMB
 * 来源用例: 禅道 PMS https://pms.uniontech.com/testcase-view-1813255.html （v1，1 步）
 * 生成时间: 2026-11-05
 * 用例编写人: UT000159（游伟）
 */
// @ts-nocheck

// 用例原文（PMS 1813255）：
//   前置条件：已进入我的共享根目录
//   步骤1：从保险箱拖拽文件/文件夹到我的共享根目录下
//          预期：不能拖拽到我的共享
//
// 定位与判定策略：
//   1) 侧边栏「我的共享」「保险箱」「桌面」都是 AT-SPI 无障碍节点（table cell），优先 dogtail
//      取节点中心，取不到时按适配器规则降级 AI（无障碍优先、AI 兜底）；
//   2) 保险箱内的文件/文件夹是 cryfs 挂载点（~/.config/Vault/vault_unlocked）下的真实条目，
//      拖拽源用 agent.aiLocate 取图标中心，鼠标按下/移动/释放统一走 device.getPCService().mouse；
//   3) 「不能拖拽到我的共享」不靠看图，用三层证据：
//      ① 拖拽前后对比共享目录真实内容（find）——共享目录始终保持不变；
//      ② 保险箱内源文件/文件夹仍在原位（未被移出）；
//      ③ 对照实验：同一次拖拽手法把保险箱文件拖到侧边栏"桌面"能成功落入桌面，
//         证明拖拽链路有效，而"我的共享"入口被拒绝——排除"拖拽本身没生效"的假阴性。
//
// 前置说明：侧边栏「我的共享」入口只在存在本地 SMB 用户共享时才显示，
//   beforeAll 确保 smbd 运行并创建本用例专用共享 share1813255；
//   保险箱未解锁（或已被删除）时，在用例体内用公共方法重建并解锁（重建约 3 分钟，故不放 hook）。
//
// 环境还原（测试前后一致）：用例开始前记录保险箱状态（none 不存在 / locked 锁定 / unlocked 已解锁），
//   afterAll 按该状态对称还原——原本没有保险箱就删除本次新建的保险箱与 recoveryKey.key，
//   原本锁定就重新上锁，原本已解锁则保持不动；还原后重新校验状态，不一致直接报错。

const USERNAME = process.env.TEST_USERNAME;
const PASSWD = process.env.TEST_PASSWORD;
const CASEDIR = process.env.TESTCASE_DIR;
const HELPERS = `${CASEDIR}midscene_dde_file_manager/common/common.ts`;

const HOME_DIR = `/home/${USERNAME}`;
const DESKTOP_DIR = `${HOME_DIR}/Desktop`;
const SHARE_NAME = 'share1813255';
const SHARE_PATH = `${HOME_DIR}/${SHARE_NAME}`;
const USERSHARE_CONF = `/var/lib/samba/usershares/${SHARE_NAME}`;
const SHARE_COMMENT = '1813255-myshares-root-vault-drag';

// 保险箱解锁后的挂载点：拖拽源文件/文件夹放在这里即等价于"位于保险箱内"
const VAULT_UNLOCKED = `${HOME_DIR}/.config/Vault/vault_unlocked`;
const VAULT_HOME = `${HOME_DIR}/.config/Vault`;
const VAULT_FILE = '1813255_vault.txt';
const VAULT_DIR = '1813255_vault_dir';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 以测试用户口令执行需要 root 的命令 */
async function runSudo(system, cmd) {
  return system.exec(`echo '${PASSWD}' | sudo -S ${cmd}`);
}

/** 确保 smbd 运行且存在本次用例的本地共享；返回用例开始前的原始状态用于还原 */
async function ensureLocalShare(system) {
  const state = { startedSmbd: false, createdShare: false };

  // 注意用严格等于：activating/deactivating 阶段 smbd 尚不可用，net usershare 会失败
  const smbdActive = await system.exec('systemctl is-active smbd');
  state.startedSmbd = String(smbdActive.stdout || '').trim() !== 'active';
  if (state.startedSmbd) {
    console.log('前置：smbd 未运行，启动 smbd');
    await runSudo(system, 'systemctl start smbd');
  }

  const exists = await system.exec(`test -f '${USERSHARE_CONF}' && echo exists`);
  if (!String(exists.stdout || '').includes('exists')) {
    console.log(`前置：创建本地共享 ${SHARE_NAME} -> ${SHARE_PATH}`);
    await system.exec(`mkdir -p '${SHARE_PATH}'`);
    await system.exec(`net usershare add '${SHARE_NAME}' '${SHARE_PATH}' '${SHARE_COMMENT}' '${USERNAME}:F'`);
    state.createdShare = true;
  } else {
    console.log(`前置：本地共享 ${SHARE_NAME} 已存在，复用`);
  }
  return state;
}

/** 还原前置：仅删除本次用例创建的共享/启动的服务 */
async function restoreLocalShare(system, state) {
  if (!state) return;
  if (state.createdShare) {
    console.log(`清理：删除本次用例创建的本地共享 ${SHARE_NAME}`);
    await runSudo(system, `smbcontrol smbd close-share '${SHARE_NAME}' 2>/dev/null || true`);
    await runSudo(system, `rm -f '${USERSHARE_CONF}'`);
    await system.exec(`rmdir '${SHARE_PATH}' 2>/dev/null || true`);
  }
  if (state.startedSmbd) {
    console.log('清理：关闭本次用例启动的 smbd');
    await runSudo(system, 'systemctl stop smbd');
  }
}

/** 保险箱是否已解锁（挂载点存在） */
async function vaultUnlocked(system) {
  const res = await system.exec(`mountpoint -q '${VAULT_UNLOCKED}' && echo YES || echo NO`);
  return String(res.stdout || '').includes('YES');
}

/**
 * 读取执行前保险箱状态：
 *   none     —— 机器上根本没有保险箱（本次被删除的场景）
 *   locked   —— 保险箱存在但处于锁定态
 *   unlocked —— 保险箱存在且已解锁
 * 三种状态对应不同的还原动作，必须区分，否则会破坏"测试前后环境一样"。
 */
async function readVaultState(system) {
  const exists = await system.exec(`test -d '${VAULT_HOME}' && echo yes || echo no`);
  if (!String(exists.stdout || '').includes('yes')) return 'none';
  return (await vaultUnlocked(system)) ? 'unlocked' : 'locked';
}

/** 确保保险箱存在且已解锁：已解锁直接复用；否则用公共方法重建并解锁；返回执行前的保险箱状态用于还原 */
async function ensureVaultUnlocked(uos, env, agent, device, system) {
  const before = await readVaultState(system);
  if (before === 'unlocked') {
    console.log('前置：保险箱已解锁，复用');
    return before;
  }
  console.log(`前置：保险箱状态=${before}，重建并解锁保险箱`);
  const { rmVault, createPasswordVault } = await import(HELPERS);
  await rmVault(system);
  await createPasswordVault(uos, env, agent, device, system);
  if (!(await vaultUnlocked(system))) {
    throw new Error('前置失败：重建后保险箱仍未解锁');
  }
  return before;
}

/** 把保险箱还原到执行前状态：原本没有则删掉本次新建的；原本锁定则重新上锁；原本解锁则保持不动 */
async function restoreVault(system, before) {
  if (before === 'unlocked') {
    console.log('清理：保险箱执行前已解锁，保持解锁状态');
    return;
  }
  const { rmVault } = await import(HELPERS);
  if (before === 'none') {
    console.log('清理：保险箱执行前不存在，删除本次用例新建的保险箱（含密钥文件）');
    await rmVault(system);
  } else {
    console.log('清理：保险箱执行前为锁定态，重新上锁');
    await system.exec(`fusermount -u '${VAULT_UNLOCKED}' 2>/dev/null || true`);
  }
  const after = await readVaultState(system);
  console.log(`清理后保险箱状态: ${after}（执行前为 ${before}）`);
  if (after !== before) {
    throw new Error(`保险箱未还原到执行前状态：期望 ${before}，实际 ${after}`);
  }
}

/** 还原文管配置，避免窗口会话/配置残留影响后续用例 */
async function resetFileManager(system) {
  const { clearEnvironment, closeFileManager } = await import(HELPERS);
  await closeFileManager(system);
  await clearEnvironment(system);
}

/** 文件管理器窗口 id 列表（按窗口类匹配） */
async function fileManagerWindowIds(system) {
  const res = await system.exec("xdotool search --class 'dde-file-manager'");
  const ids = String(res.stdout || '').trim().split('\n').map((v) => v.trim()).filter(Boolean);
  if (ids.length === 0) {
    throw new Error('未找到文件管理器窗口，无法确定拖拽落点区域');
  }
  return ids;
}

/** 读取窗口运行时几何，返回 {x,y,w,h} */
async function windowRect(system, winId) {
  const res = await system.exec(`xdotool getwindowgeometry --shell ${winId}`);
  const text = String(res.stdout || '');
  const pick = (key) => {
    const m = text.match(new RegExp(`${key}=(-?\\d+)`));
    return m ? Number(m[1]) : NaN;
  };
  const rect = { x: pick('X'), y: pick('Y'), w: pick('WIDTH'), h: pick('HEIGHT') };
  if (![rect.x, rect.y, rect.w, rect.h].every(Number.isFinite)) {
    throw new Error(`解析文件管理器窗口几何失败: ${text}`);
  }
  return rect;
}

/** 调整文件管理器窗口：固定到屏幕右侧、整屏高度，保证侧边栏完整可见 */
async function prepareFileManagerWindow(system) {
  const ids = await fileManagerWindowIds(system);
  const screen = await system.exec('xdotool getdisplaygeometry');
  const [sw, sh] = String(screen.stdout || '').trim().split(/\s+/).map(Number);
  const w = Math.round(sw * 0.55);
  const h = sh;
  const x = sw - w;
  const y = 0;

  for (const id of ids) {
    const hexId = `0x${Number(id).toString(16)}`;
    await system.exec(`wmctrl -i -r ${hexId} -b remove,maximized_vert,maximized_horz`);
    await system.exec(`xdotool windowactivate ${id} windowsize ${id} ${w} ${h} windowmove ${id} ${x} ${y}`);
  }
  await sleep(2000);

  const active = await system.exec('xdotool getactivewindow');
  const activeId = String(active.stdout || '').trim();
  const rect = await windowRect(system, ids.includes(activeId) ? activeId : ids[ids.length - 1]);
  console.log(`文件管理器窗口 ids=[${ids.join(',')}] 几何=${JSON.stringify(rect)}`);
  return rect;
}

/** 文管窗口置前，避免 AT-SPI 节点落在其它窗口之下导致点击失效 */
async function raiseFileManager(system) {
  const ids = await fileManagerWindowIds(system);
  for (const id of ids) {
    await system.exec(`xdotool windowactivate ${id} windowraise ${id}`);
  }
  await sleep(1000);
}

/** 在无障碍树中查找侧边栏节点（返回节点数组，失败返回空数组） */
async function findSidebarNodes(dogtail, label, timeoutMs) {
  try {
    const nodes = await dogtail.findAppChildren('dde-file-manager', label, {
      exact: true,
      role: 'table cell',
      underAncestorNameIncludes: 'left_side_bar',
      timeoutMs,
    });
    return nodes || [];
  } catch (error) {
    console.log(`dogtail 查找侧边栏「${label}」失败: ${String(error).slice(0, 120)}`);
    return [];
  }
}

/** 在无障碍树中按名称广域查找节点（不限角色/层级，失败返回空数组） */
async function findAnyAppNode(dogtail, label, timeoutMs) {
  try {
    const nodes = await dogtail.findAppChildren('dde-file-manager', label, {
      exact: true,
      timeoutMs,
    });
    return nodes || [];
  } catch (error) {
    console.log(`dogtail 广域查找「${label}」失败: ${String(error).slice(0, 120)}`);
    return [];
  }
}

/**
 * 我的共享根目录是否已展示（作为"已进入"的判定）。
 * 共享条目在不同版本里可能挂在侧边栏(table cell)也可能只以图标/文本节点出现，
 * 因此先按侧边栏限定查找，取不到再广域查找，避免"已进入但判定不到"的假阴性。
 */
async function shareEntryVisible(dogtail, timeoutMs) {
  const sidebarNodes = await findSidebarNodes(dogtail, SHARE_NAME, timeoutMs);
  if (sidebarNodes.length > 0) return true;
  const anyNodes = await findAnyAppNode(dogtail, SHARE_NAME, timeoutMs);
  if (anyNodes.length > 0) {
    console.log(`无障碍树（广域）中找到共享条目 ${SHARE_NAME}`);
    return true;
  }
  return false;
}

/** 点击侧边栏入口：dogtail 优先 → 无障碍节点几何点击 → AI 兜底 */
async function clickSidebarEntry(agent, device, dogtail, label) {
  const nodes = await findSidebarNodes(dogtail, label, 8000);
  if (nodes.length > 0) {
    try {
      await dogtail.openAppChildByText('dde-file-manager', label, {
        exact: true,
        role: 'table cell',
        underAncestorNameIncludes: 'left_side_bar',
      });
      return true;
    } catch (error) {
      console.log(`dogtail 点击「${label}」未生效: ${String(error).slice(0, 120)}`);
      const center = nodes[0].center || {};
      if (Number.isFinite(center.cx) && Number.isFinite(center.cy)) {
        const mouse = device.getPCService().mouse;
        await mouse.move([{ x: Math.round(center.cx), y: Math.round(center.cy) }]);
        await sleep(300);
        await mouse.click(0);
        return true;
      }
    }
  }
  console.log(`无障碍树中未取到「${label}」入口，降级 AI 点击`);
  await agent.aiTap(`文件管理器左侧边栏中的"${label}"`, { deepThink: true });
  return true;
}

/** 进入我的共享根目录：置前 → 点击 → 校验，失败重试 */
async function enterMyShares(agent, device, system, dogtail) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    if (await shareEntryVisible(dogtail, 2000)) return;
    await raiseFileManager(system);
    await clickSidebarEntry(agent, device, dogtail, '我的共享');
    if (await shareEntryVisible(dogtail, 8000)) {
      console.log(`第 ${attempt} 次点击后已进入我的共享根目录`);
      return;
    }
    console.log(`第 ${attempt} 次进入「我的共享」未生效，重试`);
  }
  throw new Error('无法进入「我的共享」根目录：入口已定位但视图切换未生效');
}

/** 断言当前处于我的共享根目录（视图内出现本机共享文件夹条目） */
async function assertInMySharesRoot(agent, dogtail) {
  if (await shareEntryVisible(dogtail, 5000)) {
    console.log(`无障碍树确认已进入我的共享根目录（可见共享条目 ${SHARE_NAME}）`);
    return;
  }
  await agent.aiAssert(`文件管理器当前位于"我的共享"根目录，内容区域可以看到共享文件夹"${SHARE_NAME}"`);
}

/** 定位侧边栏入口坐标（拖拽落点用） */
async function locateSidebarEntry(agent, dogtail, label) {
  const nodes = await findSidebarNodes(dogtail, label, 8000);
  const center = (nodes[0] && nodes[0].center) || {};
  if (Number.isFinite(center.cx) && Number.isFinite(center.cy)) {
    const point = { x: Math.round(center.cx), y: Math.round(center.cy) };
    console.log(`无障碍节点定位侧边栏「${label}」入口: (${point.x}, ${point.y})`);
    return point;
  }
  const loc = await agent.aiLocate(`文件管理器左侧边栏中的"${label}"入口`);
  const c = Array.isArray(loc && loc.center) ? loc.center : null;
  if (!c) throw new Error(`无法定位侧边栏「${label}」入口`);
  const point = { x: Math.round(c[0]), y: Math.round(c[1]) };
  console.log(`AI 定位侧边栏「${label}」入口: (${point.x}, ${point.y})`);
  return point;
}

/** 进入保险箱视图（侧边栏「保险箱」），并校验拖拽源已显示 */
async function openVaultView(agent, device, system, dogtail, itemName) {
  await raiseFileManager(system);
  await clickSidebarEntry(agent, device, dogtail, '保险箱');
  await sleep(1500);
  await device.pressKey('F5');
  await agent.aiWaitFor(`保险箱内容区域已显示文件"${itemName}"`, { timeoutMs: 30000, checkIntervalMs: 1000 });
}

/** 在文件管理器内容区域定位条目（限制在侧边栏右侧的内容区，避免点到同名侧边栏节点） */
async function locateInContentArea(agent, prompt, rect) {
  const loc = await agent.aiLocate(prompt);
  const center = Array.isArray(loc && loc.center) ? loc.center : null;
  if (!center || !Number.isFinite(center[0]) || !Number.isFinite(center[1])) {
    throw new Error(`AI 定位失败: ${prompt}`);
  }
  const [x, y] = [Math.round(center[0]), Math.round(center[1])];
  if (x < rect.x + 220 || x > rect.x + rect.w || y < rect.y || y > rect.y + rect.h) {
    throw new Error(`定位「${prompt}」落在文件管理器内容区域之外: (${x}, ${y})，窗口几何=${JSON.stringify(rect)}`);
  }
  console.log(`定位「${prompt}」: (${x}, ${y})`);
  return { x, y };
}

/** 按住拖拽：起点按下 → 平滑移动到落点（悬停等待落点反馈）→ 释放 */
async function dragThrough(device, points) {
  const mouse = device.getPCService().mouse;
  const from = points[0];
  await mouse.move([{ x: from.x, y: from.y }]);
  await sleep(400);
  await mouse.pressButton(0);
  // 按住等待：让文件管理器识别为"拖拽"而不是"单击选中"
  await sleep(800);

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const next = points[i];
    const totalDist = Math.round(Math.hypot(next.x - prev.x, next.y - prev.y));
    const step = Math.min(24, Math.max(8, Math.round(totalDist / 30)));
    const steps = Math.max(1, Math.ceil(totalDist / step));
    for (let s = 1; s <= steps; s++) {
      const ratio = s / steps;
      await mouse.move([{
        x: Math.round(prev.x + (next.x - prev.x) * ratio),
        y: Math.round(prev.y + (next.y - prev.y) * ratio),
      }]);
      await sleep(25);
    }
    await mouse.move([{ x: next.x, y: next.y }]);
    await sleep(1500);
  }

  await mouse.releaseButton(0);
  await sleep(2000);
}

/** 读取共享目录真实内容（判定"是否被拖入"的确定性依据） */
async function snapshotShare(system) {
  const res = await system.exec(`find '${SHARE_PATH}' -mindepth 1 2>/dev/null | sort`);
  return String(res.stdout || '').trim();
}

/** 读取保险箱挂载点真实内容 */
async function snapshotVault(system) {
  const res = await system.exec(`find '${VAULT_UNLOCKED}' -mindepth 1 -maxdepth 1 2>/dev/null | sort`);
  return String(res.stdout || '').trim();
}

describe('1813255-添加到我的共享根目录-从保险箱拖拽文件/文件夹添加', () => {
  let shareState = null;
  let vaultStateBefore = null;

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    shareState = await ensureLocalShare(system);
    // 保险箱前置（含"保险箱被删除时重建"）放在用例体内，见测试函数开头：
    // runner 对 hook 有 3 分钟上限、且会忽略 hook 的第二参数超时，重建实测约 3 分钟会被打断。
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813255-添加到我的共享根目录-从保险箱拖拽文件/文件夹添加', async ({ device, agent, uos, system, dogtail, env }) => {
    // 前置0：保险箱就绪。保险箱被删除时这里会走完整 UI 重建流程（实测约 3 分钟），
    //   故放在用例体内（本用例 20 分钟预算）而不是 hook 里（hook 上限 3 分钟）。
    vaultStateBefore = await ensureVaultUnlocked(uos, env, agent, device, system);

    // 前置1：关掉重建保险箱过程中打开的窗口，重新打开一个干净的文件管理器窗口
    const { closeFileManager } = await import(HELPERS);
    await closeFileManager(system);
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器窗口已打开', { timeoutMs: 30000, checkIntervalMs: 1000 });

    // 前置2：窗口就位（右侧固定宽度、整屏高度，保证侧边栏完整可见）
    const rect = await prepareFileManagerWindow(system);

    // 前置2：进入我的共享根目录（用例前置条件：已进入我的共享根目录）
    await enterMyShares(agent, device, system, dogtail);
    await assertInMySharesRoot(agent, dogtail);

    // 准备保险箱内拖拽源（保险箱已解锁，挂载点即保险箱根目录）
    await system.exec(`rm -rf '${VAULT_UNLOCKED}/${VAULT_DIR}' '${VAULT_UNLOCKED}/${VAULT_FILE}'`);
    await system.exec(`mkdir -p '${VAULT_UNLOCKED}/${VAULT_DIR}' && echo 1813255 > '${VAULT_UNLOCKED}/${VAULT_DIR}/inner.txt'`);
    await system.exec(`echo 1813255 > '${VAULT_UNLOCKED}/${VAULT_FILE}'`);
    await system.exec(`rm -rf '${DESKTOP_DIR}/${VAULT_FILE}' '${DESKTOP_DIR}/${VAULT_DIR}'`);
    const vaultBefore = await snapshotVault(system);
    console.log(`保险箱拖拽前内容: [${vaultBefore}]`);

    const before = await snapshotShare(system);
    console.log(`共享目录拖拽前内容: [${before}]`);

    // === 对照实验：同一次拖拽手法落到侧边栏"桌面"应能成功，证明拖拽链路有效 ===
    console.log('对照实验：把保险箱文件拖到侧边栏"桌面"，验证拖拽链路有效');
    await openVaultView(agent, device, system, dogtail, VAULT_FILE);
    const desktopEntry = await locateSidebarEntry(agent, dogtail, '桌面');
    const controlPoint = await locateInContentArea(agent, `文件管理器内容区域中位于保险箱内的"${VAULT_FILE}"图标`, rect);
    await dragThrough(device, [controlPoint, desktopEntry]);
    const controlLanded = await system.exec(`test -e '${DESKTOP_DIR}/${VAULT_FILE}' && echo landed`);
    if (!String(controlLanded.stdout || '').includes('landed')) {
      throw new Error('对照实验失败：拖拽链路未生效（拖到侧边栏"桌面"未落盘），无法据此判定"我的共享"拒绝拖入');
    }
    console.log('对照实验通过：拖拽链路有效（文件已落入桌面）');
    // 还原对照实验：把文件移回保险箱
    await system.exec(`mv '${DESKTOP_DIR}/${VAULT_FILE}' '${VAULT_UNLOCKED}/${VAULT_FILE}'`);
    if (!(await snapshotVault(system)).includes(VAULT_FILE)) {
      throw new Error('对照实验还原失败：文件未回到保险箱');
    }

    const mySharesEntry = await locateSidebarEntry(agent, dogtail, '我的共享');

    for (const item of [VAULT_DIR, VAULT_FILE]) {
      // 回到保险箱视图并确认拖拽源可见（上一次拖拽可能已切换视图）
      await openVaultView(agent, device, system, dogtail, item);
      const itemPoint = await locateInContentArea(
        agent,
        `文件管理器内容区域中位于保险箱内的"${item}"图标`,
        rect,
      );
      console.log(`拖拽「${item}」: (${itemPoint.x}, ${itemPoint.y}) → 侧边栏「我的共享」(${mySharesEntry.x}, ${mySharesEntry.y})`);
      await agent.logScreenshot(`1813255_before_drag_${item}`);

      // 步骤1：从保险箱拖拽文件/文件夹到我的共享根目录
      await dragThrough(device, [itemPoint, mySharesEntry]);
      await agent.logScreenshot(`1813255_after_drag_${item}`);

      // 预期：不能拖拽到我的共享 —— 共享目录真实内容不变
      const after = await snapshotShare(system);
      console.log(`拖拽「${item}」后共享目录内容: [${after}]`);
      if (after !== before) {
        throw new Error(`拖拽「${item}」到我的共享根目录后共享目录内容发生变化（预期不可拖入）: [${after}]`);
      }

      // 预期：保险箱内源条目仍在原位（未被移出/复制出去）
      const vaultAfter = await snapshotVault(system);
      if (!vaultAfter.includes(item)) {
        throw new Error(`拖拽后保险箱源条目不应消失/被移动: ${item}；当前保险箱内容: [${vaultAfter}]`);
      }
      console.log(`「${item}」拖入我的共享被拒绝：共享目录不变、保险箱源条目保留`);

      // 预期：保险箱条目未被复制到桌面（排除落到别处的误判）
      const stray = await system.exec(`ls -d '${DESKTOP_DIR}/${item}' 2>/dev/null`);
      if (String(stray.stdout || '').includes(item)) {
        throw new Error(`拖拽「${item}」后条目出现在桌面，说明落点脱离了我的共享目标区域`);
      }
    }

    // 最终确认：进入我的共享根目录，被拖拽条目不应出现在其中
    await enterMyShares(agent, device, system, dogtail);
    await sleep(1500);
    await agent.logScreenshot('1813255_myshares_root_after');
    await agent.aiAssert('文件管理器"我的共享"根目录内容区域只列出共享文件夹，没有出现 1813255_vault_dir 或 1813255_vault.txt 条目');
    const finalBefore = await snapshotShare(system);
    if (finalBefore !== before) {
      throw new Error(`我的共享根目录复查时共享目录内容发生变化: [${finalBefore}]`);
    }

    console.log('✅ 从保险箱拖拽文件/文件夹到我的共享根目录均被拒绝，共享目录与保险箱内容保持不变');
  }, { timeout: 1200000, tags: ['1813255', 'level3', 'smb', 'myshares', 'vault', 'youwei'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf '${DESKTOP_DIR}/${VAULT_DIR}' '${DESKTOP_DIR}/${VAULT_FILE}' 2>/dev/null || true`);
    await system.exec(`rm -rf '${VAULT_UNLOCKED}/${VAULT_DIR}' '${VAULT_UNLOCKED}/${VAULT_FILE}' 2>/dev/null || true`);
    try {
      await resetFileManager(system);
    } catch (error) {
      console.log(`重置文件管理器配置失败（忽略）: ${String(error).slice(0, 120)}`);
    }
    await restoreLocalShare(system, shareState);
    await restoreVault(system, vaultStateBefore);
    await uos.showDesktop();
  });
});
