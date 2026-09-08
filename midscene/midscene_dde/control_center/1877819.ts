
/**
 * 用例 PMSID: 1877819
 * 用例标题: 【控制中心】【系统更新】更新设置页面高级设置点击展开后展示内容与需求一致
 * 生成时间: 2025-12-17 11:15:43
 * 用例编写人: UT001924(李鹤)
 */

describe('1877819-【控制中心】【系统更新】更新设置页面高级设置点击展开后展示内容与需求一致', () => {

  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { resetUpdateSettings,closeAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeAuthDialog(agent, device);
    await resetUpdateSettings(system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1877819-【控制中心】【系统更新】更新设置页面高级设置点击展开后展示内容与需求一致', async ({ device, agent, uos }) => {
    // 打开控制中心并进入系统更新页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    // 点击更新设置进入更新设置页面
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    // 点击高级设置展开按钮展开高级设置并检查展示元素
    await agent.aiTap("展开", { deepThink: true });
    await agent.aiWaitFor("'下载限速'文字可见");
    await agent.aiAssert("下载限速配置项默认开关状态为关闭");
    await agent.aiAssert("自动下载配置项默认开关状态为关闭");
    await agent.aiAssert("更新提醒配置项默认开关状态为开启");
    await agent.aiAssert("清除软件包缓存配置项默认开关状态为开启");
    await agent.aiAssert("'缓存传递配置'文字不可见");
    await agent.aiAssert("历史更新内容配置项右侧'查看'按钮可见");
  }, { timeout: 1200000, tags: ['1877819', 'level2', 'smoke'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { resetUpdateSettings,closeAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeAuthDialog(agent, device);
    await resetUpdateSettings(system);
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
