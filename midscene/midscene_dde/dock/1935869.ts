/**
 * 用例 PMSID: 1935869
 * 用例标题:【任务栏】【应用区域】应用图标右键功能-关闭所有
 * 生成时间: 2026-1-20 14:20:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1935869-【任务栏】【应用区域】应用图标右键功能-关闭所有', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1935869-【任务栏】【应用区域】应用图标右键功能-关闭所有', async ({ device, agent, uos }) => {
      // 步骤 1： 打开三个文件管理器窗口
      for (let index = 0; index < 3; index++) {
        await uos.openApp("文件管理器");
      }

      // 步骤 2: 鼠标右键文件管理器选择关闭所有
      await agent.aiRightClick("任务栏应用区域文件管理器图标", { deepThink: true });
      await agent.aiTap("关闭所有", { deepThink: true });

      //检查: 文件管理器都被关闭
      await agent.aiAssert("文件管理器被关闭");
  
    }, { timeout: 1200000, tags: ["1935869", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
