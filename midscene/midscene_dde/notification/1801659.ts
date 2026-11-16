/**
 * 用例 PMSID: 1801659
 * 用例标题: 【通知中心】通知中心长驻区域任一应用折叠通知信息右键菜单与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801659-【通知中心】通知中心长驻区域任一应用折叠通知信息右键菜单与需求一致', () => {

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

  test('1801659-【通知中心】通知中心长驻区域任一应用折叠通知信息右键菜单与需求一致', async ({ device, agent, uos, system }) => {
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
    await agent.aiAssert("通知中心文案下面有通知信息");
    // 右键点击通知信息
    await agent.aiRightClick("通知中心文案下面的通知信息");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 检查: 菜单展示"置顶/取消置顶"、"通知设置"
    await agent.aiAssert("右键菜单已展示");
    // 验证或条件-置顶端：未置顶时应显示"置顶"按钮
    const hasPin = await agent.aiBoolean("右键菜单中存在'置顶'按钮", { deepThink: true });
    if (!hasPin) {
      throw new Error("未置顶状态下右键菜单应展示'置顶'按钮");
    }
    await agent.aiAssert("右键菜单中展示'通知设置'按钮");
    // 验证或条件-取消置顶端：点击置顶后再次右键应显示"取消置顶"按钮
    await agent.aiTap("右键菜单中的'置顶'按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 再次右键点击置顶的通知
    await agent.aiRightClick("通知中心文案下面的通知信息");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasUnpin = await agent.aiBoolean("右键菜单中存在'取消置顶'按钮", { deepThink: true });
    if (!hasUnpin) {
      throw new Error("置顶状态下右键菜单应展示'取消置顶'按钮");
    }
    await agent.aiAssert("右键菜单中展示'通知设置'按钮");
    // 取消置顶恢复原状
    await agent.aiTap("右键菜单中的'取消置顶'按钮");
  }, { timeout: 1200000, tags: ['1801659', 'level3'] });

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
