/**
 * 用例 PMSID: 1502909
 * 用例标题:【任务栏】【快捷面板】【系统监视器】快捷面板打开系统监视器面板
 * 生成时间: 2026-1-19 10:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502909-【任务栏】【快捷面板】【系统监视器】快捷面板打开系统监视器面板', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();   
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502909-【任务栏】【快捷面板】【系统监视器】快捷面板打开系统监视器面板', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 点击系统监视器
      await agent.aiTap("系统监视器图标", { deepThink: true });

      //检查: 系统监视器被打开
      await agent.aiAssert("系统监视器图标被打开");
  
    }, { timeout: 1200000, tags: ["1502909", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
