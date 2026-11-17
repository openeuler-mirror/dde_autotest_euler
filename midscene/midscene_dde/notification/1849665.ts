/**
 * 用例 PMSID: 1849665
 * 用例标题: 【通知中心】常驻通知信息，锁屏后不会消失
 * 生成时间: 2026-09-03 20:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849665-【通知中心】常驻通知信息，锁屏后不会消失', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1849665-【通知中心】常驻通知信息，锁屏后不会消失', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 1: 通过 dbus 接口发送多条常驻通知（expire_timeout=0 表示常驻不消失）
    for (let i = 1; i <= 2; i++) {
      await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "常驻锁屏测试应用${i}" 0 "" "常驻锁屏测试${i}" "锁屏后不应消失" '["action${i}", "按钮${i}"]' "{}" 0`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await agent.aiWaitFor('桌面右下角出现两条通知横幅，标题为"常驻锁屏测试1"和"常驻锁屏测试2"', { timeoutMs: 20000 });

    // 步骤 2: 锁屏后重新进入桌面（锁屏快捷键 Super+L）
    await device.pressKey('Super', 'L');
    await agent.aiWaitFor('锁屏界面已显示（有时间、用户头像和密码输入框）', { timeoutMs: 20000 });
    // 锁屏界面停留10秒便于观察，并截图记录到测试报告
    await agent.logScreenshot('锁屏界面');
    // 输入密码解锁，重新进入桌面
    await device.typeAscii(passWord);
    await device.pressKey('Enter');

    // 检查: 常驻通知横幅不会消失，仍然展示在桌面上
    await agent.aiAssert('桌面右下角仍然展示两条常驻通知横幅，标题为"常驻锁屏测试1"和"常驻锁屏测试2"，锁屏后横幅没有消失', { timeoutMs: 15000 });
  }, { timeout: 600000, tags: ['1849665', 'level3'] });

  afterEach(async ({ device, agent, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 防止残留锁屏状态：先判断当前是否在锁屏界面，不在则无需解锁
    const isLocked = async () => {
      try {
        return await agent.aiBoolean('当前屏幕是否为锁屏界面（有时间、用户头像和密码输入框）', { deepThink: true });
      } catch (e) {
        console.log('锁屏状态判断失败:', e.message);
        return true; // 判断失败时按仍锁屏处理，进入解锁流程
      }
    };
    if (!(await isLocked())) {
      console.log('当前不在锁屏界面，无需解锁');
      return;
    }
    for (let attempt = 1; attempt <= 2; attempt++) {
      console.log(`检测到锁屏界面，第${attempt}次尝试解锁`);
      try {
        await device.typeAscii(env.testPassword || process.env.TEST_PASSWORD || '');
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) { /* continue */ }
      if (!(await isLocked())) {
        console.log('解锁成功');
        return;
      }
    }
    // 密码解锁失败时兜底清理
    console.log('密码解锁未成功，执行killall兜底');
    await system.exec('killall dde-lock 2>/dev/null || true');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-lock 2>/dev/null || true');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    await uos.showDesktop();
  });
});
