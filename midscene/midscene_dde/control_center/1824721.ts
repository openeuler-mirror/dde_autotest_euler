
/**
 * 用例 PMSID: 1824721
 * 用例标题: 【控制中心】【系统】【语言和区域】区域格式为简体中文时，检查货币符号取值范围
 * 生成时间: 2026-04-14 15:24:30
 * 用例编写人: UT002485(卢燕)
 */

describe('1824721-【控制中心】【系统】【语言和区域】区域格式为简体中文时，检查货币符号取值范围', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824721-【控制中心】【系统】【语言和区域】区域格式为简体中文时，检查货币符号取值范围', async ({ device, agent, uos }) => {
    // 进入控制中心->语言和区域
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiWaitFor("语言和区域");
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式右侧显示中文(中国)",{ deepThink: true });    

    //检查货币符号取值范围：￥,$,€
    await agent.aiTap("'货币符号'区域的ˇ符号");
    await agent.aiAssert("货币符号支持：￥,$,€");
  }, { timeout: 600000, tags: ['1824721', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
