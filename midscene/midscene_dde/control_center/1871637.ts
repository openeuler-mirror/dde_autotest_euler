/**
 * 用例 PMSID: 1871637
 * 用例标题: 【控制中心】【系统】【辅助信息】关于本机页面版本授权是已激活状态，点击查看按钮正常弹出授权管理页面
 * 生成时间: 2025-12-11 20:54:26
 * 用例编写人:ut003072
 */

describe('1871637-【控制中心】【系统】【辅助信息】关于本机页面版本授权是已激活状态，点击查看按钮正常弹出授权管理页面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1871637-【控制中心】【系统】【辅助信息】关于本机页面版本授权是已激活状态，点击查看按钮正常弹出授权管理页面', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击关于本机
      await agent.aiTap("关于本机", { deepThink: true });
      await agent.aiAssert("导航栏显示：系统 / 关于本机");
    
      // 步骤 3: 点击版本授权的查看按钮
      await agent.aiTap("查看");

      //检查: 弹出授权管理模式弹窗
      await agent.aiAssert("弹窗中授权模式字样可见");

  
    }, { timeout: 1200000, tags: ['1871637', 'level2', 'smoke'] });
  
    afterEach(async ({ device, agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("Super", "Down");
      await uos.closeCurrentWindow();
    });
  });