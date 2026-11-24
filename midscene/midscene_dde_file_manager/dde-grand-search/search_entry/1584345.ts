/**
 * 用例 PMSID: 1584345
 * 用例标题: 【搜索入口】右键任务栏全局搜索图标可唤起搜索设置
 * 前置条件：无
 * 操作步骤：鼠标右键点击任务栏上的全局搜索图标 → 点击"搜索设置"
 * 预期结果：唤起全局搜索设置面板
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1584345-【搜索入口】右键任务栏全局搜索图标可唤起搜索设置', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 关闭文管并清理桌面环境');
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 任务栏（dock）需可见才能右键图标
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 无额外前置，确保焦点在桌面');
    await device.pressKey('Escape');
  });

  test('1584345-【搜索入口】右键任务栏全局搜索图标可唤起搜索设置', async ({ device, agent, system }) => {
    const { openGrandSearchSettings, openGrandSearchSettingsByDockMenu, closeGrandSearch, isGrandSearchSettingsOpen } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1-2：右键任务栏全局搜索图标，点击"搜索设置"菜单项 =====');
    // 本环境右键菜单是仅含一项"搜索设置"的弹窗（实测窗口 162x44，紧贴 dock 上沿），
    // AI 视觉右键会漂移到相邻的设置图标，故改为几何右键 + xwininfo 校验弹窗 + 点击菜单项
    await openGrandSearchSettingsByDockMenu(system, agent);
    await agent.aiWaitFor('全局搜索设置面板已打开', { timeoutMs: 10000 });
    await agent.aiAssert('已唤起全局搜索设置面板，面板中能看到"搜索范围"标题及其下的搜索类目开关');

    console.log('===== 步骤3：验证设置面板可正常关闭 =====');
    await closeGrandSearch(device, agent, system);
    if (await isGrandSearchSettingsOpen(system)) {
      await agent.logScreenshot('1584345-设置面板未关闭');
      throw new Error('断言失败：全局搜索设置面板未关闭');
    }
    await agent.aiAssert('全局搜索设置面板已关闭，回到桌面');

    // openGrandSearchSettings 为公共封装（命令入口优先，失败回落右键菜单），供其余设置类用例复用
    console.log('补充校验：公共方法 openGrandSearchSettings 可正常打开设置面板');
    await openGrandSearchSettings(device, agent, system);
    await agent.aiAssert('全局搜索设置面板已打开');
    console.log('===== 测试全部通过 =====');
  }, { timeout: 300000, tags: ['1584345', 'level3', 'grand_search', 'xuqi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 关闭可能残留的菜单/面板');
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
