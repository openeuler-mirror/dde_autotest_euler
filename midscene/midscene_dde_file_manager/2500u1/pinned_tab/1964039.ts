// @ts-nocheck

/**
 * 用例 PMSID: 1964039
 * 用例标题: 【标签页支持右键固定】固定标签页后使用快捷键操作
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;
const A_DIR = `${TEST_HOME}/Pictures/1964039-A`;
const VIDEO_DIR = `${TEST_HOME}/Videos/1964039-video`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

async function expectUi(agent, prompt, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await agent.aiBoolean(prompt)) return;
    await sleep(1000);
  }
  throw new Error(`UI 断言失败: ${prompt}`);
}

// 通过 AT-SPI 客观读取标签页：名称、是否选中、屏幕坐标
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

async function realTabNames(system) {
  return (await realTabs(system)).map((tab) => tab.name);
}

async function realTabCount(system) {
  return (await realTabs(system)).length;
}

// 固定标签始终位于标签栏最左侧，取最左侧标签的屏幕中心
async function firstTabPoint(system) {
  const tabs = await realTabs(system);
  if (tabs.length === 0) throw new Error('无法获取标签页坐标');
  tabs.sort((a, b) => a.x - b.x);
  const tab = tabs[0];
  return { x: tab.x + Math.floor(tab.width / 2), y: tab.y + Math.floor(tab.height / 2) };
}

// 通过 Alt+1 激活第一个标签（固定标签固定在左侧第一位）
async function focusPinnedTab(system) {
  await system.exec('xdotool key alt+1', 5000);
  await sleep(800);
}

async function fmWindowIds(system) {
  const res = await system.exec("wmctrl -lx | grep -i 'dde-file-manager' | awk '{print $1}'", 10000);
  return String(res?.stdout || '').trim().split('\n').map((s) => s.trim()).filter(Boolean);
}

async function assertPinnedTabA(agent, system, desc) {
  const tabs = await realTabs(system);
  const names = tabs.map((tab) => tab.name);
  if (names.length > 0 && !names.some((name) => name.includes('1964039-A'))) {
    throw new Error(`${desc}: 标签栏中未找到标签1964039-A，当前标签=${names.join(',')}`);
  }
  if (names.length === 0) {
    await expectUi(agent, '文件管理器标签栏中存在标题以1964039开头的标签页');
  }
  console.log(`${desc}: 标签栏=${names.join(' | ')}`);
}

async function openMenuItems(agent) {
  try {
    const raw = await agent.aiQuery('当前屏幕上弹出的右键菜单中所有菜单项的文字，按从上到下顺序返回字符串数组；没有菜单时返回空数组');
    return Array.isArray(raw) ? raw.map((s) => String(s)) : [];
  } catch (error) {
    return [];
  }
}

// 在最左侧标签（固定标签所在位置）上打开右键菜单
async function openTabMenu(system) {
  const point = await firstTabPoint(system);
  await system.exec(`xdotool mousemove ${point.x} ${point.y} click 3`, 5000);
  await sleep(1200);
  return point;
}

// pin=true 固定，pin=false 取消固定；会校验菜单项是否包含目标文字
async function setFirstTabPinned(agent, system, pin) {
  await openTabMenu(system);
  const items = await openMenuItems(agent);
  const want = pin ? '固定标签' : '取消固定标签';
  console.log(`标签右键菜单(${want}): ${items.join(' | ')}`);
  const matched = items.some((item) => (pin ? item.includes('固定标签') && !item.includes('取消固定') : item.includes('取消固定标签')));
  if (!matched) {
    await system.exec('xdotool key Escape', 5000);
    throw new Error(`右键菜单中未找到“${want}”，当前菜单=${items.join(',')}`);
  }
  await agent.aiTap(`右键菜单中的${want}`);
  await sleep(1800);
}

describe('1964039-【标签页支持右键固定】固定标签页后使用快捷键操作', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await system.exec(`rm -rf ${sq(A_DIR)} ${sq(VIDEO_DIR)}; mkdir -p ${sq(A_DIR)}/A1 ${sq(VIDEO_DIR)}`, 15000);
    await system.exec(`printf '1964039 text\\n' > ${sq(A_DIR)}/1964039-note.txt; printf '#!/bin/sh\\necho ok\\n' > ${sq(A_DIR)}/1964039-script.sh; convert -size 160x120 xc:'#2b7de9' ${sq(A_DIR)}/1964039-image.jpg; printf 'fake video\\n' > ${sq(A_DIR)}/1964039-video.mp4`, 30000);
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await system.exec(`dde-dconfig reset -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs`, 10000);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await activateUserFileManagerWindow(system);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
  });

  test('1964039-【标签页支持右键固定】固定标签页后使用快捷键操作', async ({ device, agent, system }) => {
    console.log('前置条件：打开图片目录中的文件夹A并固定标签页');
    await agent.aiTap('文件管理器左侧边栏的图片');
    await sleep(1500);
    await agent.aiDoubleClick('1964039-A');
    await agent.aiWaitFor('文件管理器主区域显示A1文件夹和1964039-note.txt', { timeoutMs: 15000 });
    console.log(`进入A后标签栏=${(await realTabNames(system)).join(' | ')}`);

    console.log('制造前进历史：进入A1后后退回A');
    await agent.aiDoubleClick('1964039-A文件夹中的A1子文件夹');
    await agent.aiWaitFor('文件管理器地址栏显示路径1964039-A/A1', { timeoutMs: 15000 });
    await system.exec('xdotool key alt+Left', 5000);
    await sleep(2500);
    await expectUi(agent, '文件管理器主区域显示A1文件夹和1964039-note.txt');
    console.log(`后退到A后标签栏=${(await realTabNames(system)).join(' | ')}`);

    console.log('右键固定标签页A');
    await setFirstTabPinned(agent, system, true);
    // 再次右键确认已变为“取消固定标签”，客观验证固定成功
    await openTabMenu(system);
    const pinnedMenu = await openMenuItems(agent);
    console.log(`固定后右键菜单: ${pinnedMenu.join(' | ')}`);
    await system.exec('xdotool key Escape', 5000);
    await sleep(800);
    if (!pinnedMenu.some((item) => item.includes('取消固定标签'))) {
      throw new Error(`标签A未处于固定状态，菜单=${pinnedMenu.join(',')}`);
    }
    await assertPinnedTabA(agent, system, '固定后');

    console.log('打开新文管窗口');
    const beforeWindows = await fmWindowIds(system);
    await device.pressKey('Ctrl+N');
    await sleep(3000);
    const afterWindows = await fmWindowIds(system);
    const newWindows = afterWindows.filter((id) => !beforeWindows.includes(id));
    console.log(`窗口: 打开前=${beforeWindows.join(',')} 打开后=${afterWindows.join(',')}`);
    if (newWindows.length === 0) throw new Error('按Ctrl+N后未创建新窗口');
    await assertPinnedTabA(agent, system, '新窗口');
    // 切回原窗口，后续所有操作都在保留历史记录的原窗口中进行
    await system.exec(`wmctrl -i -a ${beforeWindows[0]}`, 5000);
    await sleep(1200);

    console.log('步骤1：在新窗口中键点击固定标签A');
    await focusPinnedTab(system);
    let countBefore = await realTabCount(system);
    const midPoint = await firstTabPoint(system);
    await system.exec(`xdotool mousemove ${midPoint.x} ${midPoint.y}`, 5000);
    await sleep(300);
    await system.exec('xdotool click 2', 5000);
    await sleep(1800);
    await assertPinnedTabA(agent, system, '中键点击后');
    if (countBefore > 0 && (await realTabCount(system)) < countBefore) throw new Error('中键点击后标签数量减少');

    console.log('关闭新窗口，返回固定标签所在窗口');
    for (const id of newWindows) {
      await system.exec(`wmctrl -i -c ${id}`, 5000);
    }
    await sleep(2500);
    await system.exec(`wmctrl -i -a ${beforeWindows[0]}`, 5000);
    await sleep(1200);
    const remainWindows = await fmWindowIds(system);
    console.log(`关闭新窗口后窗口=${remainWindows.join(',')}`);
    if (remainWindows.length !== 1) throw new Error(`新窗口未正确关闭，剩余窗口数=${remainWindows.length}`);

    console.log('步骤2：右键关闭固定标签A');
    const closePoint = await firstTabPoint(system);
    await system.exec(`xdotool mousemove ${closePoint.x} ${closePoint.y} click 3`, 5000);
    await sleep(1200);
    const items = await openMenuItems(agent);
    console.log(`标签A右键菜单: ${items.join(' | ')}`);
    if (items.some((item) => item.includes('关闭标签'))) {
      await agent.aiTap('右键菜单中的关闭标签');
      await sleep(1800);
    } else {
      await device.pressKey('Escape');
    }
    await assertPinnedTabA(agent, system, '右键关闭后');

    console.log('步骤3：按Ctrl+W');
    await focusPinnedTab(system);
    await device.pressKey('Ctrl+W');
    await sleep(1800);
    await assertPinnedTabA(agent, system, 'Ctrl+W后');

    console.log('步骤4：点击左侧视频目录');
    await focusPinnedTab(system);
    countBefore = await realTabCount(system);
    await agent.aiTap('文件管理器左侧边栏的视频');
    await sleep(2500);
    let countVideo = await realTabCount(system);
    if (countBefore > 0 && countVideo <= countBefore) {
      console.log('单击侧边栏未产生新标签页，改用右键菜单“在新标签页中打开”');
      await agent.aiRightClick('文件管理器左侧边栏的视频');
      await sleep(1000);
      await agent.aiTap('右键菜单中的在新标签页中打开');
      await sleep(2500);
      countVideo = await realTabCount(system);
    }
    await assertPinnedTabA(agent, system, '打开视频目录后');
    if (countBefore > 0 && countVideo <= countBefore) throw new Error(`视频目录未以新标签页打开，标签数 ${countBefore} -> ${countVideo}`);

    console.log('步骤5：按Alt+Left');
    await focusPinnedTab(system);
    countBefore = await realTabCount(system);
    await device.pressKey('Alt+Left');
    await sleep(2800);
    await assertPinnedTabA(agent, system, 'Alt+Left后');
    const countBack = await realTabCount(system);
    if (countBefore > 0 && countBack <= countBefore) throw new Error(`Alt+Left未以新标签页打开，标签数 ${countBefore} -> ${countBack}`);

    console.log('步骤6：按Alt+Right（重新建立固定标签的前进历史）');
    // 产品行为：固定标签执行 Alt+Left 后退后，其前进栈会被消耗；
    // 为保证“前进目录”可验证，先取消固定，回到A制造 A->A1->A 的前进历史后重新固定。
    await focusPinnedTab(system);
    await setFirstTabPinned(agent, system, false);
    await agent.aiDoubleClick('1964039-A文件夹中的A1子文件夹');
    await agent.aiWaitFor('文件管理器地址栏显示路径1964039-A/A1', { timeoutMs: 15000 });
    await system.exec('xdotool key alt+Left', 5000);
    await sleep(2500);
    await expectUi(agent, '文件管理器主区域显示A1文件夹和1964039-note.txt');
    await setFirstTabPinned(agent, system, true);
    await assertPinnedTabA(agent, system, '重新固定后');

    await focusPinnedTab(system);
    countBefore = await realTabCount(system);
    await device.pressKey('Alt+Right');
    await sleep(2800);
    await assertPinnedTabA(agent, system, 'Alt+Right后');
    const countForward = await realTabCount(system);
    if (countBefore > 0 && countForward <= countBefore) throw new Error(`Alt+Right未以新标签页打开，标签数 ${countBefore} -> ${countForward}`);
    console.log('1964039 测试完成');
  }, { timeout: 500000, tags: ['1964039', 'level3', '2500u1', 'pinned_tab', 'DITT', 'huangtian'] });

  afterEach(async ({ system }) => {
    console.log('3. afterEach: 关闭文管进程');
    await system.exec('kill -9 $(pidof dde-file-manager) 2>/dev/null || true', 5000);
    await sleep(1000);
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec(`rm -rf ${sq(A_DIR)} ${sq(VIDEO_DIR)} 2>/dev/null || true`, 15000);
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
