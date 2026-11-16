/**
 * 用例 PMSID: 1801727
 * 用例标题: 【通知中心】默认配置，单行多行通知横幅和通知中心展示样式与ui设计一致
 * 生成时间: 2026-08-07 16:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801727-【通知中心】默认配置，单行多行通知横幅和通知中心展示样式与ui设计一致', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801727-【通知中心】默认配置，单行多行通知横幅和通知中心展示样式与ui设计一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 模拟通知正文内容单行
    await system.exec('notify-send -a "UI样式测试应用" "UI样式测试" "单行通知内容" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('桌面右下角的通知横幅显示标题"UI样式测试"和正文"单行通知内容"，正文为单行展示且内容完整');
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiAssert('通知中心中显示标题为"UI样式测试"、正文为"单行通知内容"的通知，正文为单行完整展示');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 2: 模拟通知正文内容两行
    await system.exec('notify-send -a "UI样式测试应用" "UI样式测试" "第一行通知内容\\n第二行通知内容" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('桌面右下角的通知横幅显示标题"UI样式测试"，正文展示两行内容，第一行为"第一行通知内容"，第二行为"第二行通知内容"，内容完整未被截断');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 3: 模拟通知正文内容多行
    await system.exec('notify-send -a "UI样式测试应用" "UI样式测试" "fewfw fewaf fewa fewa \\n 测试多行支持 \\n 2424 \\n fewfw \\n fewf" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('桌面右下角的通知横幅显示标题"UI样式测试"，正文内容展示为多行（超过两行），包含"测试多行支持"等文本');
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiAssert('通知中心中显示标题为"UI样式测试"的通知，正文内容包含"测试多行支持"等多行文本');
  }, { timeout: 600000, tags: ['1801727', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
