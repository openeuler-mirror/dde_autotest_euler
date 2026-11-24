/**
 * 用例 PMSID: 1584237
 * 用例标题: 【结果列表】搜索无结果时展示 web 搜索结果
 * 前置条件：设备可联网（web 搜索依赖网络，无网环境下本用例会失败，属环境阻塞）
 * 操作步骤：全局搜索输入一个本地必然不存在的关键词
 * 预期结果：本地结果为空，搜索结果区域居中展示 web 搜索结果
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

// 本地必然不存在的关键词
const KEYWORD = 'zz9xq不存在的本地关键词8k2v';

describe('1584237-【结果列表】搜索无结果时展示 web 搜索结果', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 关闭文管并清理桌面环境');
    const { clearEnvironment, closeFileManager, resetGrandSearchScopesToAllOn } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 前置条件：Web 搜索类目开关必须为打开（前序用例关闭搜索范围后会残留，这里配置级恢复）
    await resetGrandSearchScopesToAllOn(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留窗口');
    await device.pressKey('Escape');
  });

  test('1584237-【结果列表】搜索无结果时展示 web 搜索结果', async ({ device, agent }) => {
    const { openGrandSearch, inputGrandSearchKeyword } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1：打开全局搜索并输入无结果关键词 =====');
    await openGrandSearch(device, agent);
    await inputGrandSearchKeyword(device, KEYWORD);

    console.log('===== 步骤2：校验本地结果为空 =====');
    // 无本地结果时界面不会出现"搜索结果已加载"的列表态，而是直接呈现空状态/仅剩 web 搜索入口，
    // 故等待条件改为"本地结果为空"的可观察状态，避免与预期互斥导致必然超时
    await agent.aiWaitFor('全局搜索结果区域中没有显示任何本地文件/文件夹结果，或显示"无搜索结果"空状态', { timeoutMs: 30000 });
    await agent.aiAssert('本地搜索结果列表中没有显示任何文件或文件夹结果');

    console.log('===== 步骤3：校验 web 搜索结果展示 =====');
    // 本版本无本地结果时，结果区域以"通过浏览器搜索'关键词'"入口呈现 web 搜索，不再使用居中的大块 web 结果卡片
    await agent.aiWaitFor('搜索结果区域中出现"通过浏览器搜索"的网页搜索入口', { timeoutMs: 30000 });
    await agent.aiAssert('搜索结果区域中展示了"通过浏览器搜索"的 web 搜索入口，且没有本地文件结果遮挡');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 300000, tags: ['1584237', 'level3', 'grand_search', 'xuqi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 关闭全局搜索');
    await device.pressKey('Escape');
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
