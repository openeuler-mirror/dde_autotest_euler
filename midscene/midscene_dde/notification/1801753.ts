/**
 * 用例 PMSID: 1801753
 * 用例标题: 【通知中心】通知最大行数默认值与需求一致
 * 生成时间: 2026-08-05 13:36:23
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801753-【通知中心】通知最大行数默认值与需求一致', () => {
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

  test('1801753-【通知中心】通知最大行数默认值与需求一致', async ({ device, agent, uos, system }) => {
    const { getDconfigValue } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    // 检查默认配置项值
    const defaultBubbleContentRowCount = await getDconfigValue('org.deepin.dde.shell', 'org.deepin.dde.shell.notification', 'bubbleContentRowCount', system);
    console.log(`默认 bubbleContentRowCount: ${defaultBubbleContentRowCount}`);

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 发送一条多行长文本通知，正文超过默认最大行数
    await system.exec('notify-send -a "最大行数测试应用" "最大行数默认值测试标题" "第一行测试内容\\n第二行测试内容\\n第三行测试内容\\n第四行测试内容\\n第五行测试内容\\n第六行测试内容\\n第七行测试内容\\n第八行测试内容" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 通知横幅正文默认最大展示6行
    await agent.aiAssert('通知横幅正文内容最多展示6行，超出部分不展示');

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 通知中心正文默认最大展示6行
    await agent.aiAssert('通知中心通知信息正文内容最多展示6行，超出部分不展示');
  }, { timeout: 600000, tags: ['1801753', 'level3'] });

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
