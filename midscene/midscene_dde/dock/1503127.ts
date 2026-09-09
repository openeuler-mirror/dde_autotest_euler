/**
 * 用例 PMSID: 1503127
 * 用例标题:【任务栏】【快捷面板】【系统监视器】快捷面板打开系统监视器面板
 * 生成时间: 2026-1-19 10:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1503127-【任务栏】【固定区域】【日历】打开日历插件面板，再hover其它图标或区域时保持一直展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();   
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1503127-【任务栏】【固定区域】【日历】打开日历插件面板，再hover其它图标或区域时保持一直展示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角时间", { deepThink: true });
      await agent.aiWaitFor("日历面板已显示");

      // 步骤 2: 鼠标hover到任务栏最右下角显示桌面处
      await agent.aiHover("任务栏最右下角，显示桌面", { deepThink: true });

      //检查: 日历面板保持展示
      await agent.aiAssert("日历面板已显示");

      // 步骤 3: 鼠标hover到其他图标
      await agent.aiHover("任务栏右下角声音图标", { deepThink: true });

      //检查: 日历面板保持展示
      await agent.aiAssert("日历面板已显示");      
  
    }, { timeout: 1200000, tags: ["1503127", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
