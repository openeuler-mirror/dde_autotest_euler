// @ts-nocheck

/**
 * 用例 PMSID: 1967755
 * 用例标题: 【预览侧边栏支持放大预览图片】未开启"显示预览"
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;
const IMAGE = `${TEST_HOME}/Desktop/1967755-preview.jpg`;

const VIEW_RES = 'org.deepin.dde.file-manager.view';
const PREVIEW_KEY = 'dfm.displaypreview.visible';
const TREE_KEY = 'dfm.treeview.enable';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const HELPER = `${TEST_HOME}/.cache/midscene/1967755-view.py`;

// AT-SPI 辅助脚本：客观读取视图切换按钮的勾选状态和侧边栏“桌面”入口坐标
const ATSPI_VIEW_HELPER = `import gi, json
gi.require_version('Atspi', '2.0')
from gi.repository import Atspi

Atspi.init()

VIEW_NAMES = ('iconView_button', 'listView_button', 'treeView_button')
SKIP_ROLES = ('popup menu', 'menu', 'menu bar')

def app_root():
    desk = Atspi.get_desktop(0)
    for i in range(desk.get_child_count()):
        app = desk.get_child_at_index(i)
        try:
            if app.get_name() == 'dde-file-manager':
                return app
        except Exception:
            continue
    return None

def snapshot(root):
    result = {'views': {}, 'sidebar': {}}
    def handle(n):
        try:
            role = n.get_role_name()
        except Exception:
            return
        if role in SKIP_ROLES:
            return
        try:
            name = n.get_name() or ''
        except Exception:
            name = ''
        try:
            e = n.get_extents(Atspi.CoordType.SCREEN)
        except Exception:
            e = None
        if e is not None and e.width > 0 and e.height > 0:
            info = {'x': e.x, 'y': e.y, 'w': e.width, 'h': e.height}
            if role == 'check box' and name in VIEW_NAMES:
                info['checked'] = bool(n.get_state_set().contains(Atspi.StateType.CHECKED))
                old = result['views'].get(name)
                if old is None or (info['w'] > 0 and old['w'] == 0):
                    result['views'][name] = info
            elif name == '桌面' and e.x < 180 and role in ('table cell', 'list item'):
                if '桌面' not in result['sidebar']:
                    result['sidebar']['桌面'] = info
        for i in range(n.get_child_count()):
            handle(n.get_child_at_index(i))
    handle(root)
    return result

print(json.dumps(snapshot(app_root()), ensure_ascii=False))
`;

async function viewSnapshot(system) {
  const res = await system.exec(`python3 ${sq(HELPER)}`, 20000);
  try {
    return JSON.parse(String(res?.stdout || '').trim() || '{}');
  } catch (error) {
    return { views: {}, sidebar: {} };
  }
}

async function waitView(system, predicate, label, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  let last = {};
  while (Date.now() < deadline) {
    last = await viewSnapshot(system);
    if (predicate(last)) return last;
    await sleep(600);
  }
  throw new Error(`${label}: 超时未满足条件，当前视图=${JSON.stringify((last && last.views) || {})}`);
}

async function clickPoint(system, x, y) {
  await system.exec(`xdotool mousemove ${Math.round(x)} ${Math.round(y)} click 1`, 8000);
}

// 清理步骤：回到用例操作的桌面目录，若处于树形/列表视图则切换回默认图标视图并回读确认
async function restoreDefaultView(system, uos) {
  const { closeFileManager, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  // 优先复用用例结束后仍存在的文管窗口（视图即为用例切换后的真实状态），窗口不存在时才重新打开
  const winRes = await system.exec("wmctrl -lx | grep -c 'dde-file-manager' || true", 10000);
  const hasWindow = (parseInt(String(winRes?.stdout || '').trim(), 10) || 0) > 0;
  if (!hasWindow) {
    await closeFileManager(system);
    await uos.openApp('文件管理器', 3000, 20000, true);
  }
  await activateUserFileManagerWindow(system);
  await system.exec(`mkdir -p ${sq(`${TEST_HOME}/.cache/midscene`)}; cat > ${sq(HELPER)} <<'PYEOF'\n${ATSPI_VIEW_HELPER}\nPYEOF`, 15000);

  let snap = await waitView(system, (s) => Boolean((s.sidebar || {})['桌面']), '读取文管侧边栏');
  const desktop = (snap.sidebar || {})['桌面'];
  // 视图切换按钮仅在具体目录（非“计算机”根）工具栏中显示，先进入用例操作的桌面目录
  await clickPoint(system, desktop.x + Math.min(desktop.w / 2, 60), desktop.y + desktop.h / 2);
  await sleep(1500);
  snap = await waitView(system, (s) => Boolean((s.views || {}).iconView_button || (s.views || {}).treeView_button), '读取桌面目录视图状态');

  const tree = (snap.views || {}).treeView_button;
  const list = (snap.views || {}).listView_button;
  const icon = (snap.views || {}).iconView_button;
  const current = tree && tree.checked ? '树形视图' : (list && list.checked ? '列表视图' : '图标视图');
  if (!icon || !icon.checked) {
    if (!icon || !icon.w) throw new Error('未找到图标视图切换按钮');
    console.log(`当前为${current}，切换回默认图标视图`);
    await clickPoint(system, icon.x + icon.w / 2, icon.y + icon.h / 2);
    snap = await waitView(system, (s) => Boolean(((s.views || {}).iconView_button || {}).checked), '恢复默认图标视图');
    console.log(`已恢复默认图标视图: iconView.checked=${snap.views.iconView_button.checked}，treeView.checked=${(snap.views.treeView_button || {}).checked}，listView.checked=${(snap.views.listView_button || {}).checked}`);
  } else {
    console.log('当前已是默认图标视图，无需切换');
  }
}

async function expectUi(agent, prompt, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await agent.aiBoolean(prompt)) return;
    await sleep(1000);
  }
  throw new Error(`UI 断言失败: ${prompt}`);
}

describe('1967755-【预览侧边栏支持放大预览图片】未开启"显示预览"', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await setDconfig(system, PREVIEW_KEY, 'true', VIEW_RES);
    await setDconfig(system, TREE_KEY, 'true', VIEW_RES);
    await system.exec(`convert -size 480x320 gradient:'#2b7de9-#f4b400' ${sq(IMAGE)}`, 20000);
    await system.exec(`mkdir -p ${sq(`${TEST_HOME}/.cache/midscene`)}; cat > ${sq(HELPER)} <<'PYEOF'\n${ATSPI_VIEW_HELPER}\nPYEOF`, 15000);
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await activateUserFileManagerWindow(system);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
  });

  test('1967755-【预览侧边栏支持放大预览图片】未开启"显示预览"', async ({ agent, system }) => {
    // 从左侧栏进入桌面目录后，用 AT-SPI 客观切换到用例要求的树形视图（视图切换按钮仅在具体目录工具栏显示）
    await agent.aiTap('文件管理器左侧边栏的桌面');
    await sleep(1500);
    let snap = await waitView(system, (s) => Boolean((s.views || {}).treeView_button), '读取视图切换按钮');
    if (!snap.views.treeView_button.checked) {
      const treeButton = snap.views.treeView_button;
      await clickPoint(system, treeButton.x + treeButton.w / 2, treeButton.y + treeButton.h / 2);
      snap = await waitView(system, (s) => Boolean(((s.views || {}).treeView_button || {}).checked), '切换树形视图');
    }
    console.log(`树形视图已开启: treeView.checked=${snap.views.treeView_button.checked}`);

    await agent.aiTap('文件列表中的1967755-preview.jpg');
    await sleep(1500);
    await expectUi(agent, '右侧预览侧边栏已显示1967755-preview.jpg的图片预览');

    console.log('步骤：在视图选项菜单中取消勾选显示预览');
    await agent.aiTap('地址栏右侧的视图选项按钮（一个方框内有三个小点，位于排序按钮左侧）', { deepThink: true });
    await sleep(1200);
    await agent.aiTap("视图选项菜单中的'显示预览'复选框");
    await sleep(2000);

    await expectUi(agent, '右侧预览侧边栏已关闭，文件列表右侧不再显示图片预览区域');
    console.log('1967755 测试完成');
  }, { timeout: 300000, tags: ['1967755', 'level3', '2500u1', 'preview_sidebar', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('3. afterEach: 清理单个用例现场');
    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(500);
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 清理步骤：从树形视图恢复默认图标视图
    try {
      await restoreDefaultView(system, uos);
    } catch (error) {
      console.log(`⚠️ 从树形视图恢复图标视图步骤异常（后续 resetDconfigDefaults 仍会重置配置）: ${error && error.message ? error.message : error}`);
    }
    await system.exec(`rm -f ${sq(IMAGE)} 2>/dev/null || true`, 10000);
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
