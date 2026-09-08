
/**
 * 用例 PMSID: 1877817
 * 用例标题: 【控制中心】【系统更新】更新设置页面默认展示更新类型和高级设置
 * 生成时间: 2025-12-17 09:22:30
 * 用例编写人: UT001924(李鹤)
 */

describe('1877817-【控制中心】【系统更新】更新设置页面默认展示更新类型和高级设置', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1877817-【控制中心】【系统更新】更新设置页面默认展示更新类型和高级设置', async ({ device, agent, uos }) => {
    // 打开控制中心并进入系统更新页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    // 点击更新设置进入更新设置页面
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    // 检查更新设置页面默认展示
    await agent.aiAssert("功能更新配置项开关状态为开启");
    await agent.aiAssert("安全更新配置项开关状态为开启");
    await agent.aiAssert("第三方更新配置项默认隐藏");
    await agent.aiAssert("高级设置右边显示'展开'文字");
  }, { timeout: 1200000, tags: ['1877817', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
