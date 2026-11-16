/**
 * 用例 PMSID: 1801617
 * 用例标题: 【通知中心】通知中心与任务栏tips和左右键窗口展示层级符合需求要求
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801617-通知中心与任务栏tips和左右键窗口展示层级符合需求要求', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const setNotificationOnDock = (on) =>
    `busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' ${on}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 确保任务栏处于显示状态，并回到桌面
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 优化前置清理：删除通知数据库并重启 dde-shell，确保通知中心无残留、面板状态干净
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 通知图标默认不驻留任务栏，前置恢复默认
    await system.exec(setNotificationOnDock(0));
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801617-通知中心与任务栏tips和左右键窗口展示层级符合需求要求', async ({ device, agent, uos, system }) => {
    // 步骤1: 左键窗口 + 快捷键唤出通知中心
    // 左键点击任务栏右侧音量图标，唤出音量面板（左键窗口）
    await agent.aiTap('任务栏右侧的音量图标', { deepThink: true });
    await agent.aiWaitFor('任务栏右侧音量图标弹出音量面板（左键窗口）已显示');
    // 使用快捷键唤出通知中心，验证左键窗口会自动关闭，通知中心在最上层展示
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('通知中心面板显示在最上层，且音量面板（左键窗口）已自动关闭', { deepThink: true });
    // 关闭通知中心
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 步骤2: 右键窗口 + 快捷键唤出通知中心
    // 右键点击任务栏右侧音量图标，唤出右键菜单（右键窗口）
    await agent.aiRightClick('任务栏右侧的音量图标', { deepThink: true });
    await agent.aiWaitFor('任务栏音量图标的右键菜单（右键窗口）已显示');
    await agent.aiAssert('音量图标的右键菜单（右键窗口）已正常显示', { deepThink: true });
    // 右键菜单为模态弹层，会拦截系统快捷键：按下快捷键后右键菜单不关闭，通知中心不会打开
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('音量图标的右键菜单（右键窗口）仍然显示，没有被关闭', { deepThink: true });
    await agent.aiAssert('通知中心没有打开，界面未显示通知中心面板', { deepThink: true });
    // 关闭右键菜单（右键窗口）并点击空白区域收起残留面板
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));


    // 步骤: 将通知中心驻留任务栏后，点击通知图标打开通知中心
    // 通过 dbus 将通知图标添加到任务栏插件区，使其驻留任务栏
    await system.exec(setNotificationOnDock(1));
    await agent.aiWaitFor('任务栏右侧区域出现通知图标', { timeoutMs: 10000 });
    // 点击驻留在任务栏的通知图标，打开通知中心
    await agent.aiTap('任务栏右侧区域的通知图标', { deepThink: true });
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('通知中心面板已通过驻留通知图标打开并显示在最上层', { deepThink: true });
    // 关闭通知中心
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3: 左键窗口 + 通知中心驻留后，点击通知图标打开通知中心
    // 左键点击任务栏右侧音量图标，唤出音量面板（左键窗口）
    await agent.aiTap('任务栏右侧的音量图标', { deepThink: true });
    await agent.aiWaitFor('任务栏右侧音量图标弹出音量面板（左键窗口）已显示');
    // 通知图标已驻留任务栏，点击驻留的通知图标打开通知中心
    await agent.aiTap('任务栏右侧区域的通知图标', { deepThink: true });
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 验证通知中心显示在最上层，左键窗口（音量面板）已自动关闭
    await agent.aiAssert('通知中心面板显示在最上层，且音量面板（左键窗口）已自动关闭', { deepThink: true });
    // 关闭通知中心
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤4: 右键窗口 + 通知中心驻留后，点击通知图标打开通知中心
    // 右键点击任务栏右侧音量图标，唤出右键菜单（右键窗口）
    await agent.aiRightClick('任务栏右侧的音量图标', { deepThink: true });
    await agent.aiWaitFor('任务栏音量图标的右键菜单（右键窗口）已显示');
    await agent.aiAssert('音量图标的右键菜单（右键窗口）已正常显示', { deepThink: true });
    // 点击驻留的通知图标：右键菜单为模态弹层，点击会先关闭右键菜单（点击被消耗），通知中心不会打开
    await agent.aiTap('任务栏右侧区域的通知图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 验证右键菜单（右键窗口）已关闭，且通知中心没有打开
    await agent.aiAssert('音量图标的右键菜单（右键窗口）已关闭，且界面未显示通知中心面板', { deepThink: true });
    // 清理残留面板/菜单
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤5: 任务栏tips + 快捷键唤出通知中心
    // 鼠标悬浮在任务栏托盘区域任一图标上（音量图标），唤出该图标的tips提示
    await agent.aiHover('任务栏右侧托盘区域的音量图标', { deepThink: true });
    await agent.aiWaitFor('音量图标的tips提示文字已显示');
    await agent.aiAssert('音量图标的tips提示已显示', { deepThink: true });
    // 鼠标保持悬浮不动，使用快捷键唤出通知中心，验证tips显示在通知中心上层
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('通知中心面板已显示，且音量图标的tips提示显示在通知中心面板的上层', { deepThink: true });
    // 关闭通知中心，并将鼠标移至空白区域避免残留tips
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiHover('屏幕中心空白区域', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 900000, tags: ['1801617', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭可能残留的面板/菜单/通知中心，并恢复通知图标为默认非驻留状态
    await device.pressKey('Escape');
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.releaseAllKeys();
    try {
      await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    } catch (e) { /* 忽略清理阶段的点击失败 */ }
    try {
      await system.exec(setNotificationOnDock(0));
    } catch (e) { /* 忽略 */ }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 恢复通知图标为默认非驻留状态
    try {
      await system.exec(setNotificationOnDock(0));
    } catch (e) { /* 忽略 */ }
    // 优化后置清理：删除通知数据库并重启 dde-shell，彻底清除通知残留与驻留状态
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
