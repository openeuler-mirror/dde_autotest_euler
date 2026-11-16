/**
 * 用例 PMSID: 1801627
 * 用例标题: 【通知中心】点击通知中心标题栏[设置]下拉菜单中的'通知设置'，能正常进入控制中心-通知页面
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801627-【通知中心】点击通知中心标题栏[设置]下拉菜单中的通知设置，能正常进入控制中心-通知页面', () => {

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

  test('1801627-点击通知中心标题栏设置下拉菜单中的通知设置能正常进入控制中心通知页面', async ({ device, agent, uos }) => {
    // 步骤1: 控制中心关闭状态，点击列表的'通知设置'
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiTap("通知中心标题栏右侧的更多按钮(三点图标)", { deepThink: true });
    await agent.aiWaitFor("'通知设置'选项已显示");
    await agent.aiTap("'通知设置'选项");
    // 检查1: 进入控制中心通知页面，通知中心关闭
    await agent.aiWaitFor("系统设置页面已打开");
    await agent.aiAssert("系统设置页面显示通知设置相关内容");
    await agent.aiAssert("通知中心面板不可见");

    // 步骤2: 控制中心打开状态，当前模块不是应用通知模块，点击列表的'通知设置'
    // 先切换到控制中心的其他模块（如网络设置）
    await agent.aiTap("系统设置项下面的'网络'模块", { deepThink: true });
    await agent.aiWaitFor("网络设置页面已展示");
    await agent.aiAssert("当前页面不是通知设置页面");
    // 再次打开通知中心，点击'通知设置'
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiTap("通知中心标题栏右侧的更多按钮(三点图标)", { deepThink: true });
    await agent.aiWaitFor("'通知设置'选项已显示");
    await agent.aiTap("'通知设置'选项");
    // 检查2: 进入控制中心通知页面，通知中心关闭
    await agent.aiWaitFor("系统设置页面显示通知设置相关内容");
    await agent.aiAssert("系统设置页面显示通知设置相关内容");
    await agent.aiAssert("通知中心面板不可见");
  }, { timeout: 1200000, tags: ['1801627', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭控制中心窗口
    try {
      await device.pressKey("alt", "F4");
    } catch (e) { console.log('close window skipped'); }
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
