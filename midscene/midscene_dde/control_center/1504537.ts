/**
 * 用例 PMSID: 1504537
 * 用例标题: 控制中心】【系统】【用户体验计划】加入用户体验计划 开启和关闭生效正常
 * 生成时间: 2026-01-28 
 * 用例编写人:UT005571(王艺桥)
 */

describe('1504537-【控制中心】【系统】【用户体验计划】加入用户体验计划 开启和关闭生效正常', () => {
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
    
    // 用户体验计划设置为开启
    console.log('   - 将用户体验计划设置为开启状态（测试默认开启）');
    const dbusOpenCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1 /org/deepin/dde/EventLog1 org.deepin.dde.EventLog1.Enable boolean:true`;
    await system.exec(dbusOpenCmd);
    // 等待D-Bus状态同步
    await agent.aiWaitFor(1000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1504537-【控制中心】【系统】【用户体验计划】加入用户体验计划 开启和关闭生效正常', async ({ device, agent, uos }) => {
    //===== 第二步：执行核心测试逻辑 =====
    console.log('4. 执行核心测试步骤');
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("辅助信息下方：用户体验计划");
    // 步骤1：关闭用户体验计划开关
    await agent.aiTap("加入用户体验计划的开关按钮");
    await agent.aiAssert("未出现授权窗口");
    await agent.aiAssert("加入用户体验计划开关为关闭状态");

    // 步骤2：开启用户体验计划开关
    await agent.aiTap("加入用户体验计划的开关按钮");
    await agent.aiWaitFor("隐私协议弹窗已显示");
    await agent.aiAssert("隐私协议弹窗已显示");
    await agent.aiAssert("用户体验计划开关为开启状态");

    // 步骤3：不勾选同意勾选框，点击确定无反应
    await agent.aiTap("确定按钮");
    await agent.aiAssert("统信操作系统用户体验计划许可协议窗口存在");

    // 步骤4：勾选同意，确定按钮可以点击
    await agent.aiTap("同意并加入用户体验计划文案前小方框",{ deepThink: true });
    await agent.aiAssert("确定按钮底色和取消按钮底色相同");

    // 步骤5：点击确定
    await agent.aiTap("确定按钮")
    await agent.aiAssert("https://www.uniontech.com/agreement/experience - cn的下方区域是空白，无其他文案");
    await agent.aiAssert("用户体验计划开关为开启状态");

  }, { timeout: 600000, tags: ['1504537', 'level3'] });
  afterEach(async ({ device,agent, system }) => {
    console.log('6. afterEach: 每个测试后的清理');
    // 关闭控制中心，清理环境
    await device.pressKey("super", "Down");
    await device.pressKey("alt", "F4");
    // ===== 恢复原始环境 =====
    console.log(`   - 恢复到系统原始状态：${originalSwitchState ? '开启' : '关闭'}`);
    const dbusRestoreCmd = `dbus-send --session --print-reply --dest=org.deepin.dde.EventLog1 /org/deepin/dde/EventLog1 org.deepin.dde.EventLog1.Enable boolean:${originalSwitchState}`;
    await system.exec(dbusRestoreCmd);
    // 等待状态同步
    await agent.aiWaitFor(500);
  });

  afterAll(async ({ uos }) => {
    console.log('7. afterAll: 清理测试套件');
  });
});