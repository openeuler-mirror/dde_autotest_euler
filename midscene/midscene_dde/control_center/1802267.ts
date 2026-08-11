/**
 * 用例 PMSID: 1802267
 * 用例标题: 【控制中心】【电源管理】【使用电源】按电源按钮时设置项检查 
 * 生成时间: 2025-12-10 15:10:26
 * 用例编写人:UT000511(肖海燕)
 */

describe('1802267-【控制中心】【电源管理】【使用电源】按电源按钮时设置项检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1802267-【控制中心】【电源管理】【使用电源】按电源按钮时设置项检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp('控制中心', { maximizeWindow: true });
     
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理", { deepThink: true });

      // 步骤 3: 点击使用电源
      await agent.aiTap("使用电源");
      await agent.aiAssert("导航栏显示：电源管理 / 使用电源");
    
      // 步骤 4: 点击按电源按钮时’模块下方箭头
      await agent.aiTap("‘按电源按钮时’模块下方箭头");

      //检查: 模块下方箭头检查设置项显示关机、待机、休眠、关闭显示器、进入关机界面（默认选择）、无任何操作
      await agent.aiAssert("下拉页面显示设置项：关机、待机、休眠、关闭显示器、进入关机界面（默认选择）、无任何操作");
  
    }, { timeout: 1200000, tags: ["1802267","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });