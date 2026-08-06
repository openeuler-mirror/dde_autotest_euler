/**
 * 用例 PMSID: 1504539
 * 用例标题: 【控制中心】【系统】【用户体验计划】用户体验计划 隐私协议取消
 * 生成时间: 2026-01-21 21:32:42
 * 用例编写人:UT005571(王艺桥)
 */

describe('1504539-【控制中心】【系统】【用户体验计划】用户体验计划 隐私协议取消', () => {
  // 定义变量，记录测试前的原始开关状态
  let originalSwitchState = false;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 通过D-Bus查询用户体验计划原始状态
    const dbusQueryCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1   /org/deepin/dde/EventLog1   org.freedesktop.DBus.Properties.Get   string:org.deepin.dde.EventLog1 string:Enabled`;
    const queryResult = await system.exec(dbusQueryCmd);
    // 解析返回结果中的boolean值
    originalSwitchState = queryResult.stdout.includes('boolean true');
    console.log(`   - D-Bus查询原始状态：${originalSwitchState ? '开启' : '关闭'}`);
    
    // 如果原始状态为开启，通过D-Bus关闭
    if (originalSwitchState) {
      console.log('   - 原始状态为开启，执行D-Bus关闭操作');
      const dbusCloseCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1 /org/deepin/dde/EventLog1 org.deepin.dde.EventLog1.Enable boolean:false`;
      await system.exec(dbusCloseCmd);
      // 等待D-Bus状态同步
      await agent.aiWaitFor(3000);
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1504539-【控制中心】【系统】【用户体验计划】用户体验计划 隐私协议取消', async ({ device, agent, uos }) => {
    //===== 第二步：执行核心测试逻辑 =====
    console.log('4. 执行核心测试步骤');
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("辅助信息下方：用户体验计划");
    await agent.aiTap("加入用户体验计划的开关按钮");
    await agent.aiWaitFor("隐私协议弹窗已显示");
    await agent.aiAssert("隐私协议弹窗已显示");
    await agent.aiAssert("用户体验计划开关为开启状态");
    await agent.aiWaitFor("隐私协议窗口已显示");
    await agent.aiTap("隐私协议窗口右上角x按钮");
    await agent.aiAssert("隐私协议窗口消失");
    await agent.aiAssert("开关为关闭状态");
    // 关闭控制中心，清理环境
    await device.pressKey("super", "Down");
    await device.pressKey("alt", "F4");

  }, { timeout: 600000, tags: ['1504539', 'level3'] });

  afterEach(async ({ device,agent, system }) => {
    console.log('6. afterEach: 每个测试后的清理');
    // ===== 恢复原始环境 =====
    if (originalSwitchState) {
      console.log('   - 原始状态为开启，执行D-Bus恢复开启操作');
      const dbusRestoreCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1 /org/deepin/dde/EventLog1 org.deepin.dde.EventLog1.Enable boolean:true`;
      await system.exec(dbusRestoreCmd);
      // 等待状态同步
      await agent.aiWaitFor(2000);
    } else {
      console.log('   - 原始状态为关闭，无需恢复');
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('7. afterAll: 清理测试套件');
    // 兜底恢复：确保最终状态与原始一致
    if (originalSwitchState) {
      const dbusRestoreCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1 /org/deepin/dde/EventLog1 org.deepin.dde.EventLog1.Enable boolean:true`;
      await system.executeCommand(dbusRestoreCmd);
    }

  });
});


