/**
 * 用例 PMSID: 1801623
 * 用例标题: 【通知中心】通知中心有暂驻区域，默认展示符合设计预期
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801623-【通知中心】通知中心有暂驻区域，默认展示符合设计预期', () => {

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

  test('1801623-【通知中心】通知中心有暂驻区域，默认展示符合设计预期', async ({ device, agent, uos, system }) => {
    // 前置条件：发送同一应用的多条通知，等待进入长驻区域后折叠展示
    for (let i = 1; i < 6; i++) {
      await system.exec(`notify-send -a "自动化测试" "通知信息测试" "第${i}条通知"`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    await agent.aiWaitFor("桌面右下角有通知横幅", { timeoutMs: 15000 });
    // 默认没指定通知消失时间，等待6秒后桌面通知消失进入通知中心长驻区域
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 发送不同应用的通知用于暂驻区域展示（带超时时间，保持暂驻，使用不同应用避免长驻区域折叠被干扰）
    for (let i = 1; i < 3; i++) {
      await system.exec(`notify-send -a "dde-control-center" "控制中心通知" "暂驻区通知${i}" -t 90000`);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    await agent.aiWaitFor("桌面右下角有通知横幅", { timeoutMs: 15000 });
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    // 检查: 最上方展示暂驻区，暂驻区无标题栏和功能按钮，下方展示长驻区
    await agent.aiAssert("通知中心最上方有通知信息展示且上方没有标题栏和功能按钮(设置菜单按钮(三点图标)和清除通知功能按钮(扫帚图标))（此为暂驻区域）", { deepThink: true });
    await agent.aiAssert("暂驻区域下方有标题栏，标题栏显示'通知中心'");
    await agent.aiAssert("标题栏右侧有设置菜单按钮(三点图标)和清除通知功能按钮(扫帚图标)");
    // 检查: 长驻区域终端应用的多个通知信息折叠展示（notify-send 通过终端发送，DDE 显示应用名为"终端"，5条通知折叠为1条）
    await agent.aiAssert("通知中心文案下方区域中，同一应用多条通知折叠只显示一条通知信息", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801623', 'level2', 'smoke'] });

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
