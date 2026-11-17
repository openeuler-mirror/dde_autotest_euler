/**
 * 用例 PMSID: 1846223
 * 用例标题: 【通知中心】通知中心有新通知，使用快捷键打开了通知中心，任务栏通知图标变为普通模式
 * 生成时间: 2026-07-14 10:45:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846223-【通知中心】通知中心有新通知，使用快捷键打开了通知中心，任务栏通知图标变为普通模式', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 调用dbus接口将通知图标添加到任务栏插件区展示
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1846223-【通知中心】通知中心有新通知，使用快捷键打开了通知中心，任务栏通知图标变为普通模式', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送一条通知，使通知中心有新通知
    await system.exec('notify-send "快捷键图标测试" "快捷键打开后变普通模式" -t 1000');
    // 等待1秒让新通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 使用快捷键(super+m)打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 任务栏通知图标变为普通模式
    await agent.aiAssert('任务栏右侧的通知图标显示为普通模式，没有高亮或常亮效果（已查看通知后变普通模式）');
  }, { timeout: 600000, tags: ['1846223', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    // 关闭通知中心
    await uos.showDesktop();
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0");
  });
});
