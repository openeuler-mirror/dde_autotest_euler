
/**
 * 用例 PMSID: 2001489
 * 用例标题: 【控制中心】【系统】【通知】应用列表搜索支持英文搜索
 * 生成时间: 2026-05-28 20:30:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001489-【控制中心】【系统】【通知】应用列表搜索支持英文搜索', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001489-【控制中心】【系统】【通知】应用列表搜索支持英文搜索', async ({ device, agent, uos, system }) => {
    await uos.openApp("控制中心");
    // 进入通知页面
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    // 点击应用列表右上方的放大镜图标按钮
    await agent.aiTap("应用通知右侧的放大镜搜索图标", { deepThink: true });
    await agent.aiWaitFor("'搜索输入框可见'");
    // 输入英文on进行搜索
    await device.typeText("on");
    await new Promise(resolve => setTimeout(resolve, 500));
    // 测试点断言 - 验证搜索结果包含控制中心、Onboard、跨端协同等包含on读音或英文的应用
    await agent.aiAssert("搜索结果包含控制、Onboard、办公、中心等名称任一个字或英文包含on读音或英文on的应用");
  }, { timeout: 600000, tags: ['2001489', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
