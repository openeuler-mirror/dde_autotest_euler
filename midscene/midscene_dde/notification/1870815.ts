/**
 * 用例 PMSID: 1870815
 * 用例标题: 【通知中心】通知横幅信息，手动或自动消失，自动调整位置
 * 生成时间: 2026-07-14 08:50:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1870815-【通知中心】通知横幅信息，手动或自动消失，自动调整位置', () => {
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

  test('1870815-【通知中心】通知横幅信息，手动或自动消失，自动调整位置', async ({ device, agent, uos, system }) => {
    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 步骤 1: 通知横幅有2-3条信息，消失一条信息
    // 通过 dbus 接口发送3条带按钮的通知，长超时保持显示（避免测试过程中横幅自动消失）
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "测试应用1" 0 "" "第一条通知" "待删除" '["action1", "删除"]' "{}" 180000`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "测试应用2" 0 "" "第二条通知" "保持显示" '["action2", "删除"]' "{}" 180000`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "测试应用3" 0 "" "第三条通知" "保持显示" '["action3", "删除"]' "{}" 180000`);
    await agent.aiWaitFor('桌面右下角显示3条通知横幅', { timeoutMs: 30000 });

    // 手动点击第一条通知横幅上的"删除"按钮使其消失
    await agent.aiHover('标题为"第一条通知"的通知横幅', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('标题为"第一条通知"的通知横幅上的"删除"按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 通知横幅向下调整位置，距离下方10px
    await agent.aiAssert('桌面右下角显示2条通知横幅（第二条通知和第三条通知），通知横幅整体向下调整了位置，位于任务栏上方区域');

    // 清理步骤1的通知：逐条点击通知横幅上的"删除"按钮关闭桌面通知横幅
    for (let i = 0; i < 5; i++) {
      const hasNotif = await agent.aiBoolean('桌面右下角存在通知横幅');
      if (!hasNotif) break;
      try {
        await agent.aiHover('桌面右下角最上面一条通知横幅', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap('该通知横幅上的"删除"按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { break; }
    }

    // 步骤 2: 通知横幅不同应用超过3条信息，消失一条信息
    // 通过 dbus 接口发送5条带按钮的不同应用通知，超过3条只显示最新3条
    for (let i = 1; i <= 5; i++) {
      await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "应用${i}" 0 "" "第${i}条通知" "测试通知" '["action${i}", "删除"]' "{}" 180000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await agent.aiWaitFor('桌面右下角显示通知横幅', { timeoutMs: 30000 });

    // 验证只显示3条通知：完整横幅不超过3条，更早的通知折叠隐藏（允许出现/不出现折叠提示）
    await agent.aiAssert('桌面右下角通知横幅区域完整显示的横幅不超过3条（即最新的第3、4、5条），更早的第1、2条通知处于折叠隐藏状态、不被完整展示；上方可能出现折叠提示，也可能不出现，关键是完整显示的横幅只有最新3条');

    // 点击最上面一条通知横幅的"删除"按钮使折叠的通知展开：先悬浮再点击
    await agent.aiHover('最上面一条通知横幅', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('最上面一条通知横幅上的"删除"按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 展开折叠的通知信息（之前被隐藏的通知重新显示出来），横幅仍保持3条
    await agent.aiAssert('桌面右下角通知横幅区域仍然显示3条通知');
  }, { timeout: 600000, tags: ['1870815', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
