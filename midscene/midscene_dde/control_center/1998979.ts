
/**
 * 用例 PMSID: 1998979
 * 用例标题: 【控制中心】【系统】【通知】应用列表搜索框输入状态切换到其他模块，再次回到通知模块，搜索输入框变为默认的放大镜按钮
 * 生成时间: 2026-05-28 20:30:00
 * 用例编写人: UT001924（李鹤）
 */

describe('1998979-【控制中心】【系统】【通知】应用列表搜索框输入状态切换到其他模块，再次回到通知模块，搜索输入框变为默认的放大镜按钮', () => {

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1998979-【控制中心】【系统】【通知】应用列表搜索框输入状态切换到其他模块，再次回到通知模块，搜索输入框变为默认的放大镜按钮', async ({ device, agent, uos, system }) => {
    await uos.openApp("控制中心");
    // 进入通知页面
    await agent.aiWaitFor("'系统'文字可见");
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    // 点击应用列表右上方的放大镜图标按钮
    await agent.aiTap("应用通知右侧的放大镜搜索图标", { deepThink: true });
    await agent.aiWaitFor("'搜索输入框可见'");
    // 输入任意字符
    await device.typeText("#￥%");
    await new Promise(resolve => setTimeout(resolve, 300));
    // 切换到其他模块，如电源管理模块
    await agent.aiTap("电源管理", { deepThink: true });
    await agent.aiWaitFor("'电源管理页面'");
    // 进入系统-通知页面，查看搜索输入框状态
    await agent.aiTap("系统", { deepThink: true });
    await agent.aiWaitFor("'系统'文字可见");  
    await agent.aiTap("通知", { deepThink: true });
    await agent.aiWaitFor("'勿扰设置'文字可见");
    await new Promise(resolve => setTimeout(resolve, 300));
    // 测试点断言 - 验证搜索输入框恢复为默认的放大镜按钮
    await agent.aiAssert("默认的放大镜按钮");
  }, { timeout: 600000, tags: ['1998979', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
