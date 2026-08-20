/**
 * 用例 PMSID: 1506783
 * 用例标题: 【控制中心】【系统】【辅助信息】系统已激活，版本授权的查看按钮可以正常点击 
 * 生成时间: 2026-1-26 15:47:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506783-【控制中心】【系统】【辅助信息】系统已激活，版本授权的查看按钮可以正常点击', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506783-【控制中心】【系统】【辅助信息】系统已激活，版本授权的查看按钮可以正常点击', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp("控制中心", {maximizeWindow: true});
      
      // 步骤 2: 点击系统-关于本机
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiTap('版本信息页面中[版本授权]右侧放的[查看]按钮')

      // 检查：弹出授权界面，可查看激活相关详细信息
      await agent.aiAssert("弹出授权界面，可查看激活相关详细信息");
      
    }, { timeout: 600000, tags: ["1506783","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
      await uos.closeCurrentWindow();
    });
  });
  