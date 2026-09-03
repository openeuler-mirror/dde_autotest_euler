/**
 * 用例 PMSID: 1818379
 * 用例标题:【任务栏】【快捷面板】【声音】有输出设备，声音插件右键菜单显示
 * 生成时间: 2025-2-5 19:50:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1818379-【任务栏】【快捷面板】【声音】有输出设备，声音插件右键菜单显示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1818379-【任务栏】【快捷面板】【声音】有输出设备，声音插件右键菜单显示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 在音量面板上鼠标右键点击声音设置
      await agent.aiRightClick("UOS系统控制中心快捷面板内，音量调节模块上", { deepThink: true });

      // 检查： 声音面板右键菜单
      await agent.aiAssert("右键菜单包含：静音, 声音设置");
      
    }, { timeout: 1200000, tags: ["1818379", "level3", "laptop"] });
  
    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
