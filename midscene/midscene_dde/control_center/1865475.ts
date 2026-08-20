/**
 * 用例 PMSID: 1865475
 * 用例标题:【控制中心】【系统】【显示】单屏模式下，键盘左右键调节屏幕亮度
 * 生成时间: 2025-12-22 16:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1865475-【控制中心】【系统】【显示】单屏模式下，键盘左右键调节屏幕亮度', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1865475-【控制中心】【系统】【显示】单屏模式下，键盘左右键调节屏幕亮度', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-系统-显示并检查默认值
      await agent.aiTap("系统", { deepThink: true });
      await agent.aiTap("显示", { deepThink: true });
      await agent.aiAssert("亮度默认为100%");

      // 步骤 3: 鼠标点击亮度滑块
      await agent.aiTap("控制中心显示模块内, 亮度调节滑块", { deepThink: true });

      // 步骤 4: 点击键盘的左方向键至最左端
      const pressTimes = 90;
      for (let i = 0; i < pressTimes; i++){
        await device.pressKey("Left");
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 检查: 亮度值为10%
      await agent.aiAssert("亮度值显示10%");

      // 步骤 4: 点击键盘的左方向键至最右端
      for (let i = 0; i < pressTimes; i++){
        await device.pressKey("Right");
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 检查: 亮度值为100%
      await agent.aiAssert("亮度值显示100%");

    }, { timeout: 1200000, tags: ["1865475", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });