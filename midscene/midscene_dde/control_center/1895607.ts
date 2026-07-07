/**
 * 用例 PMSID: 1895607
 * 用例标题: 【控制中心】【网络】网络二级菜单界面检查 
 * 生成时间: 2025-12-19 14：31：11
 * 用例编写人:UT000511(肖海燕)
 */

describe('1895607-【控制中心】【网络】网络二级菜单界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1895607-【控制中心】【网络】网络二级菜单界面检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击网络
      await agent.aiTap("网络");

      //检查二级菜单显示
      await agent.aiAssert("连接设置下方显示无线网络和VPN菜单");
      await agent.aiAssert("无线网络和VPN菜单后面分别存在开关按钮");
       
    }, { timeout: 1200000, tags: ["1895607","level1","smoke","laptop"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  