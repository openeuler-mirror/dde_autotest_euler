
/**
 * 用例 PMSID: 2001481
 * 用例标题: 【控制中心】【系统】【通知】应用搜索输入框，输入字符，如!@@#%<>，输入框右侧展示x清空按钮
 * 生成时间: 2026-05-28 20:30:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001481-【控制中心】【系统】【通知】应用搜索输入框，输入字符，如!@@#%<>，输入框右侧展示x清空按钮', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001481-【控制中心】【系统】【通知】应用搜索输入框，输入字符，如!@@#%<>，输入框右侧展示x清空按钮', async ({ device, agent, uos, system }) => {
    await uos.openApp("控制中心");
    // 进入通知页面
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    // 点击应用列表右上方的放大镜图标按钮
    await agent.aiTap("应用通知右侧的放大镜搜索图标", { deepThink: true });
    await agent.aiWaitFor("'搜索输入框可见'");
    // 输入特殊字符
    await device.typeText("!@@#%<>");
    await new Promise(resolve => setTimeout(resolve, 300));
    // 测试点断言 - 验证输入框右侧展示x清空按钮
    await agent.aiAssert("输入框右侧展示x清空按钮");
  }, { timeout: 600000, tags: ['2001481', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
