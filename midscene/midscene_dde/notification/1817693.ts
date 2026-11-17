/**
 * 用例 PMSID: 1817693
 * 用例标题: 【通知中心】通知中心适配浅色模式
 * 生成时间: 2026-07-14 11:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1817693-【通知中心】通知中心适配浅色模式', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 设置系统模式为浅色
    await system.exec("busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set \"ss\" \"globaltheme\" \"bloom.light\"");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 发送常驻和非常驻通知确保暂驻区和常驻区都有信息
    await system.exec('notify-send "通知中心暂驻区浅色适配测试" "暂驻区浅色模式适配" -t 0');
    await system.exec('notify-send "通知中心常驻区浅色适配测试" "常驻区浅色模式适配" -t 1000');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1817693-【通知中心】通知中心适配浅色模式', async ({ device, agent, uos }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 打开通知中心查看展示
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 适配浅色模式
    await agent.aiAssert('通知中心的通知卡片已适配浅色模式，通知卡片背景偏浅、文字偏深色，与浅色模式风格一致');
  }, { timeout: 600000, tags: ['1817693', 'level3'] });

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
    // 恢复系统模式为浅色
    await system.exec("busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set \"ss\" \"globaltheme\" \"bloom.light\"");
  });
});
