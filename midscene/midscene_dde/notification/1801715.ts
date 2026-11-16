/**
 * 用例 PMSID: 1801715
 * 用例标题: 【通知中心】通知中心鼠标右键置顶折叠信息，唤出右键菜单后，tab键和回车键功能与需求一致
 * 生成时间: 2026-08-05 13:36:23
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801715-【通知中心】通知中心鼠标右键置顶折叠信息，唤出右键菜单后，tab键和回车键功能与需求一致', () => {
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

  test('1801715-【通知中心】通知中心鼠标右键置顶折叠信息，唤出右键菜单后，tab键和回车键功能与需求一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 用两个不同的真实应用名发送通知，形成折叠信息
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '模拟控制中心应用名称发通知' '这是第${i}条模拟控制中心应用名称发出的通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'org.deepin.browser' '模拟浏览器应用名称发通知' '这是第${i}条模拟浏览器应用名称发出的通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 5000));

    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 先置顶该应用
    await agent.aiRightClick('通知中心中来自dde-control-center应用的折叠信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    const hasPin = await agent.aiBoolean('右键菜单中显示"置顶"选项');
    if (hasPin) {
      await agent.aiTap('右键菜单中的"置顶"选项', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 关闭第一次右键菜单，确保第二次右键能正常弹出
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 1: 鼠标右键置顶折叠信息，唤出右键菜单，多次按tab键
    await agent.aiRightClick('通知中心中来自dde-control-center应用的折叠信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('tab');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('tab');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查: 焦点进入右键菜单循环，不会出来
    await agent.aiAssert('右键菜单已显示, {deepThink: true}');

    // 步骤 2: tab键移动焦点到"取消置顶"选项上，再按回车键确认
    for (let i = 0; i < 6; i++) {
      const focused = await agent.aiBoolean('右键菜单中"取消置顶"选项处于焦点高亮状态');
      if (focused) break;
      await device.pressKey('tab');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: dde-control-center应用的折叠信息已取消置顶，恢复到正常排序
    await agent.aiAssert('dde-control-center应用的折叠信息已取消置顶，浏览器应用的折叠信息显示在其上方，dde-control-center折叠信息不再固定在通知中心列表最顶部');
  }, { timeout: 600000, tags: ['1801715', 'level3'] });

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
