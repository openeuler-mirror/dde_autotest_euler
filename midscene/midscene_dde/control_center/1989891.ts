
/**
 * 用例 PMSID: 1989891
 * 用例标题: 【控制中心】【系统】【通知】未开启勿扰时间，全天一直是勿扰模式
 * 生成时间: 2026-03-21 17:31:57
 * 用例编写人: UT001924（李鹤）
 */

describe('1989891-【控制中心】【系统】【通知】未开启勿扰时间，全天一直是勿扰模式', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.shell",
    source: "org.deepin.dde.shell.notification",
    key: "dndMode",
    testValue: true,
    resetValue: false
  };
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1989891-【控制中心】【系统】【通知】未开启勿扰时间，全天一直是勿扰模式', async ({ device, agent, uos, system }) => {
    await uos.openApp("控制中心");
    // 进入通知页面
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    // 使用命令行设置配置项保证稳定性
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValue,system);
    await agent.aiWaitFor("从,至文字可见");
    for (let i = 1; i < 6; i++) {
      system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知"`);
      // 每条通知间隔100ms发送
      await new Promise(resolve => setTimeout(resolve, 200));
    };
    // 桌面通知测试点断言
    await agent.aiAssert("桌面不展示通知横幅(没有内容标注为“第5条通知”信息)");
    // 默认没指定通知消失时间，等待6秒后桌面通知消失进入通知中心，此处等待6秒是业务逻辑不可降低
    await new Promise(resolve => setTimeout(resolve, 6000));
    await device.pressKey("super","m");
    await agent.aiWaitFor("通知中心文字可见");
    // 通知中心测试点断言
    await agent.aiAssert("自动化测试相关通知,内容标注为'第5条通知'");
  }, { timeout: 600000, tags: ['1989891', 'level3'] });

  afterEach(async ({ device, system, uos, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.resetValue,system);
    // 重新让控制中心获取焦点
    await agent.aiTap("勿扰设置", { deepThink: true });
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
