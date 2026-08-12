/**
 * 用例 PMSID: 1804839
 * 用例标题: 【文件管理器】设置页面开启普通删除提示选项检查
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1804839-设置页面开启普通删除提示选项检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804839-设置页面开启普通删除提示选项检查', async ({ device, agent, uos }) => {
    const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiAssert("打开了文件管理器");
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiTap("点击设置");
    await agent.aiScroll('弹出的设置对话框', { direction: 'down', distance: 60 });
    await agent.aiAssert("对话框栏目内展示了开启普通删除提示");
    await agent.aiAssert("开启普通删除提示选项未勾选");
    await agent.aiTap("开启普通删除提示");
    await agent.aiAssert("开启普通删除提示选项已勾选");
    await closeAllWindows(device, agent);

    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiTap("点击设置");
    await agent.aiScroll('弹出的设置对话框', { direction: 'down', distance: 60 });
    await agent.aiAssert("开启普通删除提示选项已勾选");
    await closeAllWindows(device, agent);

  }, { timeout: 1200000, tags: ["1804839", 'level2', 'smoke', 'xuqi'] });

  afterEach(async ({ device, uos, agnet }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiTap("点击设置");
    await agent.aiScroll('弹出的设置对话框', { direction: 'down', distance: 60 });
    await agent.aiTap("恢复默认");
    await closeAllWindows(device, agent);
  });
});