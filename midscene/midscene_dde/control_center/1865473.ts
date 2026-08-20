/**
 * 用例 PMSID: 1865473
 * 用例标题:【控制中心】【系统】【显示】单屏模式下，鼠标调节屏幕亮度
 * 生成时间: 2025-12-22 14:40:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1865473-【控制中心】【系统】【显示】单屏模式下，鼠标调节屏幕亮度', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1865473-【控制中心】【系统】【显示】单屏模式下，鼠标调节屏幕亮度', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-系统-显示
      await agent.aiTap("系统", { deepThink: true });
      await agent.aiTap("显示", { deepThink: true });
      await agent.aiAssert("亮度默认为100%");

      // 步骤 3: 鼠标拖动亮度滑块至最左端
      await agent.aiAction("控制中心显示模块内, 拖拽亮度调节滑块到亮度调节条的10%百分比位置（最左侧）");
      await agent.aiAssert("亮度值显示10%");

      // 步骤 4: 鼠标拖动亮度滑块至最右端
      await agent.aiAction("控制中心显示模块内,拖拽亮度调节滑块到亮度调节条的100%百分比位置（最右侧）");
      await agent.aiAssert("亮度值显示100%");

    }, { timeout: 1200000, tags: ["1865473", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });