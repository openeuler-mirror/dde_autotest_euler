
/**
 * 用例 PMSID: 1954487
 * 用例标题: 【控制中心】【系统】【语言和区域】区域格式中，分隔符设置为空格，检查小数点列表设置值显示
 * 生成时间: 2026-04-21 16:53:15
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1954487-【控制中心】【系统】【语言和区域】区域格式中，分隔符设置为空格，检查小数点列表设置值显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1954487-【控制中心】【系统】【语言和区域】区域格式中，分隔符设置为空格，检查小数点列表设置值显示', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    // 步骤 3：设置分隔符为空格
    await agent.aiTap("'分隔符'区域的ˇ符号");
    await agent.aiTap("分隔符下拉框中的[空格]选项");
    // 步骤 4：点击小数点
    await agent.aiTap("'小数点'区域的ˇ符号");
    // 验证小数点列表中不包含空格
    await agent.aiAssert("小数点列表中显示 `.`、`,`、`'`");
    await agent.aiTap("页面空白处");
    //还原设置分隔符默认值为','
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format digitGroupingSymbol -v ','`);
  }, { timeout: 1200000, tags: ['1954487', 'level3'] });

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
