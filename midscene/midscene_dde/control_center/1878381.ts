
/**
 * 用例 PMSID: 1878381
 * 用例标题: 【控制中心】【系统更新】进入控制中心-更新页面，触发更新检查操作
 * 生成时间: 2025-12-17 13:21:59
 * 用例编写人: UT001924(李鹤)
 */

describe('1878381-【控制中心】【系统更新】进入控制中心-更新页面，触发更新检查操作', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878381-【控制中心】【系统更新】进入控制中心-更新页面，触发更新检查操作', async ({ device, agent, uos }) => {
    // 打开控制中心并进入系统更新页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    // 检查触发检查更新操作
    await agent.aiAssert("'正在检查更新'文字可见");
  }, { timeout: 1200000, tags: ['1878381', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
