/**
 * 用例 PMSID: 1824771
 * 用例标题: 【控制中心】【系统】【语言和区域】设置分隔符为[.]
 * 生成时间: 2026-05-07 10:30:00
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1824771-【控制中心】【系统】【语言和区域】设置分隔符为[.]', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824771-【控制中心】【系统】【语言和区域】设置分隔符为[.]', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    // 步骤3: 小数点设置为空格
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format decimalSymbol -v '空格'`);
    // 步骤4: 点击分隔符下拉框，切换分隔符为[.]
    await agent.aiTap("'分隔符'区域的ˇ符号");
    await agent.aiTap("分隔符下拉框中的[.]选项",{ deepThink: true });
    // 验证分隔符显示为[.]
    await agent.aiAssert("分隔符显示为[.]");
    // 验证检查数字分组显示
    await agent.aiAssert("数字分组显示为123.456.789");
    // 步骤: 还原分隔符默认值为','
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format digitGroupingSymbol -v ','`);
    // 步骤: 还原小数点默认值为'.'
    await system.exec(`dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.format decimalSymbol -v '.'`);
  }, { timeout: 600000, tags: ['1824771', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 步骤: 恢复窗口大小
    await device.pressKey("Super", "Down")
    // 步骤: 关闭控制中心窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});