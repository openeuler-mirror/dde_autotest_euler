
/**
 * 用例 PMSID: 1700117
 * 用例标题: 【控制中心】【系统】【通知】应用通知设置页面展示与需求、ui一致
 * 生成时间: 2025-12-18 10:46:21
 * 用例编写人: UT001924(李鹤)
 */

describe('1700117-【控制中心】【系统】【通知】应用通知设置页面展示与需求、ui一致', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1700117-【控制中心】【系统】【通知】应用通知设置页面展示与需求、ui一致', async ({ device, agent, uos }) => {
    // 打开控制中心并进入系统-通知页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'通知'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    // 判断正常进入系统-通知页面
    await agent.aiAssert("'勿扰设置'文字存在");
    // 进入任一应用通知设置页面
    await agent.aiTap("应用通知列表中任一应用的非通知开关区域任意位置");
    // 检查应用通知设置页面展示元素
    await agent.aiAssert("'允许通知'文字存在");
    await agent.aiAssert("允许通知设置项开关状态与进入前同步且文字说明在区域内展示");
    await agent.aiAssert("通知消息显示位置设置项包含桌面和通知中心选项及对应展示元素且默认勾选");
    await agent.aiAssert("显示消息预览设置项默认勾选");
    await agent.aiAssert("通知时提示声音设置项默认勾选");
  }, { timeout: 1200000, tags: ['1700117', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
