/**
 * 用例 PMSID: 1846229
 * 用例标题: 【通知中心】浅色模式，任务栏通知图标普通模式展示与ui设计一致
 * 生成时间: 2026-09-03 20:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846229-【通知中心】浅色模式，任务栏通知图标普通模式展示与ui设计一致', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 前置条件1: 清理残留通知，保证没有未查看通知
    const { clearNotifications, setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 前置条件2: 确保勿扰模式关闭
    await setDconfigValue('org.deepin.dde.shell', 'org.deepin.dde.shell.notification', 'dndMode', false, system);
    // 前置条件3: 设置通知图标在任务栏插件区展示
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await agent.aiWaitFor("任务栏右侧区域出现'通知'图标", { timeoutMs: 20000 });
    // 前置条件4: 系统外观设置为浅色模式
    await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "globaltheme" "bloom.light"');
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 等待主题实际生效（dde-shell重启后主题应用可能延迟，轮询确认防止误判）
    for (let i = 0; i < 10; i++) {
      const ok = await agent.aiBoolean('请仅以屏幕底部任务栏的颜色为准（忽略桌面上打开的窗口，如深色终端窗口）：任务栏是否为浅色主题（浅色/浅紫色背景），无勿扰标识）', { deepThink: true });
      if (ok) break;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    const themeOk = await agent.aiBoolean('请仅以屏幕底部任务栏的颜色为准（忽略桌面上打开的窗口，如深色终端窗口）：任务栏是否为浅色主题（浅色/浅紫色背景））', { deepThink: true });
    if (!themeOk) {
      throw new Error('浅色主题设置后未生效（轮询仍未确认），请检查系统外观或电量节电调光状态');
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1846229-【通知中心】浅色模式，任务栏通知图标普通模式展示与ui设计一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 1: 没有未查看通知（前置已清理通知中心），查看任务栏普通样式通知图标展示
    // 检查: 任务栏通知图标为普通模式，展示与ui设计一致（轮询重试防状态应用延迟）
    let isNormal = false;
    for (let attempt = 1; attempt <= 3 && !isNormal; attempt++) {
      isNormal = await agent.aiBoolean('请以屏幕底部任务栏的颜色为准判断主题（忽略桌面上打开的窗口颜色）：浅色主题下，任务栏右侧的通知图标是否展示为普通模式样式（没有高亮常亮效果，也没有勿扰标识）');
      if (!isNormal) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
    await agent.aiAssert('请以屏幕底部任务栏的颜色为准判断主题（忽略桌面上打开的窗口颜色）：浅色主题下，任务栏右侧的通知图标展示为普通模式样式（没有高亮常亮效果，也没有勿扰标识），与ui设计一致');
  }, { timeout: 600000, tags: ['1846229', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications, setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    // 确保勿扰模式恢复为关闭
    await setDconfigValue('org.deepin.dde.shell', 'org.deepin.dde.shell.notification', 'dndMode', false, system);
    // 恢复系统外观为浅色模式
    await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "globaltheme" "bloom.light"');
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 清理通知
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    // 将通知图标从任务栏插件区移除，恢复默认状态
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 0");
    await uos.showDesktop();
  });
});
