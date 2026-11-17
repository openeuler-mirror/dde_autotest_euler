/**
 * 用例 PMSID: 1849661
 * 用例标题: 【通知中心】常驻通知信息，在通知中心暂驻区域删除后关闭通知中心，常驻通知不会展示在桌面
 * 生成时间: 2026-07-14 10:30:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849661-【通知中心】常驻通知信息，在通知中心暂驻区域删除后关闭通知中心，常驻通知不会展示在桌面', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1849661-【通知中心】常驻通知信息，在通知中心暂驻区域删除后关闭通知中心，常驻通知不会展示在桌面', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送多个常驻通知
    for (let i = 1; i <= 2; i++) {
      await system.exec(`notify-send "删除关闭测试${i}" "删除后不展示桌面" -t 0`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 步骤 2: 打开通知中心，在暂驻区域删除一条常驻通知，关闭通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    await agent.aiHover('通知中心中标题为"删除关闭测试1"的通知', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('该通知右上角的关闭按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 关闭通知中心
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 删除的常驻通知不会展示在桌面
    await agent.aiAssert('桌面上看不到标题为"删除关闭测试1"的通知横幅,能看到标题为"删除关闭测试2"的通知横幅');
  }, { timeout: 600000, tags: ['1849661', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    // 关闭通知中心
    await uos.showDesktop();
  });
});
