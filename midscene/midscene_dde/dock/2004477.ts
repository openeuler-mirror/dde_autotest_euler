/**
 * 用例 PMSID: 2004477
 * 用例标题:【任务栏】【应用区域】新安装系统应用区域图标默认展示
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('2004477-【任务栏】【应用区域】新安装系统应用区域图标默认展示', () => {
    beforeAll(async ({ device, uos, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('2004477-【任务栏】【应用区域】新安装系统应用区域图标默认展示', async ({ device, agent, uos }) => {
      // 检查 1: 任务栏的默认应用图标
      await agent.aiAssert("底部任务栏的应用区域存在8个图标：黄色的文件管理器，方形蓝色的应用商店，圆形蓝白相间的浏览器，信封图形的邮箱，带数字的日历，绿色文本形的文本编辑器，带运算符号的计算器，齿轮状的控制中心");

      // 检查 2: hover到文件管理器
      await agent.aiHover("底部任务栏上黄色文件夹的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：文件管理器");

      // 检查 3： hover到应用商店
      await agent.aiHover("底部任务栏上方形蓝色的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：应用商店");

      // 检查 4： hover到浏览器
      await agent.aiHover("底部任务栏上圆形蓝白相间的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：浏览器");

      // 检查 5： hover到邮箱
      await agent.aiHover("底部任务栏上信封图形的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：邮箱");
  
      // 检查 6： hover到日历
      await agent.aiHover("底部任务栏上数字日历形的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：日历");

      // 检查 7： hover到文本编辑器
      await agent.aiHover("底部任务栏上绿色文本带笔形的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：文本编辑器");

      // 检查 8： hover到计算器
      await agent.aiHover("底部任务栏上带运算符号的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：计算器");

      // 检查 9： hover到控制中心
      await agent.aiHover("底部任务栏上蓝底齿轮状的图标", { deepThink: true });
      await agent.aiAssert("任务栏上方展示TIPS文案：控制中心");

    }, { timeout: 600000, tags: ["2004477", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
