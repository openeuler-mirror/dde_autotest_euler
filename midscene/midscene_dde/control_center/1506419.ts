/**
 * 用例 PMSID: 1506419
 * 用例标题: 【控制中心】【通知】系统通知勿扰模式开关默认关闭
 * 生成时间: 2025-12-11 20:13:20
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506419-【控制中心】【通知】系统通知勿扰模式开关默认关闭', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506419-【控制中心】【通知】系统通知勿扰模式开关默认关闭', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });

      // 步骤 2: 点击系统
      await agent.aiTap("点击系统");

      // 步骤 3: 点击常用设置中的通知选项
      await agent.aiTap("点击常用设置中的通知选项");
      await agent.aiWaitFor("通知页面已显示");

      // 检查: 导航栏显示为：系统 / 通知，启用勿扰模式”开关默认关闭
      await agent.aiAssert("导航栏显示为：系统 / 通知");
      await agent.aiAssert("通知管理中存在选项：勿扰模式");
      await agent.aiAssert("“启用勿扰模式”开关默认关闭");
      
    }, { timeout: 1200000, tags: ["1506419","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  