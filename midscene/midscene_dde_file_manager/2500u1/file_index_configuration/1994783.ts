// @ts-nocheck

/**
 * 用例 PMSID: 1994783
 * 用例标题: 【文件索引配置】关闭文件索引配置
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;
const HELPER = `${TEST_HOME}/.cache/midscene/1994783-settings.py`;

const SEARCH_RES = 'org.deepin.dde.file-manager.search';
const INDEX_KEY = 'enableFileIndexSearch';
const SHRED_RES = 'org.deepin.dde.file-manager.shred';
const SHRED_KEY = 'shred.enabled';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// AT-SPI 辅助脚本：客观读取文管设置左侧“文件粉碎”入口、设置对话框几何和“恢复默认”按钮坐标
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
    result = {'nav': {}, 'reset': None, 'dialog': None}
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
            if role == 'dialog' and result['dialog'] is None:
                result['dialog'] = info
            elif role == 'list item' and name in ('工作区', '视图', '文件粉碎') and name not in result['nav']:
                result['nav'][name] = info
            elif role == 'button' and name == 'ContentSettingsResetButton':
                result['reset'] = info
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

// 清理步骤：文管设置 → 文件粉碎 → 恢复默认，并回读文件粉碎开关回到默认关闭状态
async function restoreSettingsDefaults(system, agent, device, uos) {
  const { closeFileManager, openFileManagerSettings, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await closeFileManager(system);
  await uos.openApp('文件管理器', 3000, 20000, true);
  await activateUserFileManagerWindow(system);
  await system.exec(`mkdir -p ${sq(`${TEST_HOME}/.cache/midscene`)}; cat > ${sq(HELPER)} <<'PYEOF'\n${ATSPI_SETTINGS_HELPER}\nPYEOF`, 15000);
  await openFileManagerSettings(agent, device, system);

  const before = await getDconfig(system, SHRED_RES, SHRED_KEY);

  // 左侧分类较长，“文件粉碎”默认在可视区下方，滚动左侧导航直到其进入可视区
  let shredNav = null;
  let dlgBox = { x: 553, y: 239, w: 814, h: 566 };
  for (let i = 0; i < 12; i += 1) {
    const snap = await snapshotSettings(system);
    if (snap.dialog) dlgBox = snap.dialog;
    const nav = (snap.nav || {})['文件粉碎'];
    const top = dlgBox.y + 30;
    const bottom = dlgBox.y + dlgBox.h - 25;
    if (nav && nav.y >= top && nav.y <= bottom) {
      shredNav = nav;
      break;
    }
    const wheel = nav && nav.y < top ? 4 : 5;
    await system.exec(`xdotool mousemove ${Math.round(dlgBox.x + 95)} ${Math.round(dlgBox.y + dlgBox.h - 120)} click ${wheel}`, 8000);
    await sleep(400);
  }
  if (!shredNav) {
    const snap = await snapshotSettings(system);
    throw new Error(`文管设置左侧导航未定位到“文件粉碎”入口，nav=${JSON.stringify((snap.nav || {})['文件粉碎'] || null)}，dialog=${JSON.stringify(snap.dialog || null)}`);
  }
  console.log(`文管设置左侧“文件粉碎”入口坐标=(${shredNav.x},${shredNav.y})`);
  await clickPoint(system, shredNav.x + shredNav.w / 2, shredNav.y + shredNav.h / 2);
  await sleep(1500);

  let snap = await snapshotSettings(system);
  if (snap.dialog) dlgBox = snap.dialog;
  let btn = snap.reset;
  // “恢复默认”按钮位于设置内容底部，不在可视区域时按方向滚动到可见
  for (let i = 0; i < 8 && (!btn || btn.y < 0 || btn.y + btn.h > 1030); i += 1) {
    const wheel = !btn || btn.y < 0 ? 4 : 5;
    await system.exec(`xdotool mousemove ${Math.round(dlgBox.x + dlgBox.w - 250)} ${Math.round(dlgBox.y + 300)} click ${wheel}`, 8000);
    await sleep(500);
    snap = await snapshotSettings(system);
    btn = snap.reset;
  }
  if (!btn || btn.y < 0 || btn.y + btn.h > 1030) throw new Error('文件粉碎设置页未定位到可见的“恢复默认”按钮');

  await clickPoint(system, btn.x + btn.w / 2, btn.y + btn.h / 2);
  await sleep(2000);
  const after = await getDconfig(system, SHRED_RES, SHRED_KEY);
  console.log(`文管设置已恢复默认：已点击“文件粉碎-恢复默认”，shred.enabled ${before} → ${after}，按钮坐标=(${btn.x},${btn.y})`);
}

async function getDconfig(system, resource, key) {
  const res = await system.exec(`dde-dconfig --get -a org.deepin.dde.file-manager -r '${resource}' -k '${key}'`, 10000);
  return (((res && res.stdout) || '') + '').trim();
}

async function setDconfigValue(system, resource, key, value) {
  await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r '${resource}' -k '${key}' -v '${value}'`, 10000);
  await sleep(1000);
  const got = await getDconfig(system, resource, key);
  console.log(`setDconfigValue: ${key}=${got}`);
  if (got !== value) throw new Error(`dconfig 设置失败: ${key} 期望 ${value}，实际 ${got}`);
}

async function waitDconfig(system, resource, key, want, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let last = '';
  while (Date.now() < deadline) {
    last = await getDconfig(system, resource, key);
    if (last === want) return true;
    await sleep(1000);
  }
  throw new Error(`等待 dconfig ${key}=${want} 超时，最后一次为 ${last}`);
}

async function expectUi(agent, prompt, timeoutMs = 10000) {
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

describe('1994783-【文件索引配置】关闭文件索引配置', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await setDconfig(system, INDEX_KEY, 'true', SEARCH_RES);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await activateUserFileManagerWindow(system);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    const on = await getDconfig(system, SEARCH_RES, INDEX_KEY);
    if (on !== 'true') throw new Error(`前置条件失败：文件索引未开启，当前 ${on}`);
  });

  test('1994783-【文件索引配置】关闭文件索引配置', async ({ device, agent, system }) => {
    await openSearchSettings(agent, device, system);
    for (let attempt = 0; attempt < 3; attempt++) {
      if (await agent.aiBoolean("搜索设置中'文件索引'左侧复选框为勾选状态")) break;
      console.log(`文件索引未勾选，第${attempt + 1}次点击复选框开启`);
      await agent.aiTap('文件索引左侧复选框的中心');
      await sleep(2000);
    }
    await expectUi(agent, "搜索设置中'文件索引'左侧复选框为勾选状态");

    console.log('步骤1：取消勾选文件索引并查看确认对话框');
    await agent.aiTap('文件索引左侧复选框的中心');
    await agent.aiWaitFor('出现关闭文件索引的确认对话框', { timeoutMs: 10000 });
    await expectUi(agent, '确认对话框显示提示："若关闭，文件搜索时将遍历文件系统，严重影响搜索速度。"');

    console.log('步骤2：点击取消');
    await agent.aiTap('确认对话框中的取消按钮');
    await sleep(1000);
    await waitDconfig(system, SEARCH_RES, INDEX_KEY, 'true', 10000);
    await expectUi(agent, "搜索设置中'文件索引'左侧复选框仍为勾选状态，文件索引处于开启状态");

    console.log('步骤3：再次取消勾选并点击确认');
    await agent.aiTap('文件索引左侧复选框的中心');
    await agent.aiWaitFor('出现关闭文件索引的确认对话框', { timeoutMs: 10000 });
    await agent.aiTap('确认对话框中的确认按钮');
    await waitDconfig(system, SEARCH_RES, INDEX_KEY, 'false', 15000);
    await expectUi(agent, "搜索设置中'文件索引'左侧复选框为未勾选状态，文件索引处于关闭状态", 15000);
    console.log('1994783 测试完成');
  }, { timeout: 300000, tags: ['1994783', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
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
