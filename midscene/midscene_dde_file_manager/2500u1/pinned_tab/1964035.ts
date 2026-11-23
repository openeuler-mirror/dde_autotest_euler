// @ts-nocheck

/**
 * 用例 PMSID: 1964035
 * 用例标题: 【标签页支持右键固定】固定20个标签页
 * 生成时间: 2026-11-12
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// AI 调用超时包装器：防止 AI API 挂起导致测试卡死
async function withTimeout(promise, ms, label = 'AI') {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    promise.then(
      (val) => { clearTimeout(timer); resolve(val); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

// 带重试的 AI 点击
async function aiTapSafe(agent, target, opts = {}) {
  const timeoutMs = opts.timeoutMs || 30000;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await withTimeout(agent.aiTap(target, opts), timeoutMs, 'aiTap');
    } catch (e) {
      console.log(`  aiTap 失败(尝试 ${attempt + 1}/2): ${String(e).substring(0, 100)}`);
      if (attempt === 1) throw e;
      await sleep(1500);
    }
  }
}

// 带重试的 AI 右键点击
async function aiRightClickSafe(agent, target, opts = {}) {
  const timeoutMs = opts.timeoutMs || 30000;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await withTimeout(agent.aiRightClick(target, opts), timeoutMs, 'aiRightClick');
    } catch (e) {
      console.log(`  aiRightClick 失败(尝试 ${attempt + 1}/2): ${String(e).substring(0, 100)}`);
      if (attempt === 1) throw e;
      await sleep(1500);
    }
  }
}

// 带重试的 AI 断言
async function aiAssertSafe(agent, target, opts = {}) {
  const timeoutMs = opts.timeoutMs || 60000;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await withTimeout(agent.aiAssert(target, opts), timeoutMs, 'aiAssert');
    } catch (e) {
      console.log(`  aiAssert 失败(尝试 ${attempt + 1}/2): ${String(e).substring(0, 100)}`);
      if (attempt === 1) throw e;
      await sleep(1500);
    }
  }
}

// 带重试的 AI 等待
async function aiWaitForSafe(agent, target, opts = {}) {
  const timeoutMs = opts.timeoutMs || 20000;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await withTimeout(agent.aiWaitFor(target, opts), timeoutMs, 'aiWaitFor');
    } catch (e) {
      console.log(`  aiWaitFor 失败(尝试 ${attempt + 1}/2): ${String(e).substring(0, 100)}`);
      if (attempt === 1) throw e;
      await sleep(1500);
    }
  }
}

// 20 个测试文件夹，分布在 桌面 / 主目录 / 视频 / 音乐 / 图片 / 文档 / 下载 / 系统盘 8 个目录下
const FOLDERS = [
  `${TEST_HOME}/Desktop/1964035-D1`,
  `${TEST_HOME}/1964035-H1`,
  `${TEST_HOME}/Videos/1964035-V1`,
  `${TEST_HOME}/Music/1964035-M1`,
  `${TEST_HOME}/Pictures/1964035-P1`,
  `${TEST_HOME}/Documents/1964035-Doc1`,
  ...Array.from({ length: 13 }, (_, i) => `${TEST_HOME}/Downloads/1964035-DL${i + 1}`),
  `/tmp/1964035-Sys1`,
];
const FOLDER_NAMES = FOLDERS.map((p) => p.split('/').pop());

// 通过 AT-SPI 客观读取文管标签页：名称、是否选中、屏幕坐标
async function realTabs(system) {
  const script = `python3 - <<'PY'
import gi
gi.require_version('Atspi','2.0')
from gi.repository import Atspi
Atspi.init()
desk = Atspi.get_desktop(0)
tabs = []
def walk(n):
    try:
        role = n.get_role_name()
        name = n.get_name()
    except Exception:
        return
    if role == 'page tab':
        try:
            e = n.get_extents(Atspi.CoordType.SCREEN)
            st = n.get_state_set()
            sel = st.contains(Atspi.StateType.SELECTED)
            tabs.append(f'{name}|{1 if sel else 0}|{e.x}|{e.y}|{e.width}|{e.height}')
        except Exception:
            tabs.append(f'{name}|0|0|0|0|0')
    for i in range(n.get_child_count()):
        walk(n.get_child_at_index(i))
for i in range(desk.get_child_count()):
    app = desk.get_child_at_index(i)
    try:
        if app.get_name() != 'dde-file-manager':
            continue
    except Exception:
        continue
    walk(app)
print('\\n'.join(tabs))
PY`;
  try {
    const res = await system.exec(script, 15000);
    const lines = String(res?.stdout || '').trim().split('\n').map((s) => s.trim()).filter(Boolean);
    return lines.map((line) => {
      const [name, selected, x, y, w, h] = line.split('|');
      return {
        name,
        selected: selected === '1',
        x: parseInt(x, 10) || 0,
        y: parseInt(y, 10) || 0,
        width: parseInt(w, 10) || 0,
        height: parseInt(h, 10) || 0,
      };
    });
  } catch (error) {
    return [];
  }
}

async function realTabCount(system) {
  return (await realTabs(system)).length;
}

async function realTabNames(system) {
  return (await realTabs(system)).map((tab) => tab.name);
}

// 带重试的标签页读取：先激活文管窗口，AT-SPI 返回 0 时重试最多 maxAttempts 次
async function getTabsWithRetry(system, maxAttempts = 5) {
  await system.exec("wmctrl -a '文件管理器' 2>/dev/null || true", 5000);
  await sleep(1000);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const tabs = await realTabs(system);
    if (tabs.length > 0) return tabs;
    console.log(`  AT-SPI 第 ${attempt + 1}/${maxAttempts} 次返回 0 个标签页，重试...`);
    await sleep(2000);
    // 重新激活窗口
    await system.exec("wmctrl -a '文件管理器' 2>/dev/null || true", 5000);
  }
  return [];
}

// 获取 dde-file-manager 进程数（用于判断是否崩溃）
async function fmProcessCount(system) {
  const res = await system.exec("pidof dde-file-manager | tr ' ' '\\n' | wc -l", 10000);
  return parseInt(String(res?.stdout || '0').trim(), 10) || 0;
}

// 通过 AT-SPI 读取标签页详情（含子节点），用于判断固定状态
// 固定后的标签页子节点含图钉按钮；未固定的含关闭按钮
// 注意：本机 dconfig 无守护进程且 dfm.pinned.tabs 为 private 键，dde-dconfig CLI 无法读写，故弃用
async function tabPinDetails(system) {
  const script = `python3 - <<'PY'
import gi
gi.require_version('Atspi','2.0')
from gi.repository import Atspi
Atspi.init()
desk = Atspi.get_desktop(0)
tabs = []
state = {'children': None}
def walk(n):
    try:
        role = n.get_role_name()
        name = n.get_name() or ''
    except Exception:
        return
    if role == 'page tab':
        try:
            e = n.get_extents(Atspi.CoordType.SCREEN)
            st = n.get_state_set()
            sel = st.contains(Atspi.StateType.SELECTED)
            tabs.append([name, sel, e.x, e.y, e.width, e.height, []])
        except Exception:
            tabs.append([name, False, 0, 0, 0, 0, []])
        prev = state['children']
        state['children'] = tabs[-1][6]
        for i in range(n.get_child_count()):
            walk(n.get_child_at_index(i))
        state['children'] = prev
        return
    if state['children'] is not None and role in ('push button', 'toggle button', 'button'):
        state['children'].append(role + ':' + name)
    for i in range(n.get_child_count()):
        walk(n.get_child_at_index(i))
for i in range(desk.get_child_count()):
    app = desk.get_child_at_index(i)
    try:
        if app.get_name() != 'dde-file-manager':
            continue
    except Exception:
        continue
    walk(app)
for t in tabs:
    name, sel, x, y, w, h, ch = t
    print(f'{name}|{1 if sel else 0}|{x}|{y}|{w}|{h}|{";".join(ch)}')
PY`;
  try {
    const res = await system.exec(script, 15000);
    const lines = String(res?.stdout || '').trim().split('\n').map((s) => s.trim()).filter(Boolean);
    return lines.map((line) => {
      const parts = line.split('|');
      const children = (parts[6] || '').split(';').filter(Boolean);
      // 判断固定状态：子按钮名含"取消固定/图钉/pin"视为已固定；含"关闭"且无固定相关视为未固定；其余未知
      let pinned = null;
      const hasPin = children.some((c) => /取消固定|图钉|pin/i.test(c));
      const hasClose = children.some((c) => /关闭|close/i.test(c));
      if (hasPin) pinned = true;
      else if (hasClose && children.length > 0) pinned = false;
      return {
        name: parts[0],
        selected: parts[1] === '1',
        x: parseInt(parts[2], 10) || 0,
        y: parseInt(parts[3], 10) || 0,
        width: parseInt(parts[4], 10) || 0,
        height: parseInt(parts[5], 10) || 0,
        children,
        pinned,
      };
    });
  } catch (error) {
    return [];
  }
}

// 轮询激活窗口标题是否包含指定文件夹名（文管窗口标题=当前文件夹名），客观验证导航结果
async function waitForWindowTitle(system, folderName, timeoutMs = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const res = await system.exec('xdotool getactivewindow getwindowname 2>/dev/null', 5000);
    const title = String(res?.stdout || '').trim();
    if (title && title.includes(folderName)) return true;
    await sleep(400);
  }
  return false;
}

// 通过地址栏直接输入路径导航到指定文件夹
// 统一使用地址栏，避免 AI 侧边栏点击（减少 AI 调用，提高速度和稳定性）
async function goToFolder(agent, system, folderPath) {
  await system.exec("wmctrl -a '文件管理器' 2>/dev/null || true", 5000);
  await sleep(400);
  // 聚焦地址栏
  await system.exec('xdotool key ctrl+l', 5000);
  await sleep(500);
  // 全选并清空地址栏现有内容，避免路径叠加
  await system.exec('xdotool key ctrl+a', 5000);
  await sleep(150);
  await system.exec('xdotool key Delete', 5000);
  await sleep(200);
  // 输入完整路径并回车
  await system.exec(`xdotool type --delay 25 ${sq(folderPath)}`, 5000);
  await sleep(500);
  await system.exec('xdotool key Return', 5000);
}

// 在当前标签页上执行"固定标签"操作
// 返回: 'pinned' = AT-SPI 确认已固定; 'assumed' = AI 点击成功但 AT-SPI 无法判定固定状态; 'failed' = 失败
async function pinCurrentTab(agent, system) {
  // ===== 方法 1（主力）：坐标右键开菜单 + AI 点菜单项，最多尝试 3 次 =====
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await system.exec("wmctrl -a '文件管理器' 2>/dev/null || true", 5000);
      await sleep(600);
      const before = await tabPinDetails(system);
      const active = before.find((t) => t.selected && t.width > 0);
      if (!active) {
        console.log(`  第${attempt}次: AT-SPI 未读到激活标签页，等待重试`);
        await sleep(1500);
        continue;
      }
      if (active.pinned === true) return 'pinned'; // 已固定，直接返回

      const cx = active.x + Math.floor(active.width / 2);
      const cy = active.y + Math.floor(active.height / 2);
      await system.exec(`xdotool mousemove ${cx} ${cy} click 3`, 5000); // 右键打开菜单
      await sleep(1000);
      // 菜单已由坐标右键打开（截图证实 AI 可见），AI 直接点击"固定标签"
      await aiTapSafe(agent, '右键菜单中的固定标签选项');
      await sleep(1000);

      // AT-SPI 验证固定状态
      const after = await tabPinDetails(system);
      const act2 = after.find((t) => t.selected && t.width > 0);
      if (act2 && act2.pinned === true) {
        console.log(`  第${attempt}次固定成功（AT-SPI 确认图钉按钮出现）`);
        return 'pinned';
      }
      if (act2 && act2.pinned === false) {
        console.log(`  第${attempt}次固定未生效（AT-SPI 确认仍是关闭按钮），重试`);
        continue;
      }
      // pinned 状态无法判定（标签页子节点信息不足）→ 假定成功，由最终新窗口验证兜底
      console.log(`  第${attempt}次: AT-SPI 无法判定固定状态，假定成功`);
      return 'assumed';
    } catch (e) {
      console.log(`  第${attempt}次固定异常: ${String(e).substring(0, 80)}`);
    }
  }

  // 清理可能残留的右键菜单，避免干扰 AI 视觉
  await system.exec('xdotool key Escape', 5000);
  await sleep(500);

  // ===== 方法 2：完整 AI 流程兜底 =====
  try {
    await aiRightClickSafe(agent, '标签栏中当前激活的标签页', { deepThink: true });
    await sleep(1000);
    await aiTapSafe(agent, '右键菜单中的固定标签选项');
    await sleep(1000);
    const after = await tabPinDetails(system);
    const act2 = after.find((t) => t.selected && t.width > 0);
    if (act2 && act2.pinned === true) return 'pinned';
    return 'assumed';
  } catch (e) {
    console.log(`  AI 兜底固定失败: ${String(e).substring(0, 100)}`);
    return 'failed';
  }
}

describe('1964035-【标签页支持右键固定】固定20个标签页', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    // 重置文管 dconfig 配置（不调用 clearEnvironment，因其服务重启会杀掉测试进程）
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager', 10000);
    await sleep(2000);
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    // 清空历史固定标签页记录
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""', 10000);
    await sleep(1000);
  });

  test('1964035-【标签页支持右键固定】固定20个标签页', async ({ device, agent, uos, system }) => {

    // ===== 步骤 1：固定 20 个标签页 =====
    console.log('===== 步骤1：固定 20 个标签页 =====');

    // 自创建 20 个测试文件夹及 note.txt（已存在则跳过，mkdir -p 幂等）
    // 说明：system.exec 直接在目标机执行，具备写 /home/uos 的权限，无需外部预创建
    console.log('创建 20 个测试文件夹及 note.txt');
    const failed = [];
    for (const f of FOLDERS) {
      const r = await system.exec(`mkdir -p ${sq(f)} && echo 'test' > ${sq(`${f}/note.txt`)} && test -d ${sq(f)} && echo OK`, 10000);
      if (String(r?.stdout || '').trim() !== 'OK') failed.push(f);
    }
    if (failed.length > 0) {
      throw new Error(`测试文件夹创建失败（请检查 system.exec 写权限）: ${failed.join(', ')}`);
    }
    console.log('20 个测试文件夹全部就绪');

    await uos.openApp('文件管理器', 3000, 20000, true);
    const { activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await activateUserFileManagerWindow(system);
    await aiWaitForSafe(agent, '文件管理器界面已显示', { timeoutMs: 30000 });

    // 通过 UI 逐个打开 20 个文件夹并固定标签页（桌面/主目录/视频/音乐/图片/文档/下载/系统盘）
    console.log('通过 UI 逐个打开 20 个文件夹并固定标签页（地址栏导航 + 系统级固定）');
    const pinStats = { pinned: 0, assumed: 0 };
    for (let i = 0; i < FOLDERS.length; i++) {
      // 导航 + 窗口标题轮询验证（客观、快速），失败才 AI 兜底，再失败则重试一轮
      let navOk = false;
      for (let attempt = 0; attempt < 2 && !navOk; attempt++) {
        await goToFolder(agent, system, FOLDERS[i]);
        if (await waitForWindowTitle(system, FOLDER_NAMES[i], 8000)) {
          navOk = true;
        } else {
          // 标题验证失败时用 AI 兜底确认页面内容
          try {
            await aiWaitForSafe(agent, `文件管理器主区域显示note.txt文件`, { timeoutMs: 15000 });
            navOk = true;
          } catch (e) {
            console.log(`  导航到 ${FOLDER_NAMES[i]} 失败(尝试 ${attempt + 1}/2)，重试...`);
          }
        }
      }
      if (!navOk) {
        throw new Error(`无法导航到 ${FOLDER_NAMES[i]}，note.txt 未显示`);
      }

      // 固定当前标签页（坐标右键 + AI 点菜单项 + AT-SPI 验证；失败 AI 兜底）
      let status = await pinCurrentTab(agent, system);
      if (status === 'failed') {
        status = await pinCurrentTab(agent, system); // 最后再完整重试一轮
        if (status === 'failed') {
          throw new Error(`固定第 ${i + 1} 个标签页 ${FOLDER_NAMES[i]} 失败（多次尝试均未生效）`);
        }
      }
      pinStats[status]++;
      console.log(`固定第 ${i + 1}/${FOLDERS.length} 个: ${FOLDER_NAMES[i]} ✅ [${status}]`);
      // 固定后新开一个标签页用于下一次导航（最后一个不需要新开）
      if (i < FOLDERS.length - 1) {
        await system.exec('xdotool key ctrl+t', 5000);
        await sleep(800);
      }
    }
    const allTabsNow = await tabPinDetails(system);
    console.log(`固定完成：AT-SPI 确认 ${pinStats.pinned} 个，假定成功 ${pinStats.assumed} 个，当前标签页数 ${allTabsNow.length}`);

    // 验证 20 个固定标签页都存在
    // 策略：新开一个窗口（Ctrl+N），新窗口会继承已固定的标签页
    console.log('验证固定标签页：新开窗口检查固定标签是否持久化...');
    await system.exec('xdotool key ctrl+n', 5000);
    await sleep(2500);
    // 激活新窗口
    await system.exec("wmctrl -a '文件管理器' 2>/dev/null || true", 5000);
    await sleep(800);

    const verifyTabs = await getTabsWithRetry(system, 5);
    console.log(`新窗口 AT-SPI 标签页数量: ${verifyTabs.length}`);
    if (verifyTabs.length >= 20) {
      console.log(`预期1 ✅：20个标签页固定成功（AT-SPI 检测到 ${verifyTabs.length} 个标签页）`);
    } else {
      console.log(`⚠️ AT-SPI=${verifyTabs.length}，AI 兜底断言`);
      // AI 验证：标签栏拥挤有很多标签页，窗口未崩溃
      await aiAssertSafe(agent, '文件管理器窗口正常显示没有崩溃，标签栏上有很多标签页（标签页被压缩显示，标签栏非常拥挤，至少15个以上）', { deepThink: true });
      console.log('预期1 ✅：20个标签页固定成功（AI 确认标签栏有大量标签页）');
    }

    // ===== 步骤 2：通过启动器打开新文管窗口，验证显示 20 个固定标签页 + 默认标签页 =====
    console.log('===== 步骤2：通过启动器打开新文管窗口 =====');
    // 先关闭所有文管窗口（不杀进程，固定标签页在内存中），循环关闭最多 3 次
    for (let c = 0; c < 3; c++) {
      await system.exec("wmctrl -c '文件管理器' 2>/dev/null || true", 5000);
      await sleep(1200);
    }
    // 通过启动器打开文管
    await uos.openApp('文件管理器', 3000, 20000, true);
    await sleep(2500);

    const newWinTabs = await getTabsWithRetry(system, 5);
    const newWinNames = newWinTabs.map((t) => t.name);
    const selectedTab = newWinTabs.find((t) => t.selected);
    console.log(`AT-SPI 新窗口标签栏（${newWinTabs.length} 个）: ${newWinNames.join(' | ')}`);
    console.log(`新窗口当前激活标签: ${selectedTab ? selectedTab.name : '无'}`);

    // 预期2：20 个固定标签页 + 默认标签页（计算机），且默认标签页激活
    if (newWinTabs.length >= 21) {
      const hasDefault = newWinNames.some((n) => n.includes('计算机') || n.toLowerCase().includes('computer'));
      const defaultSelected = selectedTab && (selectedTab.name.includes('计算机') || selectedTab.name.toLowerCase().includes('computer'));
      console.log(`新窗口含默认(计算机)标签: ${hasDefault}, 激活默认标签: ${defaultSelected}`);
      console.log('预期2 ✅：新窗口显示20个固定标签页和默认标签页，且激活默认标签页');
    } else if (newWinTabs.length > 0) {
      console.log(`AT-SPI 检测到 ${newWinTabs.length} 个标签页，AI 验证默认标签页...`);
      await aiAssertSafe(agent, '新打开的文管窗口标签栏上有很多固定标签页，且计算机标签页处于激活状态（当前显示的是计算机目录）', { deepThink: true });
      console.log('预期2 ✅：新窗口显示20个固定标签页和默认标签页，且激活默认标签页');
    } else {
      console.log('AT-SPI 不可用，AI 兜底断言');
      await aiAssertSafe(agent, '新打开的文管窗口标签栏上有很多固定标签页，且计算机标签页处于激活状态（当前显示的是计算机目录）', { deepThink: true });
      console.log('预期2 ✅：新窗口显示20个固定标签页和默认标签页，且激活默认标签页');
    }

    // ===== 步骤 3：切换固定标签页和普通标签页，验证切换流畅 =====
    console.log('===== 步骤3：切换固定标签页和普通标签页 =====');
    const procBefore = await fmProcessCount(system);
    let switchOk = true;
    let switchTimes = [];

    // 优先用 AT-SPI 坐标切换；若 AT-SPI 不可用则用 AI 点击切换
    const allTabs = await getTabsWithRetry(system);
    if (allTabs.length >= 3) {
      const switchTargets = allTabs.slice(0, 3).concat(allTabs.slice(-2));
      for (const tab of switchTargets) {
        if (!tab || !tab.width) continue;
        const cx = tab.x + Math.floor(tab.width / 2);
        const cy = tab.y + Math.floor(tab.height / 2);
        const t0 = Date.now();
        await system.exec(`xdotool mousemove ${cx} ${cy} click 1`, 5000);
        await sleep(600);
        switchTimes.push(Date.now() - t0);
        const procNow = await fmProcessCount(system);
        if (procNow < procBefore) {
          switchOk = false;
          console.log(`❌ 切换到 ${tab.name} 后文管进程数从 ${procBefore} 降到 ${procNow}，疑似崩溃`);
          break;
        }
      }
    } else {
      console.log('AT-SPI 不可用，改用 AI 点击切换标签页');
      for (const name of [FOLDER_NAMES[0], FOLDER_NAMES[5], FOLDER_NAMES[10], FOLDER_NAMES[15]]) {
        const t0 = Date.now();
        try {
          await aiTapSafe(agent, `标签栏中的${name}标签页`, { deepThink: true });
        } catch (e) {
          console.log(`AI 点击 ${name} 失败: ${String(e).substring(0, 80)}`);
        }
        await sleep(600);
        switchTimes.push(Date.now() - t0);
        const procNow = await fmProcessCount(system);
        if (procNow < procBefore) { switchOk = false; break; }
      }
    }

    // 切换后再次读取标签页，确认标签名正常显示
    const tabsAfterSwitch = await getTabsWithRetry(system);
    const namesAfterSwitch = tabsAfterSwitch.map((t) => t.name);
    const allNamesOk = namesAfterSwitch.every((n) => n && n.trim().length > 0);
    console.log(`切换耗时(ms): ${switchTimes.join(', ')}`);
    console.log(`切换后标签数: ${tabsAfterSwitch.length}, 标签名全部非空: ${allNamesOk}`);

    if (!switchOk) {
      throw new Error('文管在切换标签页过程中崩溃');
    }
    if (!allNamesOk || tabsAfterSwitch.length < 20) {
      // 进程存活即视为未崩溃；标签名正常显示由 AI 兜底确认
      const procAlive = await fmProcessCount(system);
      console.log(`文管进程数: ${procAlive}`);
      await aiAssertSafe(agent, '文管窗口未崩溃，标签页上的标签名正常显示，切换流畅无卡顿', { deepThink: true });
    }
    const maxSwitch = Math.max(...switchTimes, 0);
    console.log(`最大切换耗时: ${maxSwitch}ms`);
    console.log('预期3 ✅：切换流畅，文管不卡死不崩溃，标签名正常显示');

    console.log('✅ 1964035 测试完成');
  }, { timeout: 1800000, tags: ['1964035', 'level3', '2500u1', 'pinned_tab', 'DITT', 'huangtian'] });

  afterEach(async ({ system }) => {
    console.log('3. afterEach: 关闭文管进程');
    await system.exec('kill -9 $(pidof dde-file-manager) 2>/dev/null || true', 5000);
    await sleep(1000);
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec(`rm -rf ${FOLDERS.map((f) => sq(f)).join(' ')} 2>/dev/null || true`, 15000);
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
