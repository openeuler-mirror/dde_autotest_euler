
/**
 * 用例 PMSID: 1876207
 * 用例标题: 【控制中心】【通知】设置通知横幅展示数量为“1条”，桌面通知横幅展示符合需求要求
 * 生成时间: 2026-03-21 17:30:22
 * 用例编写人: UT001924（李鹤）
 */

describe('1876207-【控制中心】【通知】设置通知横幅展示数量为“1条”，桌面通知横幅展示符合需求要求', () => {
  const caseDir = process.env.TESTCASE_DIR;

  const testConfig = {
    appID: "org.deepin.dde.shell",
    source: "org.deepin.dde.shell.notification",
    key: "bubbleCount",
    testValue: "1",
    resetValue: "3"
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876207-【控制中心】【通知】设置通知横幅展示数量为“1条”，桌面通知横幅展示符合需求要求', async ({ device, agent, uos, system }) => {
    await uos.openApp("控制中心");
    // 进入通知页面
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    // 使用命令行设置配置项保证稳定性
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.testValue,system);
    await agent.aiWaitFor("通知横幅展示数量显示1");
    for (let i = 1; i < 6; i++) {
      system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知" -t 20000`);
      // 每条通知间隔100ms发送
      await new Promise(resolve => setTimeout(resolve, 200));
    };
    // 测试点断言
    await agent.aiAssert("可见1条通知,内容标注为“第5条通知”");
  }, { timeout: 600000, tags: ['1876207', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.resetValue,system);
  // 关闭当前窗口-控制中心
  await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
