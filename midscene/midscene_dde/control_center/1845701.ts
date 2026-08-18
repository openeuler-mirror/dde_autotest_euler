/**
 * 用例 PMSID: 1845701
 * 用例标题: 【控制中心】【系统】【语言和区域】【区域格式】区域格式为简体中文时，短时间时间格式取值范围检查
 * 生成时间: 2026-06-09 19:35:20
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1845701-【控制中心】【系统】【语言和区域】【区域格式】区域格式为简体中文时，短时间时间格式取值范围检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1845701-【控制中心】【系统】【语言和区域】【区域格式】区域格式为简体中文时，短时间时间格式取值范围检查', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    // 步骤 3: 点击区域格式子设置项短时间下拉框
    await agent.aiTap("'短时间'区域的ˇ符号");
    // 验证短时间设置选项正常显示
    await agent.aiAssert("短时间下拉框显示所有选项：HH:mm、H:mm、上午 h:mm、上午 hh:mm");
  }, { timeout: 600000, tags: ['1845701', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤: 恢复窗口大小
    await device.pressKey("Super", "Down");
    // 步骤: 关闭控制中心窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
