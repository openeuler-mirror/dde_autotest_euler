/**
 * 用例 PMSID: 1504257
 * 用例标题:【任务栏】【快捷面板】【飞行模式】入口检查
 * 生成时间: 2025-12-17 09:13:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504257-【任务栏】【快捷面板】【飞行模式】入口检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504257-【任务栏】【快捷面板】【飞行模式】入口检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      //检查: 飞行模式图标默认关闭，文案为“飞行模式”
      await agent.aiAssert("飞行模式图标默认关闭未被点亮，文案为“飞行模式”");
  
    }, { timeout: 1200000, tags: ["1504257", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });