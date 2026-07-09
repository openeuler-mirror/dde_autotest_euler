/**
 * 用例 PMSID: 1954467
 * 用例标题: 【控制中心】【系统】【语言和区域】区域格式中，小数点设置为"空格"，切换区域格式中分隔符为"空格"的区域，检查小数点显示
 * 生成时间: 2026-06-09 20:04:00
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1954467-【控制中心】【系统】【语言和区域】区域格式中，小数点设置为"空格"，切换区域格式中分隔符为"空格"的区域，检查小数点显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1954467-【控制中心】【系统】【语言和区域】区域格式中，小数点设置为"空格"，切换区域格式中分隔符为"空格"的区域，检查小数点显示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp('控制中心', 2000, 20000, true);
    await agent.aiWaitFor('语言和区域');

    // 步骤 2: 点击语言和区域
    await agent.aiTap('语言和区域');
    await agent.aiWaitFor('区域格式');

    // 步骤 3: 设置小数点为"空格"
    await agent.aiTap("'小数点'区域的ˇ符号");
    await agent.aiTap("小数点下拉框中的`空格`选项", { deepThink: true });

    // 步骤 4: 点击区域格式下拉框
    await agent.aiTap('区域格式下拉框');

    // 步骤 5: 选择斯洛伐克语(斯洛伐克)
    await agent.aiTap('搜索框');
    await device.typeText('斯洛伐克');
    await agent.aiTap('斯洛伐克语(斯洛伐克)');

    // 步骤 6: 点击保存按钮
    await agent.aiTap('保存');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 检查: 分隔符为"空格"
    await agent.aiAssert('分隔符显示为空格');

    // 检查: 小数点自动切换为"."
    await agent.aiAssert('小数点显示为.');
  }, { timeout: 600000, tags: ['1954467', 'level3'] });

  afterEach(async ({ device, uos, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 区域格式切回中文(中国)
    await agent.aiTap('区域格式下拉框');
    await agent.aiTap('搜索框');
    await device.typeText('中文');
    await agent.aiTap('中文(中国)');
    await agent.aiTap('保存');
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 恢复窗口
    await device.pressKey('Super', 'Down');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});