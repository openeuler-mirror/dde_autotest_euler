/**
 * 用例 PMSID: 1583669
 * 用例标题: 最佳匹配-打开关闭最佳匹配开关
 * 前置条件：最佳匹配为默认开启状态（本用例 beforeAll 删除配置键恢复默认）
 * 操作步骤：1. 手动关闭最佳匹配项开关检查搜索结果列表展示 2. 手动打开最佳匹配项开关检查搜索结果列表展示
 * 预期结果：1. 搜索结果页不展示最佳匹配项 2. 搜索结果页重新展示最佳匹配项
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-12
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');

// 6.0.51 实测："文件管理器"可稳定召回应用结果并触发"最佳匹配"分组
const KEYWORD = '文件管理器';

describe('1583669-最佳匹配-打开关闭最佳匹配开关', () => {
  /** 判断搜索结果页是否展示"最佳匹配"分组 */
  const hasBestMatchGroup = async (agent) => {
    try {
      return (await agent.aiBoolean('全局搜索结果列表中显示标题为"最佳匹配"的分组')) === true;
    } catch (error) {
      console.log(`判断最佳匹配分组异常（按不存在处理）: ${String(error).substring(0, 120)}`);
      return false;
    }
  };

  /** 轮询等待"最佳匹配"分组达到期望的显示状态 */
  const waitBestMatchGroup = async (agent, expectVisible, timeoutMs) => {
    const deadline = Date.now() + timeoutMs;
    let visible = false;
    while (Date.now() < deadline) {
      visible = await hasBestMatchGroup(agent);
      if (visible === expectVisible) return true;
      await sleep(1500);
    }
    console.log(`等待超时：最佳匹配分组期望${expectVisible ? '显示' : '不显示'}，实际${visible ? '显示' : '不显示'}`);
    return false;
  };

  /** 打开全局搜索并输入关键词，等待结果列表渲染 */
  const searchKeyword = async (device, agent) => {
    const { openGrandSearch, inputGrandSearchKeyword } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await openGrandSearch(device, agent);
    await inputGrandSearchKeyword(device, KEYWORD);
    await sleep(3000);
  };

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境并把最佳匹配恢复为默认开启');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBestMatch, resetGrandSearchScopesToAllOn } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    // 面板打开时守护进程会回写配置，必须先关闭面板再改配置
    await closeGrandSearchSettings(system);
    await resetGrandSearchBestMatch(system);
    // 最佳匹配分组需要应用/设置类目参与召回，确保搜索范围全部开启
    await resetGrandSearchScopesToAllOn(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583669-最佳匹配-打开关闭最佳匹配开关',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        revealGrandSearchPersonalization,
        toggleGrandSearchBestMatch,
        getGrandSearchBestMatchSetting,
        closeGrandSearchSettings,
        closeGrandSearch,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：关闭"最佳匹配"开关 =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchPersonalization(system);
      await agent.aiAssert('设置页面中显示"最佳匹配"设置项，其右侧开关处于开启（高亮）状态');
      const initConf = await getGrandSearchBestMatchSetting(system);
      console.log(`关闭前 custom.bestMatch = ${String(initConf)}（null 表示使用默认值）`);
      if (initConf === false) {
        await agent.logScreenshot('1583669-关闭前最佳匹配已为关闭');
        throw new Error('前置失败：最佳匹配默认应为开启状态，实际配置为 false');
      }
      await toggleGrandSearchBestMatch(system);
      const offConf = await getGrandSearchBestMatchSetting(system);
      console.log(`点击开关后 custom.bestMatch = ${String(offConf)}`);
      if (offConf !== false) {
        await agent.logScreenshot('1583669-关闭最佳匹配失败');
        throw new Error(`断言失败：关闭最佳匹配后配置应为 false，实际 ${String(offConf)}`);
      }
      await agent.aiAssert('"最佳匹配"右侧开关已切换为关闭（灰色）状态');

      console.log('===== 步骤2：关闭开关后搜索，结果页不展示最佳匹配项 =====');
      await closeGrandSearchSettings(system);
      await searchKeyword(device, agent);
      if (!(await waitBestMatchGroup(agent, false, 6000))) {
        await agent.logScreenshot('1583669-关闭开关后仍显示最佳匹配');
        throw new Error('断言失败：关闭最佳匹配开关后，搜索结果页仍展示最佳匹配分组');
      }
      await agent.aiAssert(`搜索结果页正常展示"${KEYWORD}"的搜索结果，且不展示最佳匹配分组`);
      await agent.logScreenshot('1583669-关闭开关后的搜索结果');
      await closeGrandSearch(device, agent, system);

      console.log('===== 步骤3：重新打开"最佳匹配"开关 =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchPersonalization(system);
      await toggleGrandSearchBestMatch(system);
      const onConf = await getGrandSearchBestMatchSetting(system);
      console.log(`再次点击开关后 custom.bestMatch = ${String(onConf)}`);
      if (onConf !== true) {
        await agent.logScreenshot('1583669-打开最佳匹配失败');
        throw new Error(`断言失败：重新打开最佳匹配后配置应为 true，实际 ${String(onConf)}`);
      }
      await agent.aiAssert('"最佳匹配"右侧开关已重新切换为开启（高亮）状态');

      console.log('===== 步骤4：打开开关后搜索，结果页重新展示最佳匹配项 =====');
      await closeGrandSearchSettings(system);
      await searchKeyword(device, agent);
      if (!(await waitBestMatchGroup(agent, true, 30000))) {
        await agent.logScreenshot('1583669-打开开关后未显示最佳匹配');
        throw new Error('断言失败：重新打开最佳匹配开关后，搜索结果页未展示最佳匹配分组');
      }
      await agent.aiAssert(`搜索结果页展示"${KEYWORD}"的最佳匹配分组及搜索结果`);
      await agent.logScreenshot('1583669-打开开关后的搜索结果');

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583669', 'level3', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭全局搜索窗口/设置面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('4. afterAll: 恢复最佳匹配默认值并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBestMatch } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeGrandSearchSettings(system);
    await resetGrandSearchBestMatch(system);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
