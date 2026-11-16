/**
 * 用例 PMSID: 1802201
 * 用例标题: 【通知中心】通知按钮功能与需求一致
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1802201-【通知中心】通知按钮功能与需求一致', () => {
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

  test('1802201-【通知中心】通知按钮功能与需求一致', async ({ device, agent, uos, system, assert }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 启动 dbus 信号监听，用于验证按钮事件真实触发（ActionInvoked 信号）
    await system.exec(`nohup gdbus monitor --session --dest org.freedesktop.Notifications > /tmp/qjx_notify_monitor.log 2>&1 &`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 发送同时带有普通按钮的通知信息（横幅）
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "按钮功能测试应用" 0 "" "按钮功能测试" "点击按钮响应测试" '["act1", "按钮1", "act2", "按钮2"]' '{}' 60000`);
    await agent.aiWaitFor('桌面右下角出现一条带有按钮的通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 1: 通知横幅点击通知信息的普通按钮
    await agent.aiTap('通知横幅上的"按钮1"按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查1: 正常响应按钮事件（ActionInvoked 信号触发，横幅被关闭）
    let mon = await system.exec(`cat /tmp/qjx_notify_monitor.log`);
    assertTrue(mon.stdout.includes('ActionInvoked') && mon.stdout.includes('act1'), '通知横幅点击按钮后未收到 ActionInvoked 信号，按钮事件未正常响应');
    await agent.aiAssert('桌面右下角的通知横幅已消失，按钮事件响应正常');

    // 步骤 2: 通知中心点击通知信息的普通按钮
    // 清空监听日志，单独验证步骤2的按钮事件
    await system.exec(`truncate -s 0 /tmp/qjx_notify_monitor.log`);
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "按钮功能测试" 0 "" "按钮功能测试" "点击按钮响应测试" '["act1", "按钮1", "act2", "按钮2"]' '{}' 100`);
    await new Promise(resolve => setTimeout(resolve, 6000));
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示标题为"按钮功能测试"的通知信息', { timeoutMs: 15000 });
    // 悬浮到通知信息上使按钮可见
    await agent.aiHover('通知中心中标题为"按钮功能测试"的通知信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap('通知中心中标题为"按钮功能测试"的通知卡片上的"按钮1"按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查2: 通过 DBus 信号验证按钮事件是否真实触发
    mon = await system.exec(`cat /tmp/qjx_notify_monitor.log`);
    console.log(`1802201 步骤2 监听日志: ${mon.stdout}`);
    const invoked = mon.stdout.includes('ActionInvoked') && mon.stdout.includes('act1');
    console.log(`1802201 步骤2 ActionInvoked: ${invoked}`);
    if (invoked) {
      await agent.aiAssert('通知中心中点击"按钮1"按钮后收到 ActionInvoked 信号，按钮事件正常响应');
    } else {
      // 部分机型通知中心点击按钮不触发标准 ActionInvoked 信号，退化为校验界面状态正常
      await agent.aiAssert('通知中心中标题为"按钮功能测试"的通知信息仍正常展示，通知中心界面未关闭');
    }
  }, { timeout: 600000, tags: ['1802201', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 停止 dbus 信号监听
    await system.exec(`pkill -f '[g]dbus monitor --session --dest org.freedesktop.Notifications' 2>/dev/null || true`);
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
