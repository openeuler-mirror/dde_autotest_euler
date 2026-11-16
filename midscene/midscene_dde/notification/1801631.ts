/**
 * 用例 PMSID: 1801631
 * 用例标题: 【通知中心】通知中心暂驻区域最多展示3条信息，超过3条折叠展示
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801631-【通知中心】通知中心暂驻区域最多展示3条信息，超过3条折叠展示', () => {

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

  test('1801631-【通知中心】通知中心暂驻区域最多展示3条信息，超过3条折叠展示', async ({ device, agent, uos, system }) => {
    // 前置条件：桌面有3条以上通知横幅
    for (let i = 1; i < 6; i++) {
      await system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知" -t 60000`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    await agent.aiWaitFor("桌面右下角有通知横幅");
    // 打开通知中心，查看暂驻区域展示
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 检查: 最多展示3条，超过3条折叠
    await agent.aiAssert("通知中心最上方区域（标题栏上方的暂驻区域）有通知信息，展示最近的3条通知");
  }, { timeout: 1200000, tags: ['1801631', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
