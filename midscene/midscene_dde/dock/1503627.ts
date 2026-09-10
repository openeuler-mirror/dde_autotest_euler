/**
 * 用例 PMSID: 1503627
 * 用例标题:【任务栏】【托盘区域】【网络】任务栏网络面板入口
 * 生成时间: 2025-12-17 10:08:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1503627-【任务栏】【托盘区域】【网络】任务栏网络面板入口', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1503627-【任务栏】【托盘区域】【网络】任务栏网络面板入口', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 点击快捷面板网络图标
      await agent.aiAction("拖拽UOS系统控制中心快捷面板内, 网络面板到任务栏托盘区域");
      await agent.aiAssert("无变化, 任务栏托盘区域已存在网络图标");

      //检查: 点击网络图标，可打开网络面板
      await agent.aiTap("UOS系统控制中心快捷面板内, 网络模块");
      await agent.aiAssert("网络面板被打开");
  
    }, { timeout: 1200000, tags: ["1503627", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });