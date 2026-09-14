/**
 * 用例 PMSID: 1504267
 * 用例标题:【任务栏】【托盘区域】【飞行模式】拖拽飞行模式图标到任务栏  
 * 生成时间: 2025-12-17 11:30:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504267-【任务栏】【托盘区域】【飞行模式】拖拽飞行模式图标到任务栏', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504267-【任务栏】【托盘区域】【飞行模式】拖拽飞行模式图标到任务栏', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 拖拽【飞行模式】图标到任务栏托盘区域
      await agent.aiAction("拖拽UOS系统控制中心快捷面板内, 飞行模式面板到任务栏托盘区域");
      await agent.aiAssert("任务栏托盘区域存在灰色的飞行模式图标");
  
    }, { timeout: 1200000, tags: ["1504267", "level1", "smoke"] });
  
    afterEach(async ({ device, agent }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await agent.aiRightClick("UOS系统控制中心快捷面板内, 飞行模式", { deepThink: true });
      await agent.aiTap("在任务栏上移除", { deepThink: true });
      await agent.aiAssert("任务栏托盘区域不存在灰色的飞行模式图标");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });