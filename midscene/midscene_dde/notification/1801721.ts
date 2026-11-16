/**
 * 用例 PMSID: 1801721
 * 用例标题: 【通知中心】通知中心展开未置顶应用折叠信息，设置菜单中的[置顶]按钮回车功能与需求一致
 * 生成时间: 2026-07-23 14:20:31
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801721-【通知中心】通知中心展开未置顶应用折叠信息，设置菜单中的[置顶]按钮回车功能与需求一致', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasClearBtn = await agent.aiBoolean('通知中心界面显示"清除全部"按钮');
    if (hasClearBtn) {
      await agent.aiTap('通知中心的清除全部按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (let i = 0; i < 8; i++) {
      const hasLeftover = await agent.aiBoolean('通知中心中存在通知');
      if (!hasLeftover) break;
      try {
        await agent.aiHover('通知中心中最上面一条通知', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap('该通知右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { break; }
    }
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801721-【通知中心】通知中心展开未置顶应用折叠信息，设置菜单中的[置顶]按钮回车功能与需求一致', async ({ device, agent, uos, system }) => {
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

    // 展开未置顶应用折叠信息
    await agent.aiTap('通知中心中来自dde-control-center应用的折叠信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 点击应用信息右上角[设置]按钮唤出设置菜单
    await agent.aiTap('展开后应用信息右上角的设置按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 步骤 1: tab键切换焦点选中菜单中的[置顶]按钮后按回车键
    await device.pressKey('tab');
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 该类应用的通知消息置顶展示，【置顶】按钮变更为【取消置顶】按钮，通知中心不关闭
    await agent.aiAssert('该应用通知消息已置顶展示，通知中心未关闭');
  }, { timeout: 600000, tags: ['1801721', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasClearBtn = await agent.aiBoolean('通知中心界面显示"清除全部"按钮');
    if (hasClearBtn) {
      await agent.aiTap('通知中心的清除全部按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (let i = 0; i < 8; i++) {
      const hasLeftover = await agent.aiBoolean('通知中心中存在通知');
      if (!hasLeftover) break;
      try {
        await agent.aiHover('通知中心中最上面一条通知', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap('该通知右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { break; }
    }
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });
});
