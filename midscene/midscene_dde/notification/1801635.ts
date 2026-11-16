/**
 * 用例 PMSID: 1801635
 * 用例标题: 【通知中心】通知中心暂驻区域有通知信息，关闭通知中心，暂驻区域通知以通知横幅方式展示在桌面右下角
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801635-【通知中心】通知中心暂驻区域有通知信息，关闭通知中心，暂驻区域通知以通知横幅方式展示在桌面右下角', () => {

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

  test('1801635-关闭通知中心暂驻区域通知以通知横幅方式展示在桌面右下角', async ({ device, agent, uos, system }) => {
    // 前置条件：通知中心暂驻区域有多条通知
    for (let i = 1; i < 3; i++) {
      await system.exec(`notify-send "通知信息测试" "第${i}条通知" -t 60000`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    await agent.aiWaitFor("桌面右下角有通知横幅");
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心最上方区域（标题栏上方的暂驻区域）有通知信息");
    // 在暂驻区域通知消失前，关闭通知中心
    await device.pressKey("super", "m");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查: 暂驻区域的通知以通知横幅方式展示在桌面右下角
    await agent.aiAssert("桌面右下角有通知横幅展示");
  }, { timeout: 1200000, tags: ['1801635', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
