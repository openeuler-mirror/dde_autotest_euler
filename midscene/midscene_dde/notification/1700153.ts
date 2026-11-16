/**
 * 用例 PMSID: 1700153
 * 用例标题: 【控制中心】【通知】设置通知横幅展示数量为“2条”，检查桌面和锁屏横幅通知
 * 生成时间: 2026-07-18 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1700153-【控制中心】【通知】设置通知横幅展示数量为“2条”，检查桌面和锁屏横幅通知', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('确保任务栏在底部');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1700153-设置通知横幅展示数量为2条，检查桌面和锁屏横幅通知', async ({ device, agent, system, env }) => {
    await system.exec('killall notify-osd 2>/dev/null; true');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k bubbleCount -v 2');
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send "通知信息测试" "第${i}条通知" -t 20000`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await new Promise(resolve => setTimeout(resolve, 3000));

    await agent.aiAssert('可见2条通知横幅，内容分别包含"第4条通知""第5条通知"，其他通知折叠起来');

    await device.pressKey('Super', 'L');
    await new Promise(resolve => setTimeout(resolve, 3000));

    for (let i = 6; i <= 10; i++) {
      await system.exec(`notify-send "锁屏通知${i}" "第${i}条消息" -t 20000`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

    await agent.aiAssert('锁屏界面没有通知横幅信息展示');
  }, { timeout: 300000, tags: ['1700153', 'level3'] });

  afterEach(async ({ device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await device.typeAscii(env.testPassword);
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) { /* continue */ }
    }
    await system.exec('killall dde-lock 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:Position variant:int32:2');
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      await system.exec('killall dde-lock 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) { /* ignore */ }

    console.log('恢复bubbleCount默认值为3');
    await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k bubbleCount -v 3');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
