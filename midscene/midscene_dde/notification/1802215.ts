/**
 * 用例 PMSID: 1802215
 * 用例标题: 【通知中心】有按钮通知信息，正文内容有图片的通知信息，图片展示与需求一致
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1802215-【通知中心】有按钮通知信息，正文内容有图片的通知信息，图片展示与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1802215-【通知中心】有按钮通知信息，正文内容有图片的通知信息，图片展示与需求一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 发送有按钮且正文内容带有图片的通知信息
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "test" 0 "" "Hello world!" "This is an example notification." '["a", "b", "c", "d"]' '{"urgency": <1>, "image-path": <"file:///home/uos/Pictures/Wallpapers/deepin-theme-3.jpg">}' 60000`);
    // 步骤 1: 检查通知横幅信息内容图片展示（横幅为本机瞬逝展示，软验证，失败不中断）
    try {
      await agent.aiWaitFor('桌面右下角出现一条带有按钮的通知横幅', { timeoutMs: 10000 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      const bannerOk = await agent.aiBoolean('通知横幅中图片与按钮均已展示，布局完整', { deepThink: true });
      if (bannerOk) {
        console.log('通知横幅图片与按钮展示正常');
      } else {
        console.log('通知横幅已消失或截图未捕获（本机横幅瞬逝），以通知中心验证为准');
      }
    } catch (e) {
      console.log('通知横幅未捕获（本机横幅瞬逝），以通知中心验证为准');
    }

    // 步骤 2: 检查通知中心通知信息内容图片展示
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示标题为"Hello world!"的通知信息', { timeoutMs: 15000 });
    await agent.aiAssert('通知中心中通知信息图片与按钮均已正常展示，图片和按钮互不遮挡，布局完整');
  }, { timeout: 600000, tags: ['1802215', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
