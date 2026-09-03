/**

 * 用例 PMSID: 1671599
 * 用例标题：点击dock栏常驻应用打开窗口
 * 生成时间: 2025-12-10 13:33:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671599-点击dock栏常驻应用打开窗口', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      await uos.setWindowEffect("最佳性能")
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1671599-点击dock栏常驻应用打开窗口', async ({ device, agent, uos }) => {
      // 步骤 1: 点击任务栏文件管理器图标
      await agent.aiTap("任务栏文件管理器图标", { deepThink: true });
      await agent.aiAssert("桌面显示文件管理器窗口");
      
      // 关闭文件管理器窗口
      await device.pressKey("Alt", "F4");
      await agent.aiAssert("文件管理器窗口已关闭");
      
      // 步骤 2: 点击任务栏终端图标
      await agent.aiTap("任务栏终端图标", { deepThink: true });
      await agent.aiAssert("终端窗口显示在桌面");
      
      // 关闭终端窗口
      await device.pressKey("Alt", "F4");
      await agent.aiAssert("终端窗口已关闭");
  
    }, { timeout: 600000, tags: ["1671599", "level1",'x11','window_rules','2d_wm'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.showDesktop();
      // 关闭文件管理器窗口
      await agent.aiRightClick("任务栏文件管理器图标");
      await agent.aiTap("右键菜单中的'关闭所有'选项");
      // 关闭终端窗口
      await agent.aiRightClick("任务栏终端图标");
      await agent.aiTap("右键菜单中的'关闭所有'选项");
      await uos.setWindowEffect("最佳视觉")
    });
  });