/**
 * 用例 PMSID: 1504217
 * 用例标题:【任务栏】【快捷面板】【护眼模式】通过右键菜单进入护眼模式设置
 * 生成时间: 2025-12-17 09:20:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504217-【任务栏】【快捷面板】【护眼模式】通过右键菜单进入护眼模式设置', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504217-【任务栏】【快捷面板】【护眼模式】通过右键菜单进入护眼模式设置', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 鼠标右键护眼模式
      await agent.aiRightClick("UOS系统控制中心快捷面板内，护眼模式", { deepThink: true });

      // 步骤 3: 点击显示设置
      await agent.aiTap("显示设置", { deepThink: true });

      //检查: 跳转到控制中心--显示--护眼模式，右键菜单即时消失
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiAssert("系统 / 显示");
      await agent.aiAssert("快捷设置面板消失");      
  
    }, { timeout: 1200000, tags: ["1504217", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });