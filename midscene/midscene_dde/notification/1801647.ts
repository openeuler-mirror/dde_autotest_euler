/**
 * 用例 PMSID: 1801647
 * 用例标题: 【通知中心】通知中心长驻区域单条信息右键菜单功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801647-【通知中心】通知中心长驻区域单条信息右键菜单功能与需求一致', () => {

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

  test('1801647-通知中心长驻区域单条信息右键菜单功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送一条通知
    await system.exec(`notify-send -a 'dde-control-center' "通知信息测试" "单条通知内容"`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 等待通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("长驻区域(通知中心标题下面)有通知信息");
    // 右键点击长驻区域单个通知信息
    await agent.aiRightClick("通知中心长驻区域通知信息");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查: 展示【置顶】/【取消置顶】、【通知设置】按钮菜单
    await agent.aiAssert("右键菜单已展示");
    // 验证或条件-置顶端：未置顶时应显示"置顶"按钮
    const hasPin = await agent.aiBoolean("右键菜单中存在'置顶'", { deepThink: true });
    if (!hasPin) {
      throw new Error("未置顶状态下右键菜单应展示'置顶'");
    }
    await agent.aiAssert("右键菜单中展示'通知设置'");
    // 验证或条件-取消置顶端：点击置顶后再次右键应显示"取消置顶"按钮
    await agent.aiTap("右键菜单中的'置顶'");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 再次右键点击置顶的通知
    await agent.aiRightClick("通知中心长驻区域置顶的通知信息");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasUnpin = await agent.aiBoolean("右键菜单中存在'取消置顶'", { deepThink: true });
    if (!hasUnpin) {
      throw new Error("置顶状态下右键菜单应展示'取消置顶'");
    }
    await agent.aiAssert("右键菜单中展示'通知设置'");
    // 取消置顶恢复原状
    await agent.aiTap("右键菜单中的'取消置顶'");
  }, { timeout: 1200000, tags: ['1801647', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("Escape");
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
