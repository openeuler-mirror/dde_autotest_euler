// @ts-nocheck

/**
 * 用例 PMSID: 1994781
 * 用例标题: 【文件索引配置】立即更新索引按钮功能
 * 生成时间: 2026-11-03
 * 用例编写人: UT000649（黄甜）
 *
 * 2026-11-05 优化：用例步骤2的 100 个文件改为在桌面创建并用磁盘计数校验。
 * 原实现用 for 循环创建，但 system.exec 会在命令前拼接环境变量，导致 "VAR=x for ..." 语法错误、
 * 创建静默失败且脚本未校验数量；现改为 seq | xargs touch 批量创建，数量不足直接失败。
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;

const SEARCH_RES = 'org.deepin.dde.file-manager.search';
const INDEX_KEY = 'enableFileIndexSearch';
const DESKTOP_DIR = `${TEST_HOME}/Desktop`;
// 用例步骤2“创建100个文件”：直接创建在桌面，便于用文件计数客观校验创建结果
const FILE_PREFIX = '1994781-file-';
const FILE_COUNT = 100;
const SEARCH_FILE = `${FILE_PREFIX}${String(FILE_COUNT).padStart(3, '0')}.txt`;
const STATUS_FILE = `${TEST_HOME}/.local/share/deepin/dde-file-manager/fulltext-index/index_status.json`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;

// 创建 100 个文件并用磁盘计数客观校验，未达到数量则重试并最终失败
async function createIndexFiles(system) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await system.exec(`rm -f ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null || true`, 15000);
    // system.exec 会在命令前拼接环境变量，for 循环会被解析成非法命令；改用简单管道批量 touch
    await system.exec(`seq -w 1 ${FILE_COUNT} | xargs -I{} touch ${DESKTOP_DIR}/${FILE_PREFIX}{}.txt`, 60000);
    const res = await system.exec(`ls ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null | wc -l`, 15000);
    const count = parseInt(String(res?.stdout || '').trim(), 10) || 0;
    console.log(`第${attempt}次创建后桌面文件数: ${count}/${FILE_COUNT}`);
    if (count === FILE_COUNT) {
      const sample = await system.exec(`ls ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt | head -1; ls ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt | tail -1`, 10000);
      console.log(`桌面100个文件创建成功，示例: ${String(sample?.stdout || '').trim().replace(/\n/g, ' | ')}`);
      return count;
    }
    await sleep(1000);
  }
  throw new Error(`创建100个文件失败：桌面上仅找到 ${FILE_PREFIX}*.txt 不足 ${FILE_COUNT} 个`);
}

async function expectUi(agent, prompt, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await agent.aiBoolean(prompt)) return;
    await sleep(1000);
  }
  throw new Error(`UI 断言失败: ${prompt}`);
}

async function getDconfig(system, resource, key) {
  const res = await system.exec(`dde-dconfig --get -a org.deepin.dde.file-manager -r '${resource}' -k '${key}'`, 10000);
  return String(res?.stdout || '').trim();
}

async function readStatus(system) {
  const res = await system.exec(`cat ${sq(STATUS_FILE)} 2>/dev/null || true`, 10000);
  const text = String(res?.stdout || '').trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (error) {
    console.log(`解析 index_status.json 失败: ${text}`);
    return {};
  }
}

async function waitIndexDone(system, oldTime, timeoutMs = 90000) {
  const deadline = Date.now() + timeoutMs;
  let status = {};
  let timeChanged = false;
  while (Date.now() < deadline) {
    status = await readStatus(system);
    const state = String(status.state || '');
    const time = String(status.lastUpdateTime || '');
    console.log(`索引状态: state=${state} lastUpdateTime=${time} needsRebuild=${status.needsRebuild}`);
    if (time && time !== oldTime) {
      timeChanged = true;
      // 更新完成以 state=clean 为准，避免刚变成 dirty 就继续搜索
      if (state === 'clean') return status;
    }
    await sleep(3000);
  }
  if (timeChanged) {
    console.log(`警告：索引时间已更新但 state 未回到 clean，最后状态: ${JSON.stringify(status)}`);
    return status;
  }
  throw new Error(`等待索引更新完成超时，最后状态: ${JSON.stringify(status)}`);
}

async function openSearchSettings(agent, device, system) {
  const { openFileManagerSettings } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await openFileManagerSettings(agent, device, system);
  await agent.aiTap('设置窗口左侧的高级设置');
  await sleep(1000);
  await agent.aiTap("高级设置下方的'搜索'");
  await sleep(1500);
}

describe('1994781-【文件索引配置】立即更新索引按钮功能', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件并在桌面创建 100 个文件');
    const { closeFileManager, clearEnvironment, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await setDconfig(system, INDEX_KEY, 'true', SEARCH_RES);
    await clearEnvironment(system);
    await createIndexFiles(system);
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

  test('1994781-【文件索引配置】立即更新索引按钮功能', async ({ device, agent, system }) => {
    const before = await readStatus(system);
    const oldTime = String(before.lastUpdateTime || '');
    console.log(`更新前索引状态: ${JSON.stringify(before)}`);

    await openSearchSettings(agent, device, system);
    for (let attempt = 0; attempt < 3; attempt++) {
      if (await agent.aiBoolean("'文件索引'左侧复选框为勾选状态")) break;
      console.log(`文件索引未勾选，第${attempt + 1}次点击复选框开启`);
      await agent.aiTap('文件索引左侧复选框的中心');
      await sleep(2000);
    }
    await expectUi(agent, "'文件索引'左侧复选框为勾选状态");
    const enabledValue = await getDconfig(system, SEARCH_RES, INDEX_KEY);
    console.log(`文件索引配置值: ${enabledValue}`);
    await expectUi(agent, "文件索引下方显示'立即更新索引'按钮", 30000);

    console.log('步骤：点击立即更新索引');
    await agent.aiTap("文件索引下方的'立即更新索引'按钮");
    await sleep(2000);
    const after = await waitIndexDone(system, oldTime);
    console.log(`更新完成后的索引状态: ${JSON.stringify(after)}`);

    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(800);
    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(800);

    console.log('验证索引更新后新文件可被搜索');
    await agent.aiTap('文件管理器左侧边栏的桌面');
    await sleep(1000);
    await agent.aiTap('文件管理器右上角的搜索输入框');
    await device.typeText(SEARCH_FILE.replace('.txt', ''));
    await device.pressKey('Return');
    await expectUi(agent, `搜索结果中存在文件名为${SEARCH_FILE}的文件`, 60000);
    console.log('1994781 测试完成');
  }, { timeout: 300000, tags: ['1994781', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('3. afterEach: 清理单个用例现场');
    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(500);
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec(`rm -f ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null || true`, 30000);
    const check = await system.exec(`ls ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null | wc -l`, 10000);
    console.log(`清理后桌面残留文件数: ${String(check?.stdout || '').trim()}`);
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
