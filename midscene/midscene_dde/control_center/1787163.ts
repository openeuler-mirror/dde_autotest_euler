/**
 * 用例 PMSID: 1787163
 * 用例标题:  【控制中心】【系统】【时间和日期】关闭自动同步配置 
 * 生成时间: 2025-12-18 20:36:11
 * 用例编写人:UT000511(肖海燕)
 */

describe('1787163-【控制中心】【系统】【时间和日期】关闭自动同步配置', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1787163-【控制中心】【系统】【时间和日期】关闭自动同步配置', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      // 步骤 3: 点击时间和日期
      await agent.aiTap("时间和日期");

      // 步骤4: 关闭自动同步配置开关
      await agent.aiTap("自动同步配置开关");
      
      //检查服务器设置项隐藏，自动同步配置下方显示：系统日期和时间
      await agent.aiAssert("服务器设置项隐藏，自动同步配置下方显示：系统日期和时间");
       
    }, { timeout: 1200000, tags: ["1787163","level2","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("自动同步配置开关");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  