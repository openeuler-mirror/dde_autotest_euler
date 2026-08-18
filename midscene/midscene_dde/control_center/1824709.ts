
/**
 * 用例 PMSID: 1824709
 * 用例标题: 【控制中心】【系统】【语言和区域】区域格式为简体中文时，检查货币符号默认值显示
 * 生成时间: 2026-04-14 15:24:49
 * 用例编写人: UT002485(卢燕)
 */

describe('1824709-【控制中心】【系统】【语言和区域】区域格式为简体中文时，检查货币符号默认值显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824709-【控制中心】【系统】【语言和区域】区域格式为简体中文时，检查货币符号默认值显示', async ({ device, agent, uos }) => {
  // 进入控制中心->语言和区域
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiWaitFor("语言和区域");
    await agent.aiTap("语言和区域");

    //检查检查货币符号默认值为￥
    await agent.aiAssert("货币符号右侧显示￥");
  }, { timeout: 600000, tags: ['1824709', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
