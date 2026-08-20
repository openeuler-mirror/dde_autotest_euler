/**
 * 用例 PMSID: 1865311
 * 用例标题:【控制中心】【系统】【显示】X11单屏模式下，缩放标题位置检查
 * 生成时间: 2025-1-21 17:05:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1865311-【控制中心】【系统】【显示】X11单屏模式下，缩放标题位置检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1865311-【控制中心】【系统】【显示】X11单屏模式下，缩放标题位置检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-系统-显示
      await agent.aiTap("显示", { deepThink: true });
    
      //检查: 缩放位于显示和布局模块最下方
      await agent.aiAssert("缩放位于显示和布局模块最下方");

    }, { timeout: 1200000, tags: ["1865311", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });