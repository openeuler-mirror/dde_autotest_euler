/**
 * 用例 PMSID: 1818439
 * 用例标题:【任务栏】【快捷面板】【声音】有输出设备时，声音插件显示检查 
 * 生成时间: 2025-2-9 15:30:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1818439-【任务栏】【快捷面板】【声音】有输出设备时，声音插件显示检查 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1818439-【任务栏】【快捷面板】【声音】有输出设备时，声音插件显示检查 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 检查： 声音插件展示
      await agent.aiAssert("UOS系统控制中心快捷面板内，包含声音插件，左边是喇叭，中间是滑动条且默认在中间，右边是设备形状功能按钮")
  
    }, { timeout: 1200000, tags: ["1818439", "level2", "smoke"] });
  
    afterEach(async ({ device, agent }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });