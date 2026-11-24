/**
 * 用例 PMSID: 1584145
 * 用例标题: 【关键词匹配】搜索范围不支持路径
 * 前置条件：无
 * 操作步骤：全局搜索分别输入 recent:///-、trash:///-、/etc/apt
 * 预期结果：三种路径语法均不生效，搜索结果中不展示对应目录下的文件
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 路径型关键词与对应目录：全局搜索不支持路径语法，预期不会展示该目录下的文件
// token 用于校验结果是否只是普通关键词命中（名称/摘要包含 token），而不是该来源目录的全量文件列表
const PATH_CASES = [
  { keyword: 'recent:///-', sourceDesc: '最近使用（recent://）', token: 'recent' },
  { keyword: 'trash:///-', sourceDesc: '回收站（trash://）', token: 'trash' },
  { keyword: '/etc/apt', sourceDesc: '/etc/apt', token: 'apt' },
];

describe('1584145-【关键词匹配】搜索范围不支持路径', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 关闭文管并清理桌面环境');
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留窗口');
    await device.pressKey('Escape');
  });

  test('1584145-【关键词匹配】搜索范围不支持路径', async ({ device, agent }) => {
    const { openGrandSearch, inputGrandSearchKeyword } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1：打开全局搜索 =====');
    await openGrandSearch(device, agent);

    for (const { keyword, sourceDesc, token } of PATH_CASES) {
      console.log(`===== 步骤2：输入路径型关键词"${keyword}" =====`);
      await inputGrandSearchKeyword(device, keyword);
      // 等结果区稳定（无结果时展示空态或仅 web 结果）
      await sleep(3000);
      const names = await agent.aiQuery('搜索结果中显示的文件名称列表，没有结果时返回空数组');
      console.log(`"${keyword}" 的本地结果: ${JSON.stringify(names)}`);
      // 用例预期是"不展示对应目录下的文件"；路径语法被当作普通关键词时可能有无关命中，
      // 因此按"结果来源"校验，而不是武断要求完全没有本地结果
      await agent.aiAssert(`输入"${keyword}"后，搜索结果中不存在${sourceDesc}目录下的文件清单：要么显示"无搜索结果"，要么只显示名称或摘要中包含"${token}"的普通关键词命中文件`);
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 300000, tags: ['1584145', 'level3', 'grand_search', 'xuqi'] });

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
