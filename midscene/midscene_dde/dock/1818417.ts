/**
 * 用例 PMSID: 1818417
 * 用例标题:【任务栏】【快捷面板】【声音】声音面板设置界面，返回按钮功能检查   
 * 生成时间: 2025-2-5 20:38:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1818417-【任务栏】【快捷面板】【声音】声音面板设置界面，返回按钮功能检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1818417-【任务栏】【快捷面板】【声音】声音面板设置界面，返回按钮功能检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 点击音量模块右侧的设备按钮
      await agent.aiTap("UOS系统控制中心快捷面板内，音量调节条右端的设备形状功能按钮", { deepThink: true });

      // 步骤 3: 点击返回按钮
      await agent.aiTap("左上角返回按钮", { deepThink: true });

      // 检查： 返回快捷面板成功
      await agent.aiAssert("当前界面为快捷设置面板界面");

    }, { timeout: 1200000, tags: ["1818417", "level3", "laptop"] });
  
    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });