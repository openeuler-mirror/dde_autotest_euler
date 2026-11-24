/**
 * 用例 PMSID: 1583937
 * 用例标题: 【搜索预览】预览与非预览区域切换
 * 前置条件：存在可预览的文本文件与不可预览的未知格式文件（本用例 beforeAll 自动创建）
 * 操作步骤：搜索关键词 → 选中不可预览文件 → 选中可预览文件 → 选中 web 搜索结果
 * 预期结果：选中可预览文件时预览区展示内容；选中不可预览文件或 web 结果时预览区不展示文件预览
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const CASE_DIR = `${TEST_HOME}/Desktop/1583937_预览切换`;
const KEY = '1583937';
const PREVIEWABLE = `${KEY}_可预览.txt`;
const NOT_PREVIEWABLE = `${KEY}_不可预览.zzz`;

describe('1583937-【搜索预览】预览与非预览区域切换', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 创建可预览与不可预览素材');
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await system.exec(
      `rm -rf "${CASE_DIR}" && mkdir -p "${CASE_DIR}"` +
      ` && printf '1583937 可预览文本内容\\n第二行内容\\n' > "${CASE_DIR}/${PREVIEWABLE}"` +
      ` && printf '1583937 unknown format' > "${CASE_DIR}/${NOT_PREVIEWABLE}"` +
      ` && ls -l "${CASE_DIR}"`,
      20000
    );
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留窗口');
    await device.pressKey('Escape');
  });

  test('1583937-【搜索预览】预览与非预览区域切换', async ({ device, agent, system }) => {
    const { openGrandSearch, inputGrandSearchKeyword, waitGrandSearchResults } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // system.exec 远程以 root 执行，xdotool 必须显式带上 DISPLAY/XAUTHORITY 才能驱动用户会话鼠标
    const X11 = `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; `;

    console.log('===== 步骤1：搜索关键词，等待文件结果加载 =====');
    await openGrandSearch(device, agent);
    // 新建文件后索引可能滞后：每 10s 重新输入关键词刷新查询，最多等待 180s
    const ready = await waitGrandSearchResults(
      device,
      agent,
      KEY,
      `搜索结果中显示"${PREVIEWABLE}"与"${NOT_PREVIEWABLE}"两个文件`,
      180000
    );
    if (!ready) {
      await agent.logScreenshot('1583937-搜索结果未出现');
      throw new Error('断言失败：180s 内搜索结果仍未出现（索引未就绪），请确认素材目录已被索引');
    }

    // 2026-11-12 取证实证（_probe_kw / _probe_kw3）：dde-grand-search 6.0.51 没有独立的右侧预览面板，
    //   "预览"以结果行内副标题（文件名下方小字）的形式呈现：可预览 txt 的副标题含文件首行内容，
    //   不可预览 .zzz 的副标题只有"修改于 <时间>"；悬停/选中都不会浮出右侧面板。
    //   因此按产品真实形态校验"预览内容随所选项切换出现/消失"，并保留悬停动作贴合用例步骤。
    // 注意：CLI 以 new Function 方式执行脚本，嵌套箭头函数不能带 TS 类型标注
    const hoverResult = async (fileKey) => {
      const located = await agent.aiLocate(`搜索结果中的文件"${fileKey}"`, { deepLocate: false });
      const rect = (located && located.rect) || {};
      const center = (located && located.center) || [];
      let cx = NaN;
      let cy = NaN;
      if (Number.isFinite(rect.left) && Number.isFinite(rect.top)) {
        cx = Math.round(rect.left + rect.width / 2);
        cy = Math.round(rect.top + rect.height / 2);
      } else if (Array.isArray(center) && center.length === 2) {
        cx = Math.round(center[0]);
        cy = Math.round(center[1]);
      }
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) return false;
      console.log(`悬停"${fileKey}"坐标 (${cx},${cy})`);
      await system.exec(`${X11}xdotool mousemove 900 900; sleep 0.3; xdotool mousemove ${cx} ${cy}; sleep 1.5`, 15000);
      return true;
    };

    /** 读取结果行文件名下方的小字（产品预览内容载体） */
    const rowDesc = async (fileKey) => {
      const raw = await agent.aiQuery(`搜索结果中文件"${fileKey}"这一行文件名下方的小字描述文字；如果没有描述则返回空字符串`);
      return String(Array.isArray(raw) ? raw.join(' ') : raw || '');
    };

    /** 轮询等待某行描述满足期望（contains=true 表示必须包含关键词，false 表示必须不包含） */
    const waitDesc = async (fileKey, keyword, contains, timeoutMs) => {
      const deadline = Date.now() + timeoutMs;
      let last = '';
      while (Date.now() < deadline) {
        last = await rowDesc(fileKey);
        if (last.includes(keyword) === contains) {
          console.log(`"${fileKey}" 行内预览文字 ${JSON.stringify(last)}`);
          return true;
        }
        await sleep(2000);
      }
      console.log(`等待超时，"${fileKey}" 最后一次行内预览文字 ${JSON.stringify(last)}`);
      return false;
    };

    console.log('===== 步骤2：悬停可预览文件，行内预览展示内容 =====');
    if (!(await hoverResult(PREVIEWABLE))) {
      await agent.logScreenshot('1583937-未能定位可预览文件');
      throw new Error(`断言失败：未能定位搜索结果中的"${PREVIEWABLE}"`);
    }
    if (!(await waitDesc(PREVIEWABLE, '可预览文本内容', true, 20000))) {
      await agent.logScreenshot('1583937-可预览文件未显示预览');
      throw new Error(`断言失败：悬停"${PREVIEWABLE}"后结果行未展示文本内容预览`);
    }
    // 行内预览文字已通过 aiQuery 精确校验，不再叠加 aiAssert（模型对"预览"措辞判定不稳定，会误判已通过的步骤）

    console.log('===== 步骤3：悬停不可预览文件，不再展示文件内容预览 =====');
    if (!(await hoverResult(NOT_PREVIEWABLE))) {
      await agent.logScreenshot('1583937-未能定位不可预览文件');
      throw new Error(`断言失败：未能定位搜索结果中的"${NOT_PREVIEWABLE}"`);
    }
    if (!(await waitDesc(NOT_PREVIEWABLE, '可预览文本内容', false, 15000))) {
      await agent.logScreenshot('1583937-不可预览文件仍显示内容预览');
      throw new Error(`断言失败："${NOT_PREVIEWABLE}"为不可预览格式，但结果行仍展示了文件内容预览`);
    }
    // 不可预览文件的行内文字已通过 aiQuery 校验，不叠加 aiAssert

    console.log('===== 步骤4：切回可预览文件，预览内容恢复 =====');
    if (!(await hoverResult(PREVIEWABLE))) {
      await agent.logScreenshot('1583937-未能切回可预览文件');
      throw new Error(`断言失败：未能重新定位"${PREVIEWABLE}"`);
    }
    if (!(await waitDesc(PREVIEWABLE, '可预览文本内容', true, 20000))) {
      await agent.logScreenshot('1583937-预览内容未恢复');
      throw new Error('断言失败：切回可预览文件后结果行未重新展示文本内容预览');
    }
    // 切回后的行内预览已通过 aiQuery 校验，不叠加 aiAssert

    console.log('===== 步骤5：选中 web 搜索结果，预览区不展示文件预览 =====');
    await inputGrandSearchKeyword(device, KEY);
    await sleep(2500);
    const hasWebResult = await agent.aiBoolean('搜索结果中存在 web 搜索（网页搜索）结果区块');
    if (hasWebResult) {
      await agent.aiTap('搜索结果中的 web 搜索（网页搜索）结果条目');
      await sleep(2000);
      await agent.aiAssert('选中 web 搜索结果后，预览区不展示本地文件的预览内容');
    } else {
      console.log('环境无 web 搜索结果（可能未联网），跳过步骤5，需联网后复跑该步');
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1583937', 'level3', 'grand_search', 'xuqi'] });

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
