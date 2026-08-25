/**
 * 用例 PMSID: 1696247
 * 用例标题: 【控制中心】【电源管理】【通用】节能设置中低电量时自动开启节能模式默认值检查 
 * 生成时间: 2025-12-18 20:30:11
 * 用例编写人:UT000511(肖海燕)
 */

describe('1696247-【控制中心】【电源管理】【通用】节能设置中低电量时自动开启节能模式默认值检查 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1696247-【控制中心】【电源管理】【通用】节能设置中低电量时自动开启节能模式默认值检查 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击通用
      await agent.aiTap("通用");

      // 步骤 4: 检查低电量时自动开启节能模式后面的开关为开
      await agent.aiAssert("低电量时自动开启节能模式后面的开关为开");

      // 检查 : 低电量阈值 (默认值为20%)
      await agent.aiAssert("低电量阈值 (默认值为20%)");
  
    }, { timeout: 1200000, tags: ["1696247","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  