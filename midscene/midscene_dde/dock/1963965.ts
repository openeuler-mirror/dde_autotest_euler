/**
 * 用例 PMSID: 1963965
 * 用例标题:【任务栏】【应用区域】单击应用区域图标打开应用
 * 生成时间: 2026-02-05
 * 用例编写人:UT005044(王亮)
 */

describe('1963965-【任务栏】【应用区域】单击应用区域图标打开应用', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1963965-【任务栏】【应用区域】单击应用区域图标打开应用', async ({ device, agent, uos }) => {
      // 步骤 1： 点击任务栏的文件管理器应用图标
      await agent.aiTap("点击任务栏左侧区域上黄色的文件管理器图标", { deepThink: true });

      // 检查 1: 展示文件管理器应用窗口
      await agent.aiWaitFor("文件管理器应用打开");
      await agent.aiAssert("桌面中央位置相对即时展示文件管理器窗口，显示正常，窗口左上角有黄色的文件管理器图标");

      // 步骤 2： 点击任务栏的日历应用图标
      await agent.aiTap("点击任务栏左侧区域上带数字的日历图标", { deepThink: true });

      // 检查 2: 展示日历应用窗口
      await agent.aiWaitFor("日历应用打开");
      await agent.aiAssert("桌面中央位置相对即时展示日历应用窗口，展示当前年月日的信息");

      // 步骤 3： 点击任务栏的控制中心应用图标
      await agent.aiTap("点击任务栏左侧区域上的方形蓝底齿轮状的设置图标", { deepThink: true });

      // 检查 3: 展示控制中心应用窗口
      await agent.aiWaitFor("系统设置应用打开");
      await agent.aiAssert("桌面中央位置相对即时展示系统设置窗口，显示正常，窗口左上角有蓝底齿轮状的设置图标");
  
    }, { timeout: 300000, tags: ["1963965", "level1", "smoke"] });
  
    afterEach(async ({ device,uos }) => {
      console.log('3. afterEach: 每个测试后的清理');
      // 还原环境: 关闭三个应用窗口
      await device.pressKey("Alt", "F4");
      await device.pressKey("Alt", "F4");
      await device.pressKey("Alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
    });
  });
