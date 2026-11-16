/**
 * 用例 PMSID: 1802203
 * 用例标题: 【通知中心】通知中心有新通知且没有打开通知中心，通知图标为常亮模式
 * 生成时间: 2026-07-28 16:49:41
 * 用例编写人: UT000327(秦家喜)
 */

describe('1802203-【通知中心】通知中心有新通知且没有打开通知中心，通知图标为常亮模式', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 调用dbus接口将通知图标添加到任务栏插件区展示
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await agent.aiWaitFor("任务栏右侧区域出现'通知'图标");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1802203-【通知中心】通知中心有新通知且没有打开通知中心，通知图标为常亮模式', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 通知中心有新通知且没有打开通知中心
    await system.exec('notify-send -a "常亮图标测试应用" "常亮图标测试" "有新通知未读" -t 60000');
    await agent.aiWaitFor('桌面右下角出现一条通知，标题为常亮图标测试');
    // 等待通知横幅消失进入常驻区域，确保任务栏图标状态更新
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 通知图标为常亮样式
    await agent.aiAssert('任务栏的通知图标可见，表示有未读新通知');
  }, { timeout: 600000, tags: ['1802203', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知
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
    // 调用dbus接口将通知图标从任务栏插件区移除恢复默认状态
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0");
  });
});
