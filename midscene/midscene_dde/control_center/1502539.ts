/**
 * 用例 PMSID: 1502539
 * 用例标题: 【控制中心】【通知】打开勿扰模式通知开关，默认不勾选时间段
 * 生成时间: 2025-12-16
 * 用例编写人:UT005571(王艺桥)
 */

describe('1502539-【控制中心】【通知】打开勿扰模式通知开关，默认不勾选时间段', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502539-【控制中心】【通知】打开勿扰模式通知开关，默认不勾选时间段', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
  
      // 步骤 2: 点击通知
      await agent.aiTap("通知");

      // 检查: 勿扰模式开关状态
      await agent.aiAssert("勿扰模式开关默认为关闭状态");

      // 步骤 3: 点击启用勿扰模式开关按钮
      await agent.aiTap("启用勿扰模式右边滑块",{ deepThink: true });

      // 检查：时间段未被勾选
      await agent.aiAssert("从22：00 至 07：00字段前无勾选");
      await agent.aiAssert("在屏幕锁屏时字段前无勾选");
      
  
    }, { timeout: 1200000,
         tags: ['1502539','level2','smoke'] });
  
    afterEach(async ({ agent,device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await agent.aiTap("启用勿扰模式右边滑块",{ deepThink: true });
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  