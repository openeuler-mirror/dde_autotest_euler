/**
 * 用例 PMSID: 1506649
 * 用例标题: 【控制中心】【电源管理】【通用】关闭节能模式
 * 生成时间: 2025-12-11 20:02:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506649-【控制中心】【电源管理】【通用】关闭节能模式', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();

      // 性能模式中选择 节能模式
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap("电源管理");
      await agent.aiTap("通用");
      await agent.aiTap("性能模式中选择 节能模式");
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506649-【控制中心】【电源管理】【通用】关闭节能模式', async ({ device, agent, uos }) => {
      // 步骤 1: 性能模式中选择 平衡模式
      await agent.aiTap("性能模式中选择 平衡模式");

      //检查：平衡模式勾选成功，低电量时自动开启节能模式开关为关闭状态，使用电池时自动开启节能模式开关为关闭状态
      await agent.aiAssert("平衡模式勾选成功");
      await agent.aiAssert("低电量时自动开启节能模式开关为关闭状态");
      await agent.aiAssert("使用电池时自动开启节能模式开关为关闭状态");
  
    }, { timeout: 1200000, tags: ["1506649","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("打开低电量时自动开启节能模式开关");
      await agent.aiAssert("低电量时自动开启节能模式开关为开");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  