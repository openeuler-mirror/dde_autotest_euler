/**
 * 用例 PMSID: 1502993
 * 用例标题:【任务栏】【托盘区域】【亮度】右键菜单 
 * 生成时间: 2025-1-20 16:30:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502993-【任务栏】【托盘区域】【亮度】右键菜单', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502993-【任务栏】【托盘区域】【亮度】右键菜单', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 拖拽【亮度】图标到任务栏托盘区域
      await agent.aiAction("拖拽UOS系统控制中心快捷面板内, 亮度面板到任务栏托盘区域（选中左边的太阳图标拖拽）", { deepThink: true });
      await agent.aiAssert("任务栏托盘区域存在亮度图标");
      await agent.aiTap("桌面空白区域");

      // 步骤 3：任务栏上亮度右键菜单点击显示设置
      await agent.aiRightClick("任务栏右下角亮度图标中心(类型太阳形状)");
      await agent.aiTap("显示设置");
 
      // 检查： 检查跳转到控制中心显示
      await agent.aiWaitFor("系统 / 显示");
      await agent.aiAssert("系统 / 显示");
  
    }, { timeout: 1200000, tags: ["1502993", "level3"] });
  
    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
      system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'dde-brightness' 0");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });