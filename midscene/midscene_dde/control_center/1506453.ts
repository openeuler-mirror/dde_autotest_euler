/**
 * 用例 PMSID: 1506453
 * 用例标题: 【控制中心】【系统】【辅助信息】 隐私政策协议内容正常展示
 * 生成时间: 2026-01-27 19:53:27
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506453-【控制中心】【系统】【辅助信息】 隐私政策协议内容正常展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506453-【控制中心】【系统】【辅助信息】 隐私政策协议内容正常展示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统-隐私政策
      await agent.aiTap("系统");
      await agent.aiTap("隐私政策");
      
      // 检查：页面正常打开，隐私政策内容正常展示
      await agent.aiAssert("系统 / 隐私政策");
      await agent.aiAssert("隐私政策内容正常展示");
      
    }, { timeout: 600000, tags: ["1506453","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  