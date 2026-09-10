/**
 * 用例 PMSID: 1504213
 * 用例标题:【任务栏】【快捷面板】【护眼模式】护眼模式右键菜单检查
 * 生成时间: 2025-1-21 16:45:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504213-【任务栏】【快捷面板】【护眼模式】护眼模式右键菜单检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504213-【任务栏】【快捷面板】【护眼模式】护眼模式右键菜单检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 鼠标右键护眼模式
      await agent.aiRightClick("UOS系统控制中心快捷面板内，护眼模式模块（眼睛图标）", { deepThink: true });

      // 检查： 弹出护眼模式右键菜单
      await agent.aiAssert("开启护眼模式, 显示设置, 在任务栏上驻留");

      // 步骤 3: 打开护眼模式后右键护眼模式菜单
      await agent.aiTap("开启护眼模式", { deepThink: true });
      await agent.aiRightClick("UOS系统控制中心快捷面板内，护眼模式模块（眼睛图标）", { deepThink: true });
      
      // 检查： 弹出护眼模式右键菜单
      await agent.aiAssert("关闭护眼模式, 显示设置, 在任务栏上驻留");      

    }, { timeout: 1200000, tags: ["1504213", "level3"] });
  
    afterEach(async ({ agent, device }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await agent.aiTap("关闭护眼模式");
      await agent.aiAssert("护眼模式已关闭");   
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });