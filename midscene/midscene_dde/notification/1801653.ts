/**
 * 用例 PMSID: 1801653
 * 用例标题: 【通知中心】通知中心长驻区域单条信息设置菜单中的[通知设置]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801653-【通知中心】通知中心长驻区域单条信息设置菜单中的通知设置按钮功能与需求一致', () => {

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

  test('1801653-【通知中心】通知中心长驻区域单条信息设置菜单中的通知设置按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送一条通知
    await system.exec(`notify-send -a 'dde-control-center' "通知信息测试" "单条通知内容"`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 等待通知进入通知中心
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("长驻区域(通知中心标题下面)有通知信息");
    // 右键点击长驻区域单个通知信息，展示右键菜单
    await agent.aiRightClick("通知中心长驻区域通知信息");
    await agent.aiWaitFor("右键菜单已展示");
    // 点击菜单的[通知设置]按钮
    await agent.aiTap("右键菜单中的'通知设置'按钮");
    // 检查: 进入系统设置页面通知设置相关内容，通知中心面板不可见
    await agent.aiWaitFor("系统设置页面已打开");
    await agent.aiAssert("系统设置页面显示通知设置相关内容");
    await agent.aiAssert("通知中心面板不可见");
    await device.pressKey("alt", "F4");
  }, { timeout: 1200000, tags: ['1801653', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭可能残留的系统设置窗口
    try {
      await device.pressKey("alt", "F4");
    } catch (e) { console.log('close window skipped'); }
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
