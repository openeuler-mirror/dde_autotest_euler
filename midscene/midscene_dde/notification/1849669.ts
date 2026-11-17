/**
 * 用例 PMSID: 1849669
 * 用例标题: 【通知中心】常驻通知信息注销后，不会进入通知中心
 * 生成时间: 2026-09-03 20:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849669-【通知中心】常驻通知信息注销后，不会进入通知中心', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('xdotool key super+d');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1849669-【通知中心】常驻通知信息注销后，不会进入通知中心', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    await system.exec('xdotool key super+d');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 1: 通过 dbus 接口发送多条常驻通知（expire_timeout=0 表示常驻不消失）
    for (let i = 1; i <= 2; i++) {
      await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "常驻注销测试应用${i}" 0 "通知" "常驻注销测试${i}" "注销后不应进入通知中心" '["action${i}", "按钮${i}"]' "{}" 0`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await agent.aiWaitFor('桌面右下角出现两条通知横幅，标题为"常驻注销测试1"和"常驻注销测试2"', { timeoutMs: 20000 });

    // 确定性基线: 常驻通知已产生记录（recordCount作为注销前后对比依据）
    const recordCountCmd = 'gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount';
    const getCount = async () => {
      const r = await system.exec(recordCountCmd);
      return parseInt((r.stdout.match(/uint32 (\d+)/) || [])[1] || '0', 10);
    };
    const beforeLogoutCount = await getCount();
    console.log(`注销前通知记录数: ${beforeLogoutCount}`);

    // 步骤 2: 注销系统，重新进入桌面
    await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
    await agent.aiWaitFor('电源管理界面已显示', { timeoutMs: 60000 });
    await agent.aiTap('注销按钮', { deepThink: true });
    const isBlocked = await agent.aiBoolean('显示以上程序阻止注销');
    if (isBlocked) {
      await agent.aiTap('注销按钮', { deepThink: true });
    }
    await agent.aiWaitFor('登录界面已显示', { timeoutMs: 60000 });
    await agent.aiTap('登录界面的密码输入框', { deepThink: true });
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
    await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });

    // 远程模式下注销重登后新会话初始化期间截图可能为黑屏，轮询等待画面恢复
    for (let i = 0; i < 10; i++) {
      const desktopOk = await agent.aiBoolean('当前屏幕是否显示正常的桌面画面（有任务栏和壁纸，非黑屏、非锁屏、非登录界面）', { deepThink: true });
      if (desktopOk) break;
      await new Promise(resolve => setTimeout(resolve, 4000));
    }

    // 步骤 3: 打开通知中心，查看常驻通知是否进入通知中心
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 确定性验证: 注销后通知记录不应保留（recordCount应为0）
    const afterLoginCount = await getCount();
    console.log(`重新登录后通知记录数: ${afterLoginCount}`);
    if (afterLoginCount > 0) {
      throw new Error(`注销后通知记录未清除: recordCount ${beforeLogoutCount} -> ${afterLoginCount}，常驻通知进入了通知中心`);
    }

    // 通过远端xdotool发送真正的Super+M组合键打开通知中心（runner键盘注入逐键按下会拆散组合键触发启动器）
    await system.exec('xdotool key super+m');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor('屏幕右侧弹出通知中心面板（标题为"通知中心"，显示通知列表或"没有最近的通知"）', { timeoutMs: 10000 });

    // 检查: 常驻通知消失，不会进入通知中心
    await agent.aiAssert('通知中心暂驻区域和常驻区域中都没有标题为"常驻注销测试1"或"常驻注销测试2"的通知信息');
  }, { timeout: 900000, tags: ['1849669', 'level3', 'remote'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('xdotool key Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    await system.exec('xdotool key super+d');
  });
});
