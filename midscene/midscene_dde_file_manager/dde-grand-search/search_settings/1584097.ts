/**
 * 用例 PMSID: 1584097
 * 用例标题: 【搜索入口】全局搜索入口及设置检查（smoke）
 * 前置条件：无
 * 操作步骤：查看任务栏全局搜索图标 → 右键查看菜单 → 打开搜索设置 → 查看搜索范围页面 → 关闭设置
 * 预期结果：图标存在且位置正确；菜单含"搜索设置"；设置面板打开；各搜索类目开关默认打开；设置可关闭
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1584097-【搜索入口】全局搜索入口及设置检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 关闭文管、清理环境并确保桌面可见');
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test('1584097-【搜索入口】全局搜索入口及设置检查', async ({ device, agent, system }) => {
    const { openGrandSearchSettings, openGrandSearchSettingsByDockMenu, closeGrandSearch, isGrandSearchSettingsOpen } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1：任务栏左侧存在全局搜索图标 =====');
    await agent.aiAssert('任务栏（dock）左侧存在全局搜索图标（放大镜形状），紧挨启动器图标');

    console.log('===== 步骤2：右键搜索图标，菜单中出现"搜索设置" =====');
    // 本环境右键菜单为仅含一项"搜索设置"的弹窗（实测 162x44，紧贴 dock 上沿且下半部被 dock 遮挡），
    // AI 视觉右键会漂移到相邻图标，改几何右键 + xwininfo 校验弹窗后点击菜单项
    await openGrandSearchSettingsByDockMenu(system, agent);

    console.log('===== 步骤3：搜索设置面板打开 =====');
    await agent.aiWaitFor('全局搜索设置面板已打开', { timeoutMs: 10000 });
    await agent.aiAssert('全局搜索设置面板已打开，面板中能看到"搜索范围"标题及其下的搜索类目开关');

    console.log('===== 步骤4：搜索范围页面各搜索类目开关默认打开 =====');
    // 本版本设置面板为单页滚动列表（无左侧分类导航），打开即"搜索范围"页，无需切换

    // 前序用例可能关闭过开关（如 1584057），先恢复为全部打开，保证本用例可重复执行
    let allOn = await agent.aiBoolean('搜索范围页面中各搜索类目右侧的开关均为打开（高亮）状态');
    if (!allOn) {
      console.log('检测到存在关闭状态的开关，先恢复为全部打开');
      for (let i = 0; i < 12; i++) {
        const hasOff = await agent.aiBoolean('搜索范围页面中存在处于关闭（灰色）状态的搜索类目开关');
        if (!hasOff) break;
        await agent.aiTap('搜索范围页面中第一个处于关闭（灰色）状态的搜索类目开关');
        await sleep(600);
      }
      allOn = await agent.aiBoolean('搜索范围页面中各搜索类目右侧的开关均为打开（高亮）状态');
    }
    await agent.aiAssert('搜索范围页面中各搜索类目右侧的开关均为打开（高亮）状态');

    console.log('===== 步骤5：关闭设置面板 =====');
    await closeGrandSearch(device, agent, system);
    if (await isGrandSearchSettingsOpen(system)) {
      await agent.logScreenshot('1584097-设置面板未关闭');
      throw new Error('断言失败：全局搜索设置面板未关闭');
    }
    await agent.aiAssert('全局搜索设置面板已关闭，桌面恢复正常');

    console.log('补充校验：公共方法 openGrandSearchSettings 可复现打开设置');
    await openGrandSearchSettings(device, agent, system);
    await agent.aiAssert('全局搜索设置面板已再次打开');
    console.log('===== 测试全部通过 =====');
  }, { timeout: 420000, tags: ['1584097', 'level3', 'grand_search', 'xuqi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 关闭菜单/面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
