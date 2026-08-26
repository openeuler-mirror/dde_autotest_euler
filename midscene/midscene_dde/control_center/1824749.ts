
/**
 * 用例 PMSID: 1824749
 * 用例标题: 【控制中心】【系统】【语言和区域】设置货币负数为-1.1¥
 * 生成时间: 2026-01-29 19:31:31
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1824749-【控制中心】【系统】【语言和区域】设置货币负数为-1.1¥', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824749-【控制中心】【系统】【语言和区域】设置货币负数为-1.1¥', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    await agent.aiTap("'货币负数'区域的ˇ符号");
    await agent.aiTap("货币负数下拉框中的[-1.1¥]选项",{ deepThink: true });
    //验证货币负数修改为-1.1¥
    await agent.aiAssert("货币负数显示为-1.1¥");
  }, { timeout: 600000, tags: ['1824749', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤 : 恢复窗口
    await device.pressKey("Super", "Down")
    await uos.closeCurrentWindow();
    //还原货币负数默认值为'¥-1.1'
    await system.exec("busctl --user call org.deepin.dde.Format1 /org/deepin/dde/Format1 org.freedesktop.DBus.Properties Set ssv 'org.deepin.dde.Format1' 'NegativeCurrencyFormat' s '¥-1.1'");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
