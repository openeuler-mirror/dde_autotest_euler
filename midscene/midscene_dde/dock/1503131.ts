/**
 * 用例 PMSID: 1503131
 * 用例标题:【任务栏】【固定区域】【日历】打开日历插件面板，再右键点击其它图标或区域时即时消失
 * 生成时间: 2026-1-19 11:25:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1503131-【任务栏】【固定区域】【日历】打开日历插件面板，再右键点击其它图标或区域时即时消失', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();   
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1503131-【任务栏】【固定区域】【日历】打开日历插件面板，再右键点击其它图标或区域时即时消失', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角时间", { deepThink: true });
      await agent.aiWaitFor("日历面板打开");

      // 步骤 2: 鼠标右键点击桌面空白处
      await agent.aiRightClick("桌面空白处", { deepThink: true });

      //检查: 日历面板关闭
      await agent.aiAssert("日历面板关闭");
      await agent.aiAssert("打开桌面右键菜单");
      await agent.aiTap("桌面空白区域");

      // 步骤 3: 鼠标右键点击声音快捷面板
      await agent.aiTap("任务栏右下角时间", { deepThink: true });
      await agent.aiWaitFor("日历面板被打开");
      await agent.aiRightClick("任务栏右下角声音图标", { deepThink: true });

      //检查: 日历面板关闭，展示快捷面板
      await agent.aiAssert("日历面板关闭");
      await agent.aiAssert("打开声音右键菜单")     
  
    }, { timeout: 1200000, tags: ["1503131", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await agent.aiTap("桌面空白区域");
    });
  });
