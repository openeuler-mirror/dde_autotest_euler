/**
 * 用例 PMSID: 1876793
 * 用例标题: 【通知中心】ssh连接测试机发送一条没有应用图标的通知，通知横幅，通知中心暂驻区域，通知中心常驻区域该通知的应用图标使用默认图标
 * 生成时间: 2026-07-14 08:40:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1876793-【通知中心】ssh连接测试机发送一条没有应用图标的通知，通知横幅，通知中心暂驻区域，通知中心常驻区域该通知的应用图标使用默认图标', () => {
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

  test('1876793-【通知中心】ssh连接测试机发送一条没有应用图标的通知，通知横幅，通知中心暂驻区域，通知中心常驻区域该通知的应用图标使用默认图标', async ({ device, agent, uos, system, env }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 通过 ssh 连接测试机发送一条没有应用图标的通知（超时20秒以便验证横幅图标）
    // 经 ssh 发送，通知的应用图标不会识别为终端应用图标，通知中心将使用默认图标
    const host = (await system.exec("hostname -I 2>/dev/null | awk '{print $1}'")).stdout.trim() || '127.0.0.1';
    await system.exec(
      `sshpass -p '${env.testPassword}' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ${env.testUsername}@${host} 'export DISPLAY=:0 && notify-send -a "test" "Hello world!" "This is an example notification." -t 20000'`,
      60000
    );
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiWaitFor('桌面右下角出现一条通知，标题为Hello world!', { timeoutMs: 30000 });

    // 检查: 通知横幅该通知的应用图标展示默认图标
    await agent.aiAssert('通知横幅左上角展示的不是终端应用的图标');

    // 步骤 2: 打开通知中心，查看暂驻区域该通知的应用图标
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 通知中心暂驻区域该通知的应用图标展示默认图标
    await agent.aiAssert('通知中心暂驻区域中标题为Hello world!的这条通知左上角展示的不是终端应用的图标');

    // 步骤 3: 等待通知消失进入常驻区域，查看通知中心常驻区域该通知的应用图标
    // 通知超时时间为20秒，等待21秒确保通知进入常驻区域
    await new Promise(resolve => setTimeout(resolve, 21000));

    // 检查: 通知中心常驻区域该通知的应用图标展示默认图标
    await agent.aiAssert('通知中心常驻区域中标题为Hello world!的这条通知左上角展示的不是终端应用的图标');
  }, { timeout: 600000, tags: ['1876793', 'level4'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
