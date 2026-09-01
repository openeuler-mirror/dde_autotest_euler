
/**
 * 用例 PMSID: 1824765
 * 用例标题: 【控制中心】【系统】【语言和区域】设置分隔符为[空格]
 * 生成时间: 2026-01-22 21:05:59
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1824765-【控制中心】【系统】【语言和区域】设置分隔符为[空格]', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1824765-【控制中心】【系统】【语言和区域】设置分隔符为[空格]', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiWaitFor("语言和区域");
    // 步骤 2: 点击语言和区域
    await agent.aiTap("语言和区域");
    await agent.aiWaitFor("区域格式");
    await agent.aiAssert("导航栏显示：系统 / 语言和区域");
    await agent.aiTap("'分隔符'区域的ˇ符号");
    await agent.aiTap("分隔符下拉框中的[空格]选项");
    //验证分隔符修改为空格
    await agent.aiAssert("分隔符显示为[空格]");
    //验证数字分组为123 456 789
    await agent.aiAssert("数字分组显示为[123 456 789]");
    //还原设置分隔符默认值为','
    await system.exec("busctl --user call org.deepin.dde.Format1 /org/deepin/dde/Format1 org.freedesktop.DBus.Properties Set ssv 'org.deepin.dde.Format1' 'DigitGroupingSymbol' s ','");
  }, { timeout: 600000, tags: ['1824765', 'level3'] });

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
