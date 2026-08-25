/**
 * 用例 PMSID: 1696223
 * 用例标题: 【控制中心】【电源管理】【使用电池】低电量管理中设置项低电量时取值范围检查
 * 生成时间: 2026-04-27
 * 用例编写人: UT001924（李鹤）
 */

describe('1696223-【控制中心】【电源管理】【使用电池】低电量管理中设置项低电量时取值范围检查', () => {;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1696223-【控制中心】【电源管理】【使用电池】低电量管理中设置项低电量时取值范围检查', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心-电源管理-使用电池
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiTap("电源管理");
    await agent.aiTap("使用电池");
    await agent.aiWaitFor("电池管理文字可见");

    // 步骤2: 点击低电量时设置项下拉菜单，检查是否展示自动休眠、自动待机
    await agent.aiTap("低电量时设置项的下拉菜单，在右边，有下箭头标识", { deepThink: true });
    await agent.aiWaitFor("下拉菜单展开");
    await agent.aiAssert("下拉菜单展示自动休眠、自动待机");
    // 收起下拉框
    await agent.aiTap("低电量时");

    // 步骤3: 点击低电量阈值下拉菜单，检查是否展示1%-9%
    await agent.aiTap("低电量阈值设置项的下拉菜单，在右边，有下箭头标识", { deepThink: true });
    await agent.aiWaitFor("下拉菜单展开");
    await agent.aiAssert("下拉菜单展示1%、2%、3%、4%、5%、6%、7%、8%、9%");
  }, { timeout: 600000, tags: ['1696223', 'level3', 'laptop'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});