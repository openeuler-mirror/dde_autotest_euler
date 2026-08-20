
/**
 * 用例 PMSID: 1824733
 * 用例标题: 【控制中心】【系统】【语言和区域】设置货币符号为€
 * 生成时间: 2026-04-14 15:21:24
 * 用例编写人: UT002485(卢燕)
 */

describe('1824733-【控制中心】【系统】【语言和区域】设置货币符号为€', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824733-【控制中心】【系统】【语言和区域】设置货币符号为€', async ({ device, agent, uos }) => {
    // 打开控制中心进入语言和区域
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    await agent.aiTap("'货币符号'区域的ˇ符号");
    await agent.aiTap("货币符号下拉框中的[€]选项",{ deepThink: true });
    //验证货币符号修改为€，货币正数为$1.1，货币负数为$-1.1
    await agent.aiAssert("货币符号显示为€;货币正数为€1.1;货币负数为€-1.1");
  }, { timeout: 600000, tags: ['1824733', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //还原测试环境，设置货币符号为¥
    await system.exec(`dde-dconfig set -a "" -r org.deepin.region-format -k currencyFormat -v '¥'`);
    await device.pressKey("Super", "Down")
    await uos.closeCurrentWindow();
  });
});
