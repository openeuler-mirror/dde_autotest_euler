/**
 * 用例 PMSID: 1503719
 * 用例标题:【任务栏】【快捷面板】【网络】快捷面板网络面板入口
 * 生成时间: 2025-12-17 09:28:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1503719-【任务栏】【快捷面板】【网络】快捷面板网络面板入口', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1503719-【任务栏】【快捷面板】【网络】快捷面板网络面板入口', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 点击快捷面板网络图标
      await agent.aiTap("UOS系统控制中心快捷面板内, 网络面板", { deepThink: true });

      //检查: 打开任务栏网络面板，快捷面板自动关闭，关闭过程衔接流畅
      await agent.aiAssert("任务栏网络面板被打开");
  
    }, { timeout: 1200000, tags: ["1503719", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });