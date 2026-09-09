/**
 * 用例 PMSID: 1830359
 * 用例标题:【任务栏】【应用区域】右键菜单操作-强制退出
 * 生成时间: 2026-1-19 14:15:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1830359-【任务栏】【应用区域】右键菜单操作-强制退出', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1830359-【任务栏】【应用区域】右键菜单操作-强制退出', async ({ device, agent, uos }) => {
      // 步骤 1: 打开计算器
      await uos.openApp("计算器");
      await agent.aiWaitFor("计算器被打开");

      // 步骤 2: 鼠标右键计算器选择强制退出
      await agent.aiRightClick("任务栏应用区域计算器图标", { deepThink: true });
      await agent.aiTap("强制退出", { deepThink: true });

      //检查: 计算器被关闭
      await agent.aiAssert("计算器被关闭");
  
    }, { timeout: 1200000, tags: ["1830359", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
