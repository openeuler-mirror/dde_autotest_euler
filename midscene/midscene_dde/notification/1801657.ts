/**
 * 用例 PMSID: 1801657
 * 用例标题: 【通知中心】鼠标悬浮在通知中心长驻区域任一应用折叠通知信息上，时间区域变为展示【清除通知】按钮
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801657-【通知中心】鼠标悬浮在通知中心长驻区域任一应用折叠通知信息上，时间区域变为展示【清除通知】按钮', () => {

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

  test('1801657-鼠标悬浮在通知中心长驻区域任一应用折叠通知信息上，时间区域变为展示【清除通知】按钮', async ({ device, agent, uos, system }) => {
    // 发送多条同一应用的通知，使其折叠显示
    for (let i = 1; i < 6; i++) {
      await system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知"`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    // 等待最后一条通知横幅出现
    await agent.aiWaitFor("桌面右下角有第5条通知信息", { timeoutMs: 15000 });
    // 等待通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 8000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心长驻区域有通知信息");
    // 鼠标移动到任一应用折叠通知上
    await agent.aiHover("通知中心长驻区域中标题为'通知信息测试'的通知条目", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 检查: 时间区域变为展示【清除通知】按钮
    // 验证或条件-x图标端：确认出现x图标(清除通知按钮)
    await agent.aiAssert("当前这条通知的右上角出现删除按钮或清除通知按钮,是x图标", { deepThink: true });
    // 验证或条件-关闭图标端：确认时间区域已被清除通知按钮替换,不再显示时间文字
    await agent.aiAssert("当前这条通知的右上角不再显示时间文字", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801657', 'level3'] });

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
