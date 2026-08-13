
/**
 * 用例 PMSID: 1845653
 * 用例标题: 【控制中心】【账户】【用户组】用户组设置按钮打开界面响应正常
 * 生成时间: 2026-04-14 15:02:20
 * 用例编写人: UT002485(卢燕)
 */

describe('1845653-【控制中心】【账户】【用户组】用户组设置按钮打开界面响应正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1845653-【控制中心】【账户】【用户组】用户组设置按钮打开界面响应正常', async ({ device, agent, uos }) => {
    //进入控制中心-账户-用户组设置
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：账户");
    await agent.aiTap("窗口右下方用户组设置按钮");
    await agent.aiWaitFor("显示用户组界面");
    await agent.aiAssert("用户组界面显示：编辑按钮，lp、lpadmin、netdev、scanner、sudo、users、_ssh等选项");

    //检查添加用户组按钮
    await agent.aiScroll('控制中心右侧用户组页面', { direction: 'down', distance: 100, scrollType: 'once' });
    await agent.aiWaitFor("显示添加用户组按钮");
    await agent.aiAssert("显示添加用户组按钮");
  }, { timeout: 600000, tags: ['1845653', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiScroll('控制中心右侧用户组页面', { direction: 'up', distance: 100, scrollType: 'once' });
    await uos.closeCurrentWindow();
  });
});
