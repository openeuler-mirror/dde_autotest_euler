/**
 * 用例 PMSID: 1696219
 * 用例标题: 【控制中心】【电源管理】【使用电池】低电量管理设置项默认值检查 
 * 生成时间: 2025-12-11 20:24:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1696219-【控制中心】【电源管理】【使用电池】低电量管理设置项默认值检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1696219-【控制中心】【电源管理】【使用电池】低电量管理设置项默认值检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
       await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击使用电池
      await agent.aiTap("使用电池");

      //检查：导航栏显示：电源管理 / 使用电池，低电量管理设置项默认值
      await agent.aiAssert("导航栏显示：电源管理 / 使用电池");
      await agent.aiAssert("低电量提醒默认值：20%");
      await agent.aiAssert("低电量时默认值：自动休眠");
      await agent.aiAssert("低电量阈值默认值：5%");
  
    }, { timeout: 1200000, tags: ["1696219", "level1", "smoke", "laptop"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  