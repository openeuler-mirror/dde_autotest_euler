/**
 * 用例 PMSID: 1849657
 * 用例标题: 【通知中心】常驻通知信息，在桌面通知横幅手动操作消失后不会进入通知中心
 * 生成时间: 2026-07-14 10:30:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849657-【通知中心】常驻通知信息，在桌面通知横幅手动操作消失后不会进入通知中心', () => {

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

  test('1849657-【通知中心】常驻通知信息，在桌面通知横幅手动操作消失后不会进入通知中心', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 发送多个常驻通知
    for (let i = 1; i <= 2; i++) {
      await system.exec(`gdbus call --session --dest=org.freedesktop.Notifications --object-path=/org/freedesktop/Notifications --method=org.freedesktop.Notifications.Notify "test" 0 "" '横幅消失测试${i}' '手动消失后不进入通知中心' '["a", "b", "c", "d", "f", "e"]' '{}' 0
`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 步骤 2: 手动点击常驻通知横幅内容区域或者点击功能按钮使其消失
    await agent.aiTap('标题为"横幅消失测试1"的通知横幅的b按钮', { deepThink: true });
    // 消失有动效需要一点时间，提升通过率，等待3秒
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 检查: 通知横幅消失
    await agent.aiAssert('桌面右下角看不到标题为"横幅消失测试1"的通知横幅,能看到标题为"横幅消失测试2"的通知横幅');

    // 步骤 3: 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 检查: 通知横幅消失后不会进入通知中心
    await agent.aiAssert('通知中心中看不到标题为"横幅消失测试1"的通知信息，能看到标题为"横幅消失测试2"的通知信息');
  }, { timeout: 600000, tags: ['1849657', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
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
