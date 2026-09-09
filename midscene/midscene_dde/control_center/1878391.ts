
/**
 * 用例 PMSID: 1878391
 * 用例标题: 【控制中心】【系统更新】"检查更新"配置项开关修改为关闭状态，更新设置界面除[清除软件包缓存]配置项和历史更新内容查看按钮可以点击外，其他配置项都置灰不可点击
 * 生成时间: 2026-03-10 20:37:17
 * 用例编写人: UT001924（李鹤）
 */

describe('1878391-【控制中心】【系统更新】"检查更新"配置项开关修改为关闭状态，更新设置界面除[清除软件包缓存]配置项和历史更新内容查看按钮可以点击外，其他配置项都置灰不可点击', () => {
  const caseDir = process.env.TESTCASE_DIR;

  let lastoreDaemonInitialStatus = '';

  const testConfig = {
    appID: "org.deepin.dde.lastore",
    source: "org.deepin.dde.lastore",
    key: "lastore-daemon-status",
    disabledStatusValue: "2"
  };

beforeAll(async ({ uos, system }) => {
  console.log('1. beforeAll: 初始化测试套件');
  await uos.showDesktop();
  const { getDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
  lastoreDaemonInitialStatus = await getDconfigValue(testConfig.appID, testConfig.source, testConfig.key, system);
  console.log(`初始状态值: ${lastoreDaemonInitialStatus}`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878391-【控制中心】【系统更新】"检查更新"配置项开关修改为关闭状态，更新设置界面除[清除软件包缓存]配置项和历史更新内容查看按钮可以点击外，其他配置项都置灰不可点击', async ({ device, agent, uos, system }) => {
    await uos.openApp("控制中心", {maximizeWindow: true});
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, testConfig.disabledStatusValue, system);

    // 进入更新设置页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'系统已被禁止更新'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });

    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiWaitFor("'收起'文字可见");

    // 断言配置项可点击状态
    await agent.aiAssert("清除软件包缓存配置项和历史更新内容配置项的'查看'按钮可点击，其他配置项（功能更新、安全更新、下载限速、自动下载、更新提醒）的开关有灰色蒙层不可点击");
  }, { timeout: 600000, tags: ['1878391', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await setDconfigValue(testConfig.appID, testConfig.source, testConfig.key, lastoreDaemonInitialStatus, system);
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
