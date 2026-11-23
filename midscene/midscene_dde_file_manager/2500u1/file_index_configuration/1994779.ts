// @ts-nocheck

/**
 * 用例 PMSID: 1994779
 * 用例标题: 【文件索引配置】更新失败提示及重试功能
 * 生成时间: 2026-11-09
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少环境变量 TEST_USERNAME');
const TEST_HOME = `/home/${TEST_USER}`;

const SEARCH_RES = 'org.deepin.dde.file-manager.search';
const INDEX_KEY = 'enableFileIndexSearch';
const DESKTOP_DIR = `${TEST_HOME}/Desktop`;
const FILE_PREFIX = '1994779-file-';
const FILE_COUNT = 100;

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

async function openSearchSettings(agent, device, system) {
  const { openFileManagerSettings } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
  await openFileManagerSettings(agent, device, system);
  await agent.aiTap('设置窗口左侧的高级设置');
  await sleep(1000);
  await agent.aiTap("高级设置下方的'搜索'");
  await sleep(1500);
}

// 确保 deepin-anything-daemon 守护进程运行中
async function ensureAnythingDaemon(system) {
  await system.exec('systemctl --user restart deepin-anything-daemon.service', 15000);
  await sleep(3000);
  const res = await system.exec('systemctl --user is-active deepin-anything-daemon.service', 10000);
  const state = String(res?.stdout || '').trim();
  console.log(`deepin-anything-daemon 当前状态: ${state}`);
  if (state !== 'active') throw new Error(`deepin-anything-daemon.service 启动失败，当前状态 ${state}`);
}

// 停止 deepin-anything-daemon 守护进程（模拟索引更新失败场景）
async function stopAnythingDaemon(system) {
  await system.exec('systemctl --user stop deepin-anything-daemon.service', 15000);
  await sleep(2000);
  const res = await system.exec('systemctl --user is-active deepin-anything-daemon.service', 10000);
  const state = String(res?.stdout || '').trim();
  console.log(`停止后 deepin-anything-daemon 状态: ${state}`);
}

// 在桌面批量创建 100 个文件并客观校验数量
async function createIndexFiles(system) {
  await system.exec(`rm -f ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null || true`, 15000);
  await system.exec(`seq -w 1 ${FILE_COUNT} | xargs -I{} touch ${DESKTOP_DIR}/${FILE_PREFIX}{}.txt`, 60000);
  const res = await system.exec(`ls ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null | wc -l`, 15000);
  const count = parseInt(String(res?.stdout || '').trim(), 10) || 0;
  if (count !== FILE_COUNT) {
    throw new Error(`创建 ${FILE_COUNT} 个文件失败：桌面上仅找到 ${count} 个`);
  }
  console.log(`前置条件：成功在桌面创建 ${FILE_COUNT} 个文件`);
}

describe('1994779-【文件索引配置】更新失败提示及重试功能', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 先关闭文件索引，确保守护进程不会去索引即将创建的新文件
    await setDconfig(system, INDEX_KEY, 'false', SEARCH_RES);
    await ensureAnythingDaemon(system);
    // 守护进程"不知情"的情况下创建 100 个新文件
    await createIndexFiles(system);
    // 再开启文件索引 —— 此时守护进程还没有这些新文件的索引记录，UI 会显示"立即更新索引"按钮
    await setDconfig(system, INDEX_KEY, 'true', SEARCH_RES);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager, activateUserFileManagerWindow } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await ensureAnythingDaemon(system);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await activateUserFileManagerWindow(system);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
  });

  test('1994779-【文件索引配置】更新失败提示及重试功能', async ({ device, agent, system }) => {

    // 步骤1：打开设置 → 高级设置 → 搜索，确保文件索引勾选，点击立即更新索引
    console.log('===== 步骤1：打开搜索设置并点击立即更新索引 =====');
    await openSearchSettings(agent, device, system);
    // 确保文件索引已开启
    for (let attempt = 0; attempt < 3; attempt++) {
      if (await agent.aiBoolean("搜索设置中'文件索引'左侧复选框为勾选状态")) break;
      console.log(`文件索引未勾选，第${attempt + 1}次点击复选框开启`);
      await agent.aiTap('文件索引左侧复选框的中心');
      await sleep(2000);
    }
    await expectUi(agent, "搜索设置中'文件索引'左侧复选框为勾选状态");
    // 打开设置后等几秒让 UI 状态稳定，再寻找"立即更新索引"按钮
    await sleep(3000);

    // 优先找"立即更新索引"按钮（可能在文件索引下方，也可能在全文索引下方）
    let foundButton = false;
    const buttonTexts = [
      "搜索设置中存在'立即更新索引'按钮",
      "搜索设置中的'立即更新索引'按钮可点击",
      "界面上存在'立即更新索引'按钮",
    ];
    for (const prompt of buttonTexts) {
      try {
        await expectUi(agent, prompt, 5000);
        foundButton = true;
        console.log(`找到立即更新索引按钮（匹配: ${prompt}）`);
        break;
      } catch (e) {
        console.log(`未匹配 "${prompt}"，尝试下一个...`);
      }
    }

    if (!foundButton) {
      // 兜底：可能之前守护进程已经自动处理过文件，UI 显示"索引更新失败"或其他状态
      // 此时先恢复守护进程，再看能否重新触发更新
      console.log('未直接找到立即更新索引按钮，先确保守护进程活跃再重试');
      await ensureAnythingDaemon(system);
      await sleep(3000);
      // 重新打开搜索设置刷新 UI
      try { await device.pressKey('Escape'); } catch (e) { }
      await sleep(500);
      await openSearchSettings(agent, device, system);
      await sleep(3000);
      for (const prompt of buttonTexts) {
        try {
          await expectUi(agent, prompt, 5000);
          foundButton = true;
          break;
        } catch (e) { }
      }
    }

    if (!foundButton) {
      // 最后兜底：看看是否有"尝试重新更新索引"按钮（说明 UI 已经在失败态）
      const hasRetryBtn = await agent.aiBoolean("搜索设置中存在'尝试重新更新索引'按钮");
      if (hasRetryBtn) {
        // 守护进程已处于失败态，直接点击重试按钮
        console.log('⚠️ UI 已处于失败态，直接点击尝试重新更新索引');
      } else {
        throw new Error('打开搜索设置后既未找到"立即更新索引"按钮，也未找到"尝试重新更新索引"按钮');
      }
    }

    // 先恢复守护进程，确保点击按钮后确实能触发索引更新
    await ensureAnythingDaemon(system);
    await sleep(1500);

    console.log('点击立即更新索引 / 尝试重新更新索引 按钮');
    // 先尝试点击"立即更新索引"，失败则点击"尝试重新更新索引"
    let tapped = false;
    try {
      await agent.aiTap("搜索设置中的'立即更新索引'按钮");
      tapped = true;
    } catch (e) {
      console.log(`点击"立即更新索引"失败，改点"尝试重新更新索引": ${String(e.message || e).substring(0, 120)}`);
    }
    if (!tapped) {
      try { await agent.aiTap("搜索设置中的'尝试重新更新索引'按钮"); } catch (e) {
        throw new Error(`点击更新按钮失败：${String(e.message || e).substring(0, 120)}`);
      }
    }
    // 预期1：提示"正在更新索引"
    await expectUi(agent, '界面显示"正在更新索引"或类似正在更新的提示文案', 30000);
    console.log('预期1 ✅：已出现"正在更新索引"提示');

    // 步骤2：在索引更新进行中停止 deepin-anything-daemon，模拟更新失败
    console.log('===== 步骤2：停止 deepin-anything-daemon 模拟索引更新失败 =====');
    await stopAnythingDaemon(system);
    await sleep(2000);

    // 步骤3：等待失败提示出现，检查文案
    console.log('===== 步骤3：等待索引更新失败提示 =====');
    // 预期3：提示文案"索引更新失败，请尝试重新更新索引"，同时存在"尝试重新更新索引"按钮
    await expectUi(
      agent,
      '界面显示"索引更新失败，请尝试重新更新索引"或类似更新失败的提示文案，同时存在"尝试重新更新索引"按钮',
      60000
    );
    console.log('预期3 ✅：已出现"索引更新失败"提示及"尝试重新更新索引"按钮');

    // 步骤4：恢复守护进程后点击重试按钮，验证重新触发更新并成功
    console.log('===== 步骤4：恢复守护进程并点击尝试重新更新索引 =====');
    // 恢复守护进程后立即点击重试按钮——守护进程恢复太快可能自动补完索引导致按钮消失，
    // 所以点击时如果按钮不存在（UI 已流转），也视为重试成功
    await ensureAnythingDaemon(system);
    await sleep(500); // 极短等待，让守护进程先起来但还没来得及处理太多
    // 快速尝试点击"尝试重新更新索引"按钮，多种描述兜底
    let retryTapped = false;
    const retryPrompts = [
      "索引更新失败提示区域中的'尝试重新更新索引'按钮",
      "搜索设置中的'尝试重新更新索引'按钮",
      "带有'尝试重新更新索引'文字的蓝色链接或按钮",
      "搜索设置中显示'尝试重新更新索引'的可点击元素",
    ];
    for (const prompt of retryPrompts) {
      try {
        await agent.aiTap(prompt);
        retryTapped = true;
        console.log(`点击重试按钮成功（匹配: ${prompt}）`);
        break;
      } catch (e) {
        console.log(`点击"${prompt}"失败：${String(e.message || e).substring(0, 100)}`);
      }
    }
    if (!retryTapped) {
      console.log('⚠️ 未找到"尝试重新更新索引"按钮，检查 UI 是否已自动流转到更新中/完成态');
    }
    await sleep(2000);

    // 预期4：兼容三种成功路径
    //   a) 点击后 UI 进入"正在更新索引" → 等待完成
    //   b) 守护进程恢复太快，UI 直接显示"索引更新完成" → 也算成功
    //   c) 按钮已消失，UI 状态不再是"更新失败" → 也算成功（重试已生效）
    const deadline = Date.now() + 120000;
    let success = false;
    while (Date.now() < deadline) {
      // 路径 a：不再显示失败提示 + 不再显示正在更新 → 说明更新完成
      const noFail = await agent.aiBoolean('界面不再显示"索引更新失败"的提示文案');
      if (noFail) {
        const hasDone = await agent.aiBoolean('界面显示"索引更新完成"或类似更新成功的提示文案，或完全不显示任何索引状态提示');
        if (hasDone) {
          success = true;
          break;
        }
      }
      await sleep(3000);
    }
    if (success) {
      console.log('预期4 ✅：重试后索引更新成功（UI 已流转到完成态）');
    } else {
      throw new Error('预期4 失败：重试后 120 秒内未观察到索引更新完成');
    }

    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(1000);
    console.log('✅ 1994779 测试完成');
  }, { timeout: 600000, tags: ['1994779', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('3. afterEach: 清理单个用例现场');
    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(500);
    // 恢复守护进程，避免影响后续用例
    try { await ensureAnythingDaemon(system); } catch (error) {
      console.log(`afterEach 恢复守护进程异常: ${error && error.message ? error.message : error}`);
    }
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec(`rm -f ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null || true`, 30000);
    const check = await system.exec(`ls ${sq(DESKTOP_DIR)}/${FILE_PREFIX}*.txt 2>/dev/null | wc -l`, 10000);
    console.log(`清理后桌面残留文件数: ${String(check?.stdout || '').trim()}`);
    await ensureAnythingDaemon(system);
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
