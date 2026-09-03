
/**
 * 用例 PMSID: 1875227
 * 用例标题: 【控制中心】【首页】【侧边栏】侧边栏收起后，再重新打开控制中心保持最后收起状态
 * 生成时间: 2026-01-27 20:28:52
 * 用例编写人:UT005571(王艺桥)
 */

describe('1875227-【控制中心】【首页】【侧边栏】侧边栏收起后，再重新打开控制中心保持最后收起状态', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1875227-【控制中心】【首页】【侧边栏】侧边栏收起后，再重新打开控制中心保持最后收起状态', async ({ device, agent, uos, system }) => {
    //打开控制中心-关闭左侧侧边栏
    await uos.openApp("控制中心");
    await agent.aiTap("窗口左上角齿轮图标右边的方块图标",{ deepThink: true });
    //检查：左侧导航栏隐藏
    await agent.aiWaitFor("左侧不显示网络，个性化，设备，电源管理");
    await agent.aiAssert("窗口左侧无搜索输入框，窗口左侧显示常用设置，显示，声音等,当前窗口是居中的非全屏窗口");

    //关闭控制中心，重新打开检查，左侧栏未收起
    await uos.closeCurrentWindow();
    await uos.openApp("控制中心");
    await agent.aiAssert("窗口左侧有搜索输入框,左侧导航栏中显示系统，网络，个性化等");

  }, { timeout: 600000, tags: ['1875227', 'level3'] });

  afterEach(async ({ device, agent, uos}) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
