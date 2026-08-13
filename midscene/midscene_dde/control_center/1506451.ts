/**
 * 用例 PMSID: 1506451
 * 用例标题: 【控制中心】【系统】【辅助信息】最终用户许可协议协议内容正常展示 
 * 生成时间: 2026-01-27 10:13:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506451-【控制中心】【系统】【辅助信息】 最终用户许可协议协议内容正常展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506451-【控制中心】【系统】【辅助信息】 最终用户许可协议协议内容正常展示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统-用户许可协议
      await agent.aiTap("系统");
      await agent.aiTap("用户许可协议");
      
      // 检查：界面显示
      await agent.aiAssert("显示系统/用户许可协议");
      await agent.aiAssert("协议内容正常展示");
      
    }, { timeout: 1200000, tags: ["1506451","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  