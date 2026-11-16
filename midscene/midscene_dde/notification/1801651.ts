/**
 * 用例 PMSID: 1801651
 * 用例标题: 【通知中心】通知中心长驻区域单条置顶信息右键菜单中的[取消置顶]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801651-【通知中心】通知中心长驻区域单条置顶信息右键菜单中的取消置顶按钮功能与需求一致', () => {

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

  test('1801651-通知中心长驻区域单条置顶信息右键菜单中的取消置顶按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送2条不同应用的通知（不折叠，每条为独立单条未置顶信息，体现置顶功能：置顶的通知会排到最前面）
    // 拉大发送间隔并在内容中标记发送时间，体现时间差异，便于取消置顶后按发送时间顺序比对
    const apps = ['dde-control-center', 'org.deepin.browser'];
    const sendTimes = new Array(apps.length);
    const pad2 = (n) => (n < 10 ? '0' + n : '' + n);
    const fmtTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
    for (let i = 0; i < apps.length; i++) {
      const timeMark = fmtTime(new Date());
      sendTimes[i] = timeMark;
      await system.exec(`notify-send -a '${apps[i]}' "通知信息测试" "第${i + 1}条待操作通知内容(发送${timeMark})"`);
      // 间隔3秒发送，确保两条通知发送时间明显不同（新通知排在上方，旧通知排在下方）
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    // 等待通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert(`长驻区域有2条不同应用的通知信息，每条通知独立展示未折叠；按发送时间排序：发送较晚的第2条通知(发送${sendTimes[1]})在上方，发送较早的第1条通知(发送${sendTimes[0]})在下方`, { deepThink: true });
    // 右键点击长驻区域最下方的一条通知信息，展示右键菜单
    await agent.aiRightClick("通知中心长驻区域最下方的一条通知信息", { deepThink: true });
    await agent.aiWaitFor("右键菜单已展示");
    // 如果该通知已置顶（菜单显示"取消置顶"），先取消置顶恢复未置顶状态
    const alreadyPinned = await agent.aiBoolean("右键菜单中显示'取消置顶'按钮（表示该通知已置顶）", { deepThink: true });
    if (alreadyPinned) {
      await agent.aiTap("右键菜单中的'取消置顶'按钮", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 重新右键点击该通知
      await agent.aiRightClick("通知中心长驻区域最下方的一条通知信息", { deepThink: true });
      await agent.aiWaitFor("右键菜单已展示");
    }
    // 先置顶该通知
    await agent.aiTap("右键菜单中的'置顶'按钮", { deepThink: true });
    await agent.aiWaitFor("通知中心长驻区域最上方的通知是刚刚置顶的通知", { timeoutMs: 15000 });
    // 右键点击置顶通知，展示右键菜单
    await agent.aiRightClick("通知中心长驻区域置顶的通知信息", { deepThink: true });
    await agent.aiWaitFor("右键菜单已展示");
    // 点击菜单的[取消置顶]按钮
    await agent.aiTap("右键菜单中的'取消置顶'按钮", { deepThink: true });
    // 检查: 该条通知消息取消置顶，不再排到最前面，恢复到置顶前的发送时间顺序（使用aiWaitFor重试等待取消置顶效果生效）
    await agent.aiWaitFor(`通知中心长驻区域中刚刚置顶的通知已取消置顶，恢复到置顶前的发送时间顺序：发送较晚的第2条通知(发送${sendTimes[1]})在上方，发送较早的第1条通知(发送${sendTimes[0]})在最下方`, { timeoutMs: 15000 });
    // 右键验证按钮变更回[置顶]
    await agent.aiRightClick("通知中心长驻区域刚取消置顶的通知信息", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const hasPin = await agent.aiBoolean("右键菜单显示'置顶'按钮（表示该通知已取消置顶）", { deepThink: true });
    if (!hasPin) {
      throw new Error("取消置顶后右键菜单应显示'置顶'按钮");
    }
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801651', 'level3'] });

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
