/**
 * 用例 PMSID: 1504271
 * 用例标题:【任务栏】【托盘区域】【飞行模式】从飞行模式面板中的&quot;飞行模式设置&quot;进入控制中心
 * 生成时间: 2025-12-16 16:44:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504271-【任务栏】【托盘区域】【飞行模式】从飞行模式面板中的&quot;飞行模式设置&quot;进入控制中心', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504271-【任务栏】【托盘区域】【飞行模式】从飞行模式面板中的&quot;飞行模式设置&quot;进入控制中心', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 鼠标右键飞行模式
      await agent.aiRightClick("UOS系统控制中心快捷面板内，飞行模式", { deepThink: true });

      // 步骤 3: 点击飞行模式设置
      await agent.aiTap("飞行模式设置", { deepThink: true });

      //检查: 跳转至控制中心-网络-飞行模式三级菜单
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiAssert("网络 / 飞行模式");
  
    }, { timeout: 1200000, tags: ["1504271", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });