/**
 * 用例 PMSID: 1502965
 * 用例标题:【任务栏】【快捷面板】【亮度】点击快捷面板的亮度图标
 * 生成时间: 2025-1-20 15:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502965-【任务栏】【快捷面板】【亮度】点击快捷面板的亮度图标', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502965-【任务栏】【快捷面板】【亮度】点击快捷面板的亮度图标', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 打开亮度面板
      await agent.aiTap("UOS系统控制中心快捷面板内，亮度调节条右端的笔记本形状功能按钮", { deepThink: true });
      await agent.aiWaitFor("亮度面板已显示");

      //检查: 亮度面板展示
      await agent.aiAssert("从上到下依次为：<  亮度、屏幕名称(如eDP、HDMI等)、亮度滑块、--> 显示设置(位于最下方且固定位置，不随滑动条改变位置)");
  
    }, { timeout: 1200000, tags: ["1502965", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });