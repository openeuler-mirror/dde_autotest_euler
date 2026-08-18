
/**
 * 用例 PMSID: 2001483
 * 用例标题: 【控制中心】【系统】【通知】点击应用搜索输入框右侧的x按钮，清空输入框的字符，列表展示所有应用
 * 生成时间: 2026-05-28 20:30:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001483-【控制中心】【系统】【通知】点击应用搜索输入框右侧的x按钮，清空输入框的字符，列表展示所有应用', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001483-【控制中心】【系统】【通知】点击应用搜索输入框右侧的x按钮，清空输入框的字符，列表展示所有应用', async ({ device, agent, uos, system }) => {
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
    await agent.aiWaitFor("'输入框右侧展示x清空按钮'");
    // 点击输入框右侧的x按钮
    await agent.aiTap("x清空按钮", { deepThink: true });
    await agent.aiWaitFor("输入框没有字符");
    // 测试点断言 - 验证清空后列表展示所有应用
    await agent.aiAssert("清空输入框字符，输入框左侧展示小放大镜搜索图标，小放大镜图标右侧有鼠标光标或无鼠标光标，列表展示所有应用");
  }, { timeout: 600000, tags: ['2001483', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
