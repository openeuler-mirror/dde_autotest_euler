
/**
 * 用例 PMSID: 1954473
 * 用例标题: 【控制中心】【系统】【语言和区域】区域格式中，小数点设置为","，检查分隔符列表设置值显示
 * 生成时间: 2026-04-22 19:38:15
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1954473-【控制中心】【系统】【语言和区域】区域格式中，小数点设置为","，检查分隔符列表设置值显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1954473-【控制中心】【系统】【语言和区域】区域格式中，小数点设置为","，检查分隔符列表设置值显示', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    // 步骤 3：设置分隔符为空格
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format digitGroupingSymbol -v '空格'`);
    // 步骤 4：设置小数点为,
    await agent.aiTap("'小数点'区域的ˇ符号");
    await agent.aiTap("小数点下拉框中的','选项", { deepThink: true });
    // 步骤 5：点击分隔符
    await agent.aiTap("'分隔符'区域的ˇ符号");
    // 验证分隔符列表中不包含,
    await agent.aiAssert("分隔符列表中显示 `.`、`'`、`空格`");
    await agent.aiTap("页面空白处");
    //还原设置小数点默认值为'.'，分隔符默认值为','
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format decimalSymbol -v '.'`);
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format digitGroupingSymbol -v ','`);
  }, { timeout: 1200000, tags: ['1954473', 'level3'] });

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
