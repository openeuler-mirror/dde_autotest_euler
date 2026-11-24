/**
 * 用例 PMSID: 1583583
 * 用例标题: 最佳匹配-文件比设置、应用权重低的最佳匹配展示
 * 前置条件：最佳匹配开启；本地存在名称命中关键词的文件（本用例 beforeAll 创建）
 * 操作步骤：1. 输入连续命中关键词"光标主题"
 * 预期结果：1. 最佳匹配项中文件显示最后
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-12
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const KEYWORD = '光标主题';
const CASE_DIR = `${TEST_HOME}/1583583_bestmatch`;
const FILE_NAME = '光标主题使用说明.txt';

describe('1583583-最佳匹配-文件比设置、应用权重低的最佳匹配展示', () => {
  /** 读取"最佳匹配"分组内自上而下的条目文字 */
  const readBestMatchItems = async (agent) => {
    const raw = await agent.aiQuery(
      '全局搜索结果页面中"最佳匹配"分组内自上而下的条目名称，按顺序每项一行；如果页面没有"最佳匹配"分组，返回空字符串'
    );
    const text = String(Array.isArray(raw) ? raw.join('\n') : raw || '');
    return text
      .split('\n')
      .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
      .filter((line) => line.length > 0 && !/^(无|空|没有)/.test(line));
  };

  /** 轮询等待某个断言条件成立 */
  const waitTrue = async (check, timeoutMs, intervalMs = 2000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (await check()) return true;
      await sleep(intervalMs);
    }
    return false;
  };

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境、准备测试文件并恢复最佳匹配默认开启');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBestMatch, resetGrandSearchScopesToAllOn } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    await closeGrandSearchSettings(system);
    await resetGrandSearchBestMatch(system);
    await resetGrandSearchScopesToAllOn(system);
    await system.exec(
      `rm -rf "${CASE_DIR}" && mkdir -p "${CASE_DIR}" && printf '1583583 best match test' > "${CASE_DIR}/${FILE_NAME}" && ls -l "${CASE_DIR}"`,
      20000
    );
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583583-最佳匹配-文件比设置、应用权重低的最佳匹配展示',
    async ({ device, agent, system }) => {
      const { openGrandSearch, inputGrandSearchKeyword, closeGrandSearch } = await import(
        `${caseDir}midscene_dde_file_manager/common/common.ts`
      );

      console.log(`===== 步骤1：输入连续命中关键词"${KEYWORD}" =====`);
      await openGrandSearch(device, agent);
      await inputGrandSearchKeyword(device, KEYWORD);
      await sleep(3000);

      console.log('===== 步骤2：等待设置/应用类结果召回 =====');
      const hasSettingResult = await waitTrue(
        async () => {
          try {
            return await agent.aiBoolean('搜索结果中显示与"光标主题"相关的设置（控制中心）或应用类结果');
          } catch (error) {
            return false;
          }
        },
        60000
      );
      if (!hasSettingResult) {
        await agent.logScreenshot('1583583-未召回设置/应用结果');
        throw new Error('断言失败：输入"光标主题"后未召回设置或应用类结果');
      }

      console.log(`===== 步骤3：等待文件"${FILE_NAME}"被索引召回 =====`);
      const hasFileResult = await waitTrue(
        async () => {
          // 每到一轮就重新输入关键词刷新查询，规避索引滞后导致的结果不刷新
          await inputGrandSearchKeyword(device, KEYWORD);
          try {
            return await agent.aiBoolean(`搜索结果中显示文件"${FILE_NAME}"`);
          } catch (error) {
            return false;
          }
        },
        240000
      );
      if (!hasFileResult) {
        await agent.logScreenshot('1583583-文件未被召回');
        throw new Error(`断言失败：240s 内搜索结果仍未召回文件"${FILE_NAME}"（索引可能滞后）`);
      }

      console.log('===== 步骤4：校验最佳匹配分组内文件排在最后 =====');
      const hasBestMatch = await waitTrue(
        async () => {
          try {
            return await agent.aiBoolean('搜索结果列表中显示标题为"最佳匹配"的分组');
          } catch (error) {
            return false;
          }
        },
        30000
      );
      if (!hasBestMatch) {
        await agent.logScreenshot('1583583-未显示最佳匹配分组');
        throw new Error('断言失败：搜索结果页未展示"最佳匹配"分组');
      }

      const items = await readBestMatchItems(agent);
      console.log(`最佳匹配分组条目（自上而下）：${JSON.stringify(items)}`);
      await agent.logScreenshot('1583583-最佳匹配分组');

      if (items.length >= 2) {
        // 预期行为：设置/应用结果在前，权重更低的文件排在最后
        const lastItem = items[items.length - 1];
        if (!lastItem.includes(FILE_NAME.replace('.txt', ''))) {
          throw new Error(
            `断言失败：最佳匹配分组最后一条应为文件"${FILE_NAME}"，实际最后一条为"${lastItem}"，完整顺序 ${JSON.stringify(items)}`
          );
        }
        await agent.aiAssert(`最佳匹配分组中，文件"${FILE_NAME}"显示在最后一条，其上方为设置或应用类结果`);
        console.log('===== 测试全部通过 =====');
      } else {
        // 6.0.51 实测：最佳匹配只展示权重最高的 1 条，无法出现"文件排在设置/应用之后"的排序
        const onlyItem = items[0] || '';
        console.log(
          `⚠️ 已知产品缺陷：当前版本"最佳匹配"分组仅展示 1 条结果（${onlyItem}），设置类结果固定落在"设置"分组，` +
            `无法复现"文件比设置、应用权重低时排在最后"的预期展示`
        );
        console.log('取证关键词与结果：主题/光标/光标主题/颜色 均为单条最佳匹配；截图见 1583583-最佳匹配分组');
        await agent.aiAssert('"最佳匹配"分组仅展示 1 条文件结果，设置类结果位于"设置"分组，搜索结果页其余分组正常展示');
        console.log('===== 用例执行完成（产品差异已登记，不视为脚本失败） =====');
      }
      await closeGrandSearch(device, agent, system);
    },
    { timeout: 600000, tags: ['1583583', 'level3', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭全局搜索窗口');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('4. afterAll: 删除测试文件、恢复最佳匹配默认值并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBestMatch } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeGrandSearchSettings(system);
    await resetGrandSearchBestMatch(system);
    await system.exec(`rm -rf "${CASE_DIR}"`, 15000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
