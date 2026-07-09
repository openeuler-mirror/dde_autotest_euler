
/**
 * 用例 PMSID: 1950557
 * 用例标题: 【控制中心】【系统】【时间和日期】系统时区检查
 * 生成时间: 2026-01-21 11:24:20
 * 用例编写人: UT003072
 */

describe('1950557-【控制中心】【系统】【时间和日期】系统时区检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1950557-【控制中心】【系统】【时间和日期】系统时区检查', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("时间和日期");
    // 步骤 2: 点击时间和日期
    await agent.aiTap("时间和日期");
    await agent.aiWaitFor("时间和日期设置页面已加载");
    await agent.aiAssert("导航栏显示：系统 / 时间和日期");
    //验证系统时区显示为北京
    await agent.aiAssert("系统时区显示为北京");
  }, { timeout: 1200000, tags: ['1950557', 'level3'] });

  afterEach(async ({ device,uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤 : 恢复窗口
    await device.pressKey("Super", "Down")
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
