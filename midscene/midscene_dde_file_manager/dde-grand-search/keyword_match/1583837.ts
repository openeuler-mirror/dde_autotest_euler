/**
 * 用例 PMSID: 1583837
 * 用例标题: 【关键词匹配】正则特殊符号匹配-匹配包含正则转义字符的特殊文件
 * 前置条件：存在按正则规则可描述的本地文件（本用例 beforeAll 自动创建）
 * 操作步骤：依次输入 ^\d$ / ^[3-6]$ / ^\d{7,8}$ / (z|f)food / * / ^[A-Z]+$ / ^[-]?[0-9]+(\.[0-9]+)?$ / .
 * 预期结果：正则表达式不生效（不按正则规则匹配文件）；"*" 与 "." 按普通关键词能搜索出文件
 * 生成时间: 2026-11-12
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const CASE_DIR = `${TEST_HOME}/Desktop/1583837_正则符号`;

// 若正则生效，下列文件会分别被对应的正则规则命中；用于反向验证"正则不生效"
const REGEX_TARGETS = ['1', '5', '12345678', 'zfood', 'ffood', 'ABC', '-12.5'];
const FILES = REGEX_TARGETS.concat(['*星号*.txt', '含点.测试.txt', '1583837控制.txt']);

const STEPS = [
  { keyword: '^\\d$', middle: false, forbid: REGEX_TARGETS, desc: '无法搜索出正则规则匹配的文件' },
  { keyword: '^[3-6]$', middle: false, forbid: REGEX_TARGETS, desc: '无法搜索出正则规则匹配的文件' },
  { keyword: '^\\d{7,8}$', middle: false, forbid: REGEX_TARGETS, desc: '无法搜索出正则规则匹配的文件' },
  { keyword: '(z|f)food', middle: false, forbid: REGEX_TARGETS, desc: '无法搜索出正则规则匹配的文件' },
  { keyword: '*', middle: true, forbid: [], desc: '能搜索出文件（星号按普通字符处理）' },
  { keyword: '^[A-Z]+$', middle: false, forbid: REGEX_TARGETS, desc: '无法搜索出正则规则匹配的文件' },
  { keyword: '^[-]?[0-9]+(\\.[0-9]+)?$', middle: false, forbid: REGEX_TARGETS, desc: '无法搜索出正则规则匹配的文件' },
  { keyword: '.', middle: true, forbid: [], desc: '搜索出包含关键词"."的文件' },
];

describe('1583837-【关键词匹配】正则特殊符号匹配-匹配包含正则转义字符的特殊文件', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 创建正则素材');
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 无扩展名文件同样会被索引，用于验证"按名称精确匹配"的正则规则未生效
    const createCmds = FILES.map((f, i) => `printf '1583837-%d' ${i + 1} > "${CASE_DIR}/${f}"`).join(' && ');
    await system.exec(
      `rm -rf "${CASE_DIR}" && mkdir -p "${CASE_DIR}" && ${createCmds} && ls -1 "${CASE_DIR}"`,
      20000
    );
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留窗口');
    await device.pressKey('Escape');
  });

  test('1583837-【关键词匹配】正则特殊符号匹配-匹配包含正则转义字符的特殊文件', async ({ device, agent }) => {
    const { openGrandSearch, inputGrandSearchKeyword, waitGrandSearchResults } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1：打开全局搜索并确认素材已索引 =====');
    await openGrandSearch(device, agent);
    // 前置校验：先确认索引就绪，否则"无结果"可能只是索引未完成，不能证明正则未生效
    const ready = await waitGrandSearchResults(
      device,
      agent,
      '1583837',
      `搜索结果中显示文件"1583837控制.txt"`,
      180000
    );
    if (!ready) {
      await agent.logScreenshot('1583837-素材未被索引');
      throw new Error('断言失败：180s 内素材"1583837控制.txt"仍未出现在搜索结果中（索引未就绪）');
    }

    console.log('===== 步骤2：逐条校验 8 个正则/特殊符号关键词 =====');
    for (const { keyword, middle, forbid, desc } of STEPS) {
      console.log(`----- 输入"${keyword}"：预期 ${desc} -----`);
      await inputGrandSearchKeyword(device, keyword);
      await sleep(3500);
      const raw = await agent.aiQuery('搜索结果中显示的所有文件名（含扩展名，不含路径），没有结果时返回空数组');
      const names = (Array.isArray(raw) ? raw : []).map((x) => String(x));
      console.log(`"${keyword}" 结果文件：${JSON.stringify(names)}`);
      const nonEmpty = names.length > 0 || (await agent.aiBoolean('搜索结果中显示了至少一个本地文件或文件夹结果'));

      if (middle) {
        // "*" 与 "." 预期能搜索出文件：结果非空即通过
        if (!nonEmpty) {
          await agent.logScreenshot(`1583837-${keyword}-无结果`);
          throw new Error(`断言失败：输入"${keyword}"后搜索结果为空（预期${desc}）`);
        }
        continue;
      }

      // 正则类关键词：结果中不得出现被对应正则规则命中的文件
      for (const key of forbid) {
        const hit = names.some((n) => n === key || n.includes(key));
        if (!hit) continue;
        await agent.logScreenshot(`1583837-${keyword}-正则误生效-${key}`);
        throw new Error(`断言失败：输入"${keyword}"后搜索出文件"${key}"，说明正则表达式被当作规则执行（预期${desc}）`);
      }
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 900000, tags: ['1583837', 'level3', 'grand_search', 'xuqi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 关闭全局搜索');
    await device.pressKey('Escape');
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 删除素材并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
    await system.exec(`rm -rf "${CASE_DIR}"`, 15000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
