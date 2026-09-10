/**
 * 用例 PMSID: 1504255
 * 用例标题:【任务栏】【托盘区域】【护眼模式】从护眼模式面板&quot;护眼模式设置&quot;进入控制中心
 * 生成时间: 2025-12-16 17:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504255-【任务栏】【托盘区域】【护眼模式】从护眼模式面板&quot;护眼模式设置&quot;进入控制中心', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504255-【任务栏】【托盘区域】【护眼模式】从护眼模式面板&quot;护眼模式设置&quot;进入控制中心', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 点击护眼模式
      await agent.aiTap("护眼模式", { deepThink: true });
      await agent.aiTap("显示设置", { deepThink: true });

      //检查: 跳转至控制中心-系统-显示三级菜单
      await device.delay(3000);
      await agent.aiAssert("系统 / 显示");
  
    }, { timeout: 1200000, tags: ["1504255", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });