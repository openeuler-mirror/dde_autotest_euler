/**
 * 用例 PMSID: 1502963
 * 用例标题:【任务栏】【快捷面板】【亮度】快捷面板亮度条支持亮度调节
 * 生成时间: 2025-12-17 10:21:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502963-【任务栏】【快捷面板】【亮度】快捷面板亮度条支持亮度调节', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502963-【任务栏】【快捷面板】【亮度】快捷面板亮度条支持亮度调节', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 调节为最低亮度
      await agent.aiAction("UOS系统控制中心快捷面板内，拖拽亮度调节滑块到亮度调节条的最左侧位置", { deepThink: true });
      await agent.aiTap("UOS系统控制中心快捷面板内，亮度调节条右端的笔记本形状功能按钮", { deepThink: true });
      await agent.aiWaitFor("亮度面板已显示");     
      await agent.aiWaitFor("10%");      

      //检查: 检查控制中心亮度调显示
      await agent.aiTap("显示设置", { deepThink: true });
      await agent.aiWaitFor("10%"); 
      await agent.aiAssert("亮度，10%");

      // 步骤 2: 调节亮度
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");
      
      // 先拖拽到最右侧
      await agent.aiAction("UOS系统控制中心快捷面板内，拖拽亮度调节滑块到亮度调节条的最右侧位置", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 兜底：未到达100%时用键盘右箭头微调
      for (let i = 0; i < 20; i++) {
        try {
          await agent.aiAssert("亮度显示100%", { timeout: 2000 });
          break;
        } catch {
          await device.pressKey("right");
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }
      
      await agent.aiTap("UOS系统控制中心快捷面板内，亮度调节条右端的笔记本形状功能按钮", { deepThink: true });
      await agent.aiWaitFor("亮度面板已显示");      
      await agent.aiWaitFor("100%"); 

      //检查: 检查控制中心亮度调显示
      await agent.aiTap("显示设置", { deepThink: true });
      await agent.aiAssert("亮度，100%");
  
    }, { timeout: 1200000, tags: ["1502963", "level1", "smoke"] });
  
    afterEach(async ({ agent, device }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await agent.aiAction("控制中心显示模块内，拖拽亮度调节滑块到亮度调节条的100%百分比位置（最右侧）");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });