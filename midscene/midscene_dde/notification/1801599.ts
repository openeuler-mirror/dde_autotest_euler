
/**
 * 用例 PMSID: 1801599
 * 用例标题: 【通知中心】任务栏通知图标正常打开通知中心
 * 生成时间: 2025-12-18 17:11:18
 * 用例编写人: UT001924(李鹤)
 */

describe('1801599-【通知中心】任务栏通知图标正常打开通知中心', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 调用dbus接口将通知图标添加到任务栏插件区展示
    system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    // 确认通知图标展示在任务栏插件区
    await agent.aiWaitFor("任务栏右侧区域出现'通知'图标");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801599-【通知中心】任务栏通知图标正常打开通知中心', async ({ device, agent, uos }) => {
    // 点击任务栏的通知图标打开通知中心
    await agent.aiTap("任务栏右侧区域的'通知'图标", { deepThink: true });
    await agent.aiAssert("桌面右上区域'通知中心'文字可见");
  }, { timeout: 1200000, tags: ['1801599', 'level1', 'smoke'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 点击任务栏没有图标的区域关闭通知中心
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
    // 调用dbus接口将通知图标从任务栏插件区移除恢复默认状态
    system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
