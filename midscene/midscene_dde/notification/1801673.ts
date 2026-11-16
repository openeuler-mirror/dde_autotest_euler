/**
 * 用例 PMSID: 1801673
 * 用例标题: 【通知中心】通知中心长驻区域任一应用展开折叠通知信息右上角的[收起]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801673-【通知中心】通知中心长驻区域任一应用展开折叠通知信息右上角的[收起]按钮功能与需求一致', () => {

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

  test('1801673-【通知中心】通知中心长驻区域任一应用展开折叠通知信息右上角的[收起]按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送多条同一应用的通知，使其折叠显示
    for (let i = 1; i < 6; i++) {
      await system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知"`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    // 等待最后一条通知横幅出现
    await agent.aiWaitFor("桌面右下角有第5条通知信息", { timeoutMs: 15000 });
    // 默认没指定通知消失时间，等待6秒后桌面通知消失进入通知中心
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("长驻区域(通知中心标题下面)有通知信息");
    // 展开通知信息
    await agent.aiTap("通知中心长驻区域通知信息");
    await agent.aiWaitFor("通知信息已展开");
    // 鼠标悬浮到展开通知信息上，使右上角按钮显示
    await agent.aiHover("展开的通知信息", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 点击展开通知信息右上角的[收起]按钮
    await agent.aiTap("同一应用区域展开通知信息右上角的向上箭头图标(收起)按钮");
    // 检查: 该应用下展开通知信息恢复折叠状态
    await agent.aiAssert("同一应用多条通知恢复折叠状态，只显示其中一条通知信息");
  }, { timeout: 1200000, tags: ['1801673', 'level3'] });

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
