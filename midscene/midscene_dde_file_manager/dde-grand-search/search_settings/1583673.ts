/**
 * 用例 PMSID: 1583673
 * 用例标题: 【搜索设置】个性化-最佳匹配开关
 * 前置条件：最佳匹配为默认状态（本用例 beforeAll 删除配置键恢复默认）
 * 操作步骤：打开设置-个性化 → 查看最佳匹配默认状态 → 连续切换开关
 * 预期结果：最佳匹配默认开启；反复切换开关状态正确变化、无异常
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');

describe('1583673-【搜索设置】个性化-最佳匹配开关', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境并把最佳匹配恢复为默认状态');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBestMatch } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    await closeGrandSearchSettings(system);
    await resetGrandSearchBestMatch(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583673-【搜索设置】个性化-最佳匹配开关',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        isGrandSearchSettingsOpen,
        revealGrandSearchPersonalization,
        toggleGrandSearchBestMatch,
        getGrandSearchBestMatchSetting,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：打开设置并滚动到"个性化"区域 =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchPersonalization(system);
      // 滚到个性化区域底部后"个性化"分组标题可能已滚出可视区，按实际可见的设置项断言
      await agent.aiAssert('设置页面中显示"拖尾设置""最佳匹配""默认搜索引擎""搜索体验计划"等设置项，页面显示正常');

      console.log('===== 步骤2：最佳匹配默认开启 =====');
      const initConf = await getGrandSearchBestMatchSetting(system);
      console.log(`配置中 custom.bestMatch = ${String(initConf)}（null 表示使用默认值）`);
      if (initConf === false) {
        await agent.logScreenshot('1583673-最佳匹配默认关闭');
        throw new Error('断言失败：最佳匹配默认应为开启状态，实际配置为 false');
      }
      await agent.aiAssert('"最佳匹配"右侧开关处于开启（高亮）状态');
      await agent.logScreenshot('1583673-最佳匹配默认开启');

      console.log('===== 步骤3：连续切换开关 6 次，每次校验状态与落盘值 =====');
      let expected = false;
      for (let i = 1; i <= 6; i++) {
        await toggleGrandSearchBestMatch(system);
        const conf = await getGrandSearchBestMatchSetting(system);
        console.log(`第${i}次切换后 custom.bestMatch = ${String(conf)}（预期 ${expected}）`);
        if (conf !== expected) {
          await agent.logScreenshot(`1583673-第${i}次切换状态异常`);
          throw new Error(`断言失败：第${i}次切换后最佳匹配状态应为 ${expected}，实际 ${String(conf)}`);
        }
        if (!(await isGrandSearchSettingsOpen(system))) {
          throw new Error(`断言失败：第${i}次切换后设置页面异常关闭`);
        }
        expected = !expected;
      }
      await agent.aiAssert('连续切换后"最佳匹配"开关仍处于开启（高亮）状态，设置页面显示正常');

      console.log('===== 步骤4：再次切换一次并检查无异常 =====');
      await toggleGrandSearchBestMatch(system);
      const finalConf = await getGrandSearchBestMatchSetting(system);
      console.log(`额外切换后 custom.bestMatch = ${String(finalConf)}（预期 false）`);
      if (finalConf !== false) {
        throw new Error('断言失败：额外切换后最佳匹配状态未变为关闭');
      }
      await agent.aiAssert('"最佳匹配"开关已切换为关闭（灰色）状态，设置页面无卡死或异常');
      await toggleGrandSearchBestMatch(system);
      if ((await getGrandSearchBestMatchSetting(system)) !== true) {
        throw new Error('断言失败：关闭后再次点击未能恢复为开启状态');
      }
      console.log('关闭后再次点击已恢复开启，开关切换正常');

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583673', 'level3', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭设置面板');
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
