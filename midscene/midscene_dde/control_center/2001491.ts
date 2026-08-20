
/**
 * 用例 PMSID: 2001491
 * 用例标题: 【控制中心】【系统】【通知】应用搜索结果支持实时刷新
 * 生成时间: 2026-05-28 20:30:00
 * 用例编写人: UT001924（李鹤）
 */

describe('2001491-【控制中心】【系统】【通知】应用搜索结果支持实时刷新', () => {
  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2001491-【控制中心】【系统】【通知】应用搜索结果支持实时刷新', async ({ device, agent, uos }) => {
    await uos.openApp("控制中心");
    // 进入通知页面
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    // 点击应用列表右上方的放大镜图标按钮
    await agent.aiTap("应用通知右侧的放大镜搜索图标", { deepThink: true });
    await agent.aiWaitFor("'搜索输入框可见'");
    // 输入不存在的应用名称
    const searchText = "qinab";
    await device.typeText(searchText);
    await agent.aiWaitFor("'应用列表为空，没有文字提示'");
    // 从后往前删除字母，验证实时刷新，最后保留一位字母
    for (let i = 0; i < searchText.length - 1; i++) {
      await device.pressKey("backspace");
      const remainingText = searchText.slice(0, searchText.length - i - 1);
      await agent.aiAssert(`检查列表出现包含"${remainingText}"字发音的应用名称或为空`);
    }
  }, { timeout: 600000, tags: ['2001491', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async () => {
    console.log('5. afterAll: 清理测试套件');
  });
});
