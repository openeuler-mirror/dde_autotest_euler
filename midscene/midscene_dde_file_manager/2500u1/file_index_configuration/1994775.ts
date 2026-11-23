// @ts-nocheck

/**
 * 用例 PMSID: 1994775
 * 用例标题: 【文件索引配置】未开启时提示文案检查
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;
const HELPER = `${TEST_HOME}/.cache/midscene/1994775-settings.py`;

const SEARCH_RES = 'org.deepin.dde.file-manager.search';
const INDEX_KEY = 'enableFileIndexSearch';
const PROMPT = '显示提示文案："开启后立即创建文件索引，支持快速搜索文件名"，文案显示完整、无截断';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// AT-SPI 辅助脚本：客观读取文管设置左侧“视图”入口、“恢复默认视图”按钮坐标及当前默认视图
const ATSPI_SETTINGS_HELPER = `import gi, json
gi.require_version('Atspi', '2.0')
from gi.repository import Atspi

Atspi.init()

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
    result = {'nav': {}, 'button': None, 'combo': ''}
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
            if role == 'list item' and name in ('工作区', '视图') and name not in result['nav']:
                result['nav'][name] = info
            elif role == 'button' and name == '恢复默认视图':
                result['button'] = info
            elif role == 'combo box' and name in ('图标视图', '列表视图', '树形视图'):
                result['combo'] = name
        for i in range(n.get_child_count()):
            handle(n.get_child_at_index(i))
    handle(root)
    return result

print(json.dumps(snapshot(app_root()), ensure_ascii=False))
`;

async function snapshotSettings(system) {
  const res = await system.exec(`python3 ${sq(HELPER)}`, 20000);
  try {
    return JSON.parse(String(res?.stdout || '').trim() || '{}');
  } catch (error) {
    return {};
  }
}

async function clickPoint(system, x, y) {
  await system.exec(`xdotool mousemove ${Math.round(x)} ${Math.round(y)} click 1`, 8000);
}

// 清理步骤：文管设置 → 工作区 → 视图 → 点击“恢复默认视图”，并回读当前默认视图
async function restoreSettingsDefaults(system, agent, device, uos) {
  const { closeFileManager, openFileManagerSettings, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await closeFileManager(system);
  await uos.openApp('文件管理器', 3000, 20000, true);
  await activateUserFileManagerWindow(system);
  await system.exec(`mkdir -p ${sq(`${TEST_HOME}/.cache/midscene`)}; cat > ${sq(HELPER)} <<'PYEOF'\n${ATSPI_SETTINGS_HELPER}\nPYEOF`, 15000);
  await openFileManagerSettings(agent, device, system);

  let snap = await snapshotSettings(system);
  const viewNav = (snap.nav || {})['视图'];
  if (!viewNav) throw new Error('文管设置左侧未找到“视图”入口');
  await clickPoint(system, viewNav.x + viewNav.w / 2, viewNav.y + viewNav.h / 2);
  await sleep(1200);

  snap = await snapshotSettings(system);
  let btn = snap.button;
  // “恢复默认视图”位于设置内容底部，不在可视区域时按方向滚动到可见
  for (let i = 0; i < 8 && (!btn || btn.y < 0 || btn.y + btn.h > 1030); i += 1) {
    const wheel = !btn || btn.y < 0 ? 4 : 5;
    await system.exec(`xdotool mousemove 1000 500 click ${wheel}`, 8000);
    await sleep(500);
    snap = await snapshotSettings(system);
    btn = snap.button;
  }
  if (!btn || btn.y < 0 || btn.y + btn.h > 1030) throw new Error('文管设置中未定位到可见的“恢复默认视图”按钮');

  const before = snap.combo || '未知';
  await clickPoint(system, btn.x + btn.w / 2, btn.y + btn.h / 2);
  await sleep(1500);
  snap = await snapshotSettings(system);
  console.log(`文管设置已恢复默认：已点击“恢复默认视图”，默认视图=${snap.combo || before}，按钮坐标=(${btn.x},${btn.y})`);
  try { await device.pressKey('Escape'); } catch (error) { }
  await sleep(500);
}

async function expectUi(agent, prompt, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await agent.aiBoolean(prompt)) return;
    await sleep(1000);
  }
  throw new Error(`UI 断言失败: ${prompt}`);
}

async function openSearchSettings(agent, device, system) {
  const { openFileManagerSettings } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await openFileManagerSettings(agent, device, system);
  await agent.aiTap('设置窗口左侧的高级设置');
  await sleep(1000);
  await agent.aiTap("高级设置下方的'搜索'");
  await sleep(1500);
}

describe('1994775-【文件索引配置】未开启时提示文案检查', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await setDconfig(system, INDEX_KEY, 'false', SEARCH_RES);
    await clearEnvironment(system);
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

  test('1994775-【文件索引配置】未开启时提示文案检查', async ({ device, agent, system }) => {
    await openSearchSettings(agent, device, system);
    if (await agent.aiBoolean("'文件索引'左侧复选框为勾选状态")) {
      console.log('文件索引当前为勾选状态，先关闭以构造未开启前置条件');
      await agent.aiTap('文件索引左侧复选框的中心');
      await sleep(1500);
      const hasDialog = await agent.aiBoolean('出现关闭文件索引的确认对话框');
      if (hasDialog) await agent.aiTap('确认对话框中的确认按钮');
      await sleep(1500);
    }
    await expectUi(agent, "'文件索引'左侧复选框为未勾选状态");
    await expectUi(agent, PROMPT);

    const res = await system.exec("dde-dconfig --get -a org.deepin.dde.file-manager -r 'org.deepin.dde.file-manager.search' -k 'enableFileIndexSearch'", 10000);
    const value = String(res?.stdout || '').trim();
    if (value !== 'false') throw new Error(`前置/预期状态异常：enableFileIndexSearch=${value}`);
    console.log('1994775 测试完成');
  }, { timeout: 300000, tags: ['1994775', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('3. afterEach: 清理单个用例现场');
    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 清理步骤：将文管设置菜单恢复默认（设置 → 文件粉碎 → 恢复默认）
    try {
      await restoreSettingsDefaults(system, agent, device, uos);
    } catch (error) {
      console.log(`⚠️ 文管设置“文件粉碎-恢复默认”步骤异常（后续 resetDconfigDefaults 仍会重置配置）: ${error && error.message ? error.message : error}`);
    }
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
