/**
 * 用例 PMSID: 1801703
 * 用例标题: 【通知中心】通知中心标题栏展示设置菜单列表后，按上下键后，再按回车键，触发菜单列表最后选中菜单项事件
 * 生成时间: 2026-07-23 14:20:31
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801703-【通知中心】通知中心标题栏展示设置菜单列表后，按上下键后，再按回车键，触发菜单列表最后选中菜单项事件', () => {
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

  test('1801703-【通知中心】通知中心标题栏展示设置菜单列表后，按上下键后，再按回车键，触发菜单列表最后选中菜单项事件', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('notify-send -a "设置菜单测试应用" "设置菜单测试" "用于设置菜单上下键测试" -t 60000');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');

    // 点击标题栏的[设置]按钮，打开设置菜单
    await agent.aiTap('通知中心标题栏右侧的设置按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 步骤 1: 按上下键后，再按回车键
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey('Up');
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 检查: 回车键触发"通知设置"事件，进入控制中心-通知页面
    await agent.aiAssert('已进入系统设置的通知页面');
  }, { timeout: 600000, tags: ['1801703', 'level3'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));
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
