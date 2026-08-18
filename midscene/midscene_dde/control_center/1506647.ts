/**
 * 用例 PMSID: 1506647
 * 用例标题: 【控制中心】【电源管理】【通用】开启节能模式
 * 生成时间: 2025-12-11 20:04:19
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506647-【控制中心】【电源管理】【通用】开启节能模式', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506647-【控制中心】【电源管理】【通用】开启节能模式', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击通用
      await agent.aiTap("通用");

      // 步骤 4: 性能模式中选择 节能模式
      await agent.aiTap("性能模式中选择 节能模式");

      //检查：节能模式勾选成功，低电量时自动开启节能模式开关为关闭状态，使用电池时自动开启节能模式开关为关闭状态
      await agent.aiAssert("节能模式勾选成功");
      await agent.aiAssert("低电量时自动开启节能模式开关为关闭状态");
      await agent.aiAssert("使用电池时自动开启节能模式开关为关闭状态");
  
    }, { timeout: 1200000, tags: ["1506647","level2","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("性能模式中选择 平衡模式");
      await agent.aiTap("打开低电量时自动开启节能模式开关");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  