/**
 * 用例 PMSID: 1584057
 * 用例标题: 【搜索设置】关闭搜索范围下每个开关
 * 前置条件：搜索设置中所有搜索类目开关均为打开状态（本用例 beforeAll 自动恢复）
 * 操作步骤：打开全局搜索设置 → 进入搜索范围页面 → 逐个关闭每个类目开关
 * 预期结果：每次点击后对应开关变为关闭（灰色）状态；全部开关关闭后无类目可继续关闭
 * 生成时间: 2026-11-11
 * 2026-11-12 优化：类目清单/开关状态改为配置级读取，beforeAll/afterAll 恢复改为配置级（改 conf + 重启 daemon），
 *                  原实现每步多次模型调用且 afterAll 恢复超过 180s 上限，导致超时并残留开关关闭态
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 配置键 → 设置面板中显示的类目名称（用于按名称定位开关行） */
const NAME_BY_KEY = {
  files: '文件',
  folder: '文件夹',
  'files.document': '文档',
  application: '应用',
  'dde-control-center-setting': '设置',
  'files.video': '视频',
  'files.audio': '音乐',
  'files.picture': '图片',
  web: 'Web搜索',
};

describe('1584057-【搜索设置】关闭搜索范围下每个开关', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 清理环境，并把搜索范围开关恢复为全部打开');
    const { clearEnvironment, closeFileManager, openGrandSearchSettings, closeGrandSearch, resetGrandSearchScopesToAllOn } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await resetGrandSearchScopesToAllOn(system);
    await uos.showDesktop();
    await device.pressKey('Escape');

    // 前置条件：开关全部打开（配置已在 beforeAll 恢复，这里仅确认面板可正常打开）
    await openGrandSearchSettings(device, agent, system);
    await agent.aiWaitFor('全局搜索设置面板已打开，能看到"搜索范围"标题及其下的搜索类目开关', { timeoutMs: 10000 });
    await closeGrandSearch(device, agent, system);
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test('1584057-【搜索设置】关闭搜索范围下每个开关', async ({ device, agent, system }) => {
    const { openGrandSearchSettings, getGrandSearchScopeStates } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1：打开搜索设置并进入搜索范围页面 =====');
    // 本版本设置面板为单页滚动列表（无左侧分类导航），打开即"搜索范围"页
    await openGrandSearchSettings(device, agent, system);
    await agent.aiWaitFor('全局搜索设置面板已打开，能看到"搜索范围"标题及其下的搜索类目开关', { timeoutMs: 10000 });
    await agent.aiAssert('搜索范围页面显示多个搜索类目，且每个类目右侧均有开关，开关初始为打开状态（滑块位于轨道右侧、轨道为蓝色）');

    console.log('===== 步骤2：逐个关闭搜索范围下的每个开关 =====');
    let turnedOff = 0;
    for (let i = 0; i < 12; i++) {
      const states = await getGrandSearchScopeStates(system);
      const onKeys = Object.keys(states).filter((k) => states[k]);
      if (onKeys.length === 0) break;
      const key = onKeys[0];
      const name = NAME_BY_KEY[key];
      console.log(`操作步骤: 关闭类目"${name || key}"的开关（配置键 ${key}）`);

      let off = false;
      for (let attempt = 0; attempt < 3 && !off; attempt++) {
        if (name) {
          await agent.aiTap(`搜索范围页面中"${name}"类目这一行最右端的开关控件（开关滑块位于轨道右侧、轨道为蓝色）`);
        } else {
          await agent.aiTap('搜索范围页面中第一个处于打开状态的搜索类目开关（滑块在轨道右侧、轨道为蓝色）');
        }
        await sleep(900);
        const now = await getGrandSearchScopeStates(system);
        off = now[key] === false;
      }
      if (!off) {
        await agent.logScreenshot(`1584057-${key}-未关闭`);
        throw new Error(`断言失败：类目"${name || key}"开关点击 3 次后配置仍为打开状态`);
      }
      turnedOff++;
      console.log(`类目"${name || key}"开关已关闭（配置校验通过）`);
    }
    console.log(`共关闭 ${turnedOff} 个搜索类目开关`);

    console.log('===== 步骤3：全部开关关闭后的状态校验 =====');
    const finalStates = await getGrandSearchScopeStates(system);
    const stillOn = Object.keys(finalStates).filter((k) => finalStates[k]);
    if (stillOn.length > 0) {
      await agent.logScreenshot('1584057-搜索范围开关未全部关闭');
      throw new Error(`断言失败：以下类目开关仍为打开状态：${stillOn.join(',')}`);
    }
    await agent.aiAssert('搜索范围页面中所有搜索类目开关均为关闭状态（滑块均位于轨道左侧、轨道为灰色、不带蓝色），不存在仍处于打开状态的开关');
    await agent.logScreenshot('1584057-全部开关已关闭');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 900000, tags: ['1584057', 'level3', 'grand_search', 'xuqi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 关闭设置面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 恢复搜索范围开关为全部打开，并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearch, resetGrandSearchScopesToAllOn } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
    await resetGrandSearchScopesToAllOn(system);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
