/**
 * 用例 PMSID: 1787161
 * 用例标题: 【控制中心】【系统】【时间和日期】开启自动同步配置 
 * 生成时间: 2025-12-19 13：55：11
 * 用例编写人:UT000511(肖海燕)
 */

describe('1787161-【控制中心】【系统】【时间和日期】开启自动同步配置', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1787161-【控制中心】【系统】【时间和日期】开启自动同步配置', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      // 步骤 3: 点击时间和日期
      await agent.aiTap("时间和日期");

      //检查自动同步配置开关默认状态为开
      await agent.aiAssert("自动同步配置开关为打开状态");
      await agent.aiAssert("显示服务器设置项");
       
    }, { timeout: 1200000, tags: ["1787161","level2","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  