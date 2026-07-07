/**
 * 用例 PMSID: 1909145
 * 用例标题:【控制中心】【系统】【语言和区域】区域格式设置中，检查示例的默认值
 * 生成时间: 2025-12-17 17:02:08
 * 用例编写人:ut003072
 */

describe('1909145-【控制中心】【系统】【语言和区域】区域格式设置中，检查示例的默认值', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1909145-【控制中心】【系统】【语言和区域】区域格式设置中，检查示例的默认值', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击系统
      await agent.aiTap("系统", { deepThink: true });

      // 步骤 3: 点击语言和区域
      await agent.aiTap("语言和区域");
      await agent.aiAssert("导航栏显示：系统 / 语言和区域");

      // 检查：示例的默认值：¥123,456,789.00    ¥-123,456,789.00
      await agent.aiAssert("示例: ¥123,456,789.00    ¥-123,456,789.00");

    }, { timeout: 1200000, tags: ['1909145', 'level2', 'smoke'] });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 步骤 : 恢复窗口
      await device.pressKey("Super", "Down")
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });