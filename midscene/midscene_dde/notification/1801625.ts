/**
 * 用例 PMSID: 1801625
 * 用例标题: 【通知中心】通知中心长驻区域，标题栏的[设置]按钮功能正常
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801625-【通知中心】通知中心长驻区域，标题栏的[设置]按钮功能正常', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801625-【通知中心】通知中心长驻区域，标题栏的[设置]按钮功能正常', async ({ device, agent, uos }) => {
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 点击标题栏的[设置]按钮（更多/三点图标按钮）
    await agent.aiTap("通知中心标题栏右侧的更多按钮(三点图标)", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查: 展示设置菜单列表，列表展示'通知设置'
    const hasMenu = await agent.aiBoolean("'通知设置'选项已显示", { deepThink: true });
    if (!hasMenu) {
      throw new Error('点击设置按钮后应展示包含"通知设置"的下拉菜单');
    }
  }, { timeout: 1200000, tags: ['1801625', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("Escape");
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
