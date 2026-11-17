/**
 * 用例 PMSID: 1817689
 * 用例标题: 【通知中心】通知横幅适配浅色模式
 * 生成时间: 2026-07-14 11:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1817689-【通知中心】通知横幅适配浅色模式', () => {

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
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1817689-【通知中心】通知横幅适配浅色模式', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 查看通知横幅展示
    await system.exec('notify-send "浅色横幅测试" "浅色模式适配" -t 10000');

    // 检查: 适配浅色模式
    await agent.aiAssert('通知横幅已适配浅色模式，通知横幅背景偏浅、文字偏深色，与浅色模式风格一致');
  }, { timeout: 600000, tags: ['1817689', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 恢复系统模式为浅色
    await system.exec("busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set \"ss\" \"globaltheme\" \"bloom.light\"");
  });
});