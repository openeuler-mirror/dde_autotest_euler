/**
 * 用例 PMSID: 1801633
 * 用例标题: 【通知中心】通知中心暂驻区域非长驻通知超时消失，信息进入通知中心长驻区域，桌面通知横幅信息消失
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801633-【通知中心】通知中心暂驻区域非长驻通知超时消失，信息进入通知中心长驻区域，桌面通知横幅信息消失', () => {

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

  test('1801633-通知中心暂驻区域非长驻通知超时消失信息进入长驻区域桌面通知横幅信息消失', async ({ device, agent, uos, system }) => {
    // 前置条件：桌面有多条非长驻通知，设置短超时时间
    for (let i = 1; i < 3; i++) {
      await system.exec(`notify-send "通知信息测试" "第${i}条通知" -t 20000`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    await agent.aiWaitFor("桌面右下角有通知横幅");
    // 步骤1: 打开通知中心，等待暂驻通知任一条信息超时消失
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("暂驻区域有通知信息");
    // 等待通知超时消失
    await new Promise(resolve => setTimeout(resolve, 15000));
    // 检查1: 信息进入通知中心长驻区域
    await agent.aiAssert("通知中心长驻区域有通知信息");
    // 步骤2: 关闭通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心已关闭");
    // 检查2: 桌面上该条通知横幅信息消失
    await agent.aiAssert("桌面右下角通知横幅信息已消失");
  }, { timeout: 1200000, tags: ['1801633', 'level3'] });

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
