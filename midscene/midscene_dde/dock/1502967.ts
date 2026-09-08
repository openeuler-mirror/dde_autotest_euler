/**
 * 用例 PMSID: 1502967
 * 用例标题:【任务栏】【托盘区域】【亮度】通过亮度面板调节亮度 
 * 生成时间: 2025-1-20 15:40:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502967-【任务栏】【快捷面板】【亮度】通过亮度面板调节亮度 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502967-【【任务栏】【快捷面板】【亮度】通过亮度面板调节亮度', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 调节亮度
      await agent.aiTap("UOS系统控制中心快捷面板内，亮度调节条右端的笔记本形状功能按钮", { deepThink: true });
      await agent.aiWaitFor("亮度面板已显示");      
      // 先尝试一次拖拽到50%
      await agent.aiAction("亮度面板内，拖拽亮度调节滑块到亮度调节条的50%百分比位置");
      
      // 兜底方案：循环验证并微调，确保必须到达50%
      let maxAttempts = 5;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          // 等待1秒让系统更新
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 验证是否已经达到50%
          await agent.aiAssert("亮度显示50%", { timeout: 3000 });
          console.log(`亮度已精确到达50% (第${attempt}次验证成功)`);
          break;
        } catch (error) {
          console.log(`第${attempt}次验证失败，进行微调...`);
          
          // 如果已经达到最大尝试次数，抛出错误
          if (attempt === maxAttempts) {
            console.error('亮度调节兜底方案失败，无法到达50%');
            throw new Error('亮度调节失败：无法精确到达50%位置');
          }
        }
      }      

      // 检查: 检查控制中心亮度调显示
      await agent.aiTap("显示设置", { deepThink: true });
      await agent.aiAssert("亮度，50%");

      // 检查： 检查快捷键面板亮度显示
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");
      await agent.aiAssert("亮度刻度值在中间");  

    }, { timeout: 1200000, tags: ["1502967", "level3"] });
  
    afterEach(async ({ agent, device }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await agent.aiTap("UOS系统控制中心快捷面板内，亮度调节条右端的笔记本形状功能按钮", { deepThink: true });
      await agent.aiWaitFor("亮度面板已显示");      
      await agent.aiAction("亮度面板内，拖拽亮度调节滑块到亮度调节条的100%百分比位置（最右侧)");
      await agent.aiWaitFor("100%");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });