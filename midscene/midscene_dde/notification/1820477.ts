/**
 * 用例 PMSID: 1820477
 * 用例标题: 【通知中心】通知中心不需要背景蒙层
 * 生成时间: 2026-07-14 11:00:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1820477-【通知中心】通知中心不需要背景蒙层', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    // 关闭通知中心
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1820477-【通知中心】通知中心不需要背景蒙层', async ({ device, agent, uos }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 打开通知中心查看背景展示
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 通知中心没有全屏背景蒙层
    await agent.aiAssert('通知中心面板是半透明或透明的，可以看到底下的桌面内容，没有全屏黑色或灰色蒙层遮盖');
  }, { timeout: 600000, tags: ['1820477', 'level1', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 关闭通知中心
    await uos.showDesktop();
  });
});
