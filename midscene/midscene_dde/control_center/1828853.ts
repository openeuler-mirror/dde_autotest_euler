/**
 * 用例 PMSID: 1828853
 * 用例标题: 【控制中心】【系统】【语言和区域】选择地区列表弹窗，点击弹窗外区域，检查弹窗显示
 * 生成时间: 2026-06-09 20:10:00
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1828853-【控制中心】【系统】【语言和区域】选择地区列表弹窗，点击弹窗外区域，检查弹窗显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1828853-【控制中心】【系统】【语言和区域】选择地区列表弹窗，点击弹窗外区域，检查弹窗显示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    // 步骤 3: 点击地区下拉框
    await agent.aiTap("'地区'区域的ˇ符号");
    // 步骤 4: 点击弹框外区域(非桌面)
    await agent.aiTap("语言和区域界面空白区域");
    // 验证选择地区列表弹窗消失
    await agent.aiAssert("选择地区列表弹窗已消失");
    // 步骤: 恢复窗口大小
    await device.pressKey("Super", "Down");
    // 步骤 5: 再次点击地区下拉框
    await agent.aiTap("'地区'区域的ˇ符号");
    // 步骤 6: 点击桌面
    await agent.aiTap("桌面空白区域");
    // 验证选择地区列表弹窗消失
    await agent.aiAssert("选择地区列表弹窗已消失");
  }, { timeout: 600000, tags: ['1828853', 'level3'] });

  afterEach(async ({ device, uos, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤: 关闭控制中心窗口
    await agent.aiTap("区域");
    await device.pressKey("ALT", "F4");
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
