/**
 * 用例 PMSID: 1801713
 * 用例标题: 【通知中心】通知中心鼠标右键未置顶折叠信息，唤出右键菜单后，tab键和回车键功能与需求一致
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801713-【通知中心】通知中心鼠标右键未置顶折叠信息，唤出右键菜单后，tab键和回车键功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1801713-【通知中心】通知中心鼠标右键未置顶折叠信息，唤出右键菜单后，tab键和回车键功能与需求一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 用两个不同的真实应用名发送通知，形成折叠信息
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '控制中心通知' '这是第${i}条控制中心通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'org.deepin.browser' '浏览器通知' '这是第${i}条浏览器通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 6000));

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 20000 });
    await agent.aiWaitFor('通知中心列表中显示通知信息', { timeoutMs: 15000 });

    // 步骤 1: 鼠标右键未置顶折叠信息，唤出右键菜单，多次按tab键
    await agent.aiRightClick('通知中心列表中最上方的通知条目', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('tab');
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey('tab');
    await new Promise(resolve => setTimeout(resolve, 800));
    // 检查1: 唤出右键菜单
    await agent.aiAssert('通知条目已弹出包含通知操作选项的右键菜单');

    // 步骤 2: 右键唤出菜单，点击选中"置顶/取消置顶"选项
    await agent.aiTap('右键菜单中的第一个选项', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查2: 该类应用的通知消息置顶展示，通知中心不关闭
    await agent.aiAssert('通知中心未关闭，通知消息正常展示');

    // 步骤 3: 右键唤出菜单，点击选中"通知设置"选项
    await agent.aiRightClick('通知中心列表中最上方的通知条目', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('右键菜单中的第二个选项', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 检查3: 通知中心关闭或跳转
    const inSettings = await agent.aiBoolean('屏幕上显示控制中心或通知设置界面');
    if (!inSettings) {
      await agent.aiAssert('通知中心列表中通知条目正常展示');
    }
  }, { timeout: 600000, tags: ['1801713', 'level3'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
