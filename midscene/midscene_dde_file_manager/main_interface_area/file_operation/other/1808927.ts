/**
 * 用例 PMSID: 1808927
 * 用例标题: 【文管图标增加tips提示】检查文管title栏图标的tips提示
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

describe('1808927-【文管图标增加tips提示】检查文管title栏图标的tips提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808927-【文管图标增加tips提示】检查文管title栏图标的tips提示', async ({ device, agent, uos, system }) => {
    console.log('步骤1：启动器-文件管理器，最大化窗口，点击左侧栏的"文档"');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤2：将鼠标悬停在文件管理器页面上方的title的"<"，断言有"后退"的提示信息');
    await agent.aiHover('文件管理器页面上方title的"<"左箭头', { deepThink: true });
    await agent.aiAssert('显示"后退"的提示信息');
    console.log('断言通过：后退按钮tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤3：将鼠标悬停在文件管理器页面上方的title的">"，断言有"前进"的提示信息');
    await agent.aiHover('文件管理器页面上方title的">"右箭头', { deepThink: true });
    await agent.aiAssert('显示"前进"的提示信息');
    console.log('断言通过：前进按钮tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤4：将鼠标悬停在文件管理器页面上方的搜索框上，断言有搜索的提示信息');
    await agent.aiHover('文件管理器页面上方的搜索框', { deepThink: true });
    await agent.aiAssert('显示"搜索"的提示信息');
    console.log('断言通过：搜索框tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤5：点击搜索，将鼠标悬停在搜索框右侧的第一个图标上，有高级搜索的提示信息');
    await agent.aiTap('文件管理器页面上方的搜索框');
    await agent.aiHover('搜索框右侧第一个图标', { deepThink: true });
    await agent.aiAssert('显示"高级搜索"的提示信息');
    console.log('断言通过：高级搜索图标tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤6：将鼠标悬停在搜索框左侧第二个图标上，有"视图选项"的提示信息');
    await agent.aiHover('文件管理器页面上方的工具栏从左到右数，第一个图标（四格图标）', { deepThink: true });
    await agent.aiAssert('显示"图标视图"的提示信息');
    console.log('断言通过：图标视图图标tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤7：将鼠标悬停在搜索框左侧第三个图标上，有"树形视图"的提示信息');
    await agent.aiHover('文件管理器页面上方的工具栏从左到右数，第二个图标（三横线带三个点的列表图标）', { deepThink: true });
    await agent.aiAssert('显示"列表视图"的提示信息');
    console.log('断言通过：列表视图图标tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤8：将鼠标悬停在搜索框左侧第二个图标上，有"列表视图"的提示信息');
    await agent.aiHover('文件管理器页面上方的工具栏从左到右数，第三个图标（编辑的列表图标）', { deepThink: true });
    await agent.aiAssert('显示"树形视图"的提示信息');
    console.log('断言通过：树形视图图标tips显示正常');
    await agent.aiTap('文件管理器文档区域中间空白处', { deepThink: true });
    await system.exec('sleep 1');

    console.log('步骤9：将鼠标悬停在搜索框左侧第二个图标上，有"图标选项"的提示信息');
    await agent.aiHover('文件管理器页面上方的工具栏从左到右数，第四个图标（对话框的列表图标）', { deepThink: true });
    await agent.aiAssert('显示"视图选项"的提示信息');
    console.log('断言通过：视图选项图标tips显示正常');

    console.log('测试完成');
  }, { timeout: 1200000, tags: ['1808927', 'level2', 'tips', 'titlebar', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
