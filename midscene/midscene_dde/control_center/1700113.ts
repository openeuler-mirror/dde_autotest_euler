
/**
 * 用例 PMSID: 1700113
 * 用例标题: 【控制中心】【系统】【通知】进入控制中心-系统-通知页面，默认展示与需求、ui一致
 * 生成时间: 2025-12-18 10:08:06
 * 用例编写人: UT001924(李鹤)
 */

describe('1700113-【控制中心】【系统】【通知】进入控制中心-系统-通知页面，默认展示与需求、ui一致', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1700113-【控制中心】【系统】【通知】进入控制中心-系统-通知页面，默认展示与需求、ui一致', async ({ device, agent, uos }) => {
    // 打开控制中心并进入系统-通知页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'通知'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    // 检查页面元素
    await agent.aiAssert("'勿扰设置'文字存在");
    await agent.aiAssert("启用勿扰模式设置项为关闭状态");
    await agent.aiAssert("通知横幅展示数量右侧显示数字3");
    await agent.aiAssert("'应用通知'文字存在");
    await agent.aiAssert("应用列表展示应用图标、名称、应用通知开关、进入下一级页面图标'>'且应用通知开关默认开启");
  }, { timeout: 1200000, tags: ['1700113', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
