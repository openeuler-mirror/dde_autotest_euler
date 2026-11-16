/**
 * 用例 PMSID: 1801747
 * 用例标题: 【通知中心】设置通知横幅通知最大行数后，模拟通知信息，标题和正文展示行数不超过设置的最大行数
 * 生成时间: 2026-08-05 13:36:23
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801747-【通知中心】设置通知横幅通知最大行数后，模拟通知信息，标题和正文展示行数不超过设置的最大行数', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const appId = 'org.deepin.dde.shell';
  const resource = 'org.deepin.dde.shell.notification';
  const key = 'bubbleContentRowCount';
  const testRowCount = 2;

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

  test('1801747-【通知中心】设置通知横幅通知最大行数后，模拟通知信息，标题和正文展示行数不超过设置的最大行数', async ({ device, agent, uos, system }) => {
    const { setDconfigValue, getDconfigValue } = await import(`${caseDir}/midscene_dde/common/common.ts`);
    const defaultRowCount = await getDconfigValue(appId, resource, key, system);
    console.log(`默认 bubbleContentRowCount: ${defaultRowCount}`);

    // 设置通知横幅通知最大行数为2
    await setDconfigValue(appId, resource, key, String(testRowCount), system);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 发送长文本多行通知
    await system.exec('notify-send -a "横幅行数测试应用" "横幅行数测试标题" "第一行测试内容\\n第二行测试内容\\n第三行测试内容\\n第四行测试内容\\n第五行测试内容" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 通知横幅正文展示行数不超过设置的最大行数2
    await agent.aiAssert('通知横幅正文内容最多展示2行，标题只展示一行，超出部分展示省略号');

    // 还原配置为默认值
    await setDconfigValue(appId, resource, key, String(defaultRowCount), system);
  }, { timeout: 600000, tags: ['1801747', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
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
