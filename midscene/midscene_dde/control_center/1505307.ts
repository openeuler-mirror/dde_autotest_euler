/**
 * 用例 PMSID: 1505307
 * 用例标题: 【控制中心】【通用】【用户体验计划】开启用户体验计划 隐私协议界面检查
 * 生成时间: 2026-01-28 
 * 用例编写人:UT005571(王艺桥)
 */

describe('1505307-【控制中心】【通用】【用户体验计划】开启用户体验计划 隐私协议界面检查', () => {
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
      await agent.aiWaitFor(1000);
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1505307-【控制中心】【通用】【用户体验计划】开启用户体验计划 隐私协议界面检查', async ({ device, agent, uos }) => {
    //===== 第二步：执行核心测试逻辑 =====
    console.log('4. 执行核心测试步骤');
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("辅助信息下方：用户体验计划");
    // 步骤1： 打开用户体验计划开关
    await agent.aiTap("加入用户体验计划的开关按钮");
    await agent.aiWaitFor("隐私协议弹窗已显示");
    // 检查： 许可协议界面显示
    await agent.aiAssert("标题：统信操作系统用户体验计划许可协议");
    await agent.aiAssert("正文文案与标题文本左对齐");
    await agent.aiAssert("底部按钮：取消和确定");
    await agent.aiTap("确定按钮");
    await agent.aiAssert("统信操作系统用户体验计划许可协议窗口存在");
    await agent.aiTap("取消按钮");
    await agent.aiWaitFor("统信操作系统用户体验计划许可协议弹窗关闭"); 
    await agent.aiAssert("加入用户体验计划开关为关闭状态");

  }, { timeout: 600000, tags: ['1505307', 'level3'] });
  afterEach(async ({ device,agent, system }) => {
    console.log('6. afterEach: 每个测试后的清理');
    // ===== 恢复原始环境 =====
    if (originalSwitchState) {
      console.log('   - 原始状态为开启，执行D-Bus恢复开启操作');
      // 关闭控制中心，清理环境
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
      // 恢复初始状态
      const dbusRestoreCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1 /org/deepin/dde/EventLog1 org.deepin.dde.EventLog1.Enable boolean:true`;
      await system.exec(dbusRestoreCmd);
      // 等待状态同步
      await agent.aiWaitFor(500);
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
    await device.pressKey("super", "Down");
    await device.pressKey("alt", "F4");
  });
});