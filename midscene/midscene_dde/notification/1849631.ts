/**
 * 用例 PMSID: 1849631
 * 用例标题: 【通知中心】默认配置，非常驻通知，鼠标悬浮在通知信息上，5秒后通知横幅不消失，鼠标移出通知信息区域后自动消失
 * 生成时间: 2026-07-14 10:40:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849631-【通知中心】默认配置，非常驻通知，鼠标悬浮在通知信息上，5秒后通知横幅不消失，鼠标移出通知信息区域后自动消失', () => {

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

  test('1849631-【通知中心】默认配置，非常驻通知，鼠标悬浮在通知信息上，5秒后通知横幅不消失，鼠标移出通知信息区域后自动消失', async ({ device, agent, uos, system }) => {
    // 确保桌面干净（确保通知中心已关闭）
    const isOpen = await agent.aiBoolean('通知中心界面已显示');
    if (isOpen) {
      await device.pressKey('super', 'm');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 默认配置，发送一条没有设定消失时间的通知(notify-send aa bb)
    // 不指定-t使用默认超时，但需足够时间完成悬浮测试
    await system.exec('notify-send "悬浮测试通知" "鼠标悬浮不消失" -t 20000');

    // 步骤 2: 鼠标悬浮在通知信息上，等待5秒，自动化考虑到ai识别需要时间这里等待12秒
    await agent.aiHover('标题为"悬浮测试通知"的通知横幅', { deepThink: true });
    // 等待21秒，此处等待是业务逻辑不可降低
    await new Promise(resolve => setTimeout(resolve, 21000));

    // 检查: 通知横幅不会消失
    await agent.aiAssert('桌面右下角仍然显示通知横幅');

    // 步骤 3: 鼠标移出通知横幅区域
    await agent.aiHover('桌面左上角空白区域', { deepThink: true });
    // 等待通知自动消失，考虑到ai识别需要时间，等待2秒
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 通知横幅自动消失
    await agent.aiAssert('桌面右下角不再显示通知横幅（已消失）');

    // 检查: 通知横幅自动消失，进入通知中心常驻区域
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiAssert('通知中心常驻区域中存在标题为"悬浮测试通知"的通知信息');
  }, { timeout: 600000, tags: ['1849631', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    // 关闭通知中心
    await uos.showDesktop();
  });
});
