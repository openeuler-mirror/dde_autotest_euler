
/**
 * 用例 PMSID: 1824763
 * 用例标题: 【控制中心】【系统】【语言和区域】设置小数点为[.]
 * 生成时间: 2026-01-22 19:40:31
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1824763-【控制中心】【系统】【语言和区域】设置小数点为[.]', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824763-【控制中心】【系统】【语言和区域】设置小数点为[.]', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    await agent.aiAssert("导航栏显示：系统 / 语言和区域");
    // 步骤 3：设置小数点为空格
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format decimalSymbol -v ' '`);
    await agent.aiTap("'小数点'区域的ˇ符号");
    await agent.aiTap("小数点下拉框中的[.]选项");
    //验证小数点修改为.，小数点默认值为.
    await agent.aiAssert("小数点显示为[.]");
  }, { timeout: 600000, tags: ['1824763', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤 : 恢复窗口
    await device.pressKey("Super", "Down")
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
