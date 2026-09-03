/**

 * 用例 PMSID: 1671601
 * 用例标题: 窗口最小化-还原
 * 生成时间: 2025-12-10 11:12:43
 * 用例编写人: UT006165（李日华）
 */

describe('1671601-窗口最小化-还原', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      await uos.setWindowEffect("最佳性能")
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1671601-窗口最小化-还原', async ({ device, agent, uos }) => {
      // 前置条件: 打开文件管理器窗口
      await agent.aiTap('点击一下桌面空白处')
      await device.pressKey("Super", "E");
      await agent.aiWaitFor('文件管理器窗口已打开');
      await agent.aiAssert('文件管理器窗口显示正常');

      // 步骤1: 点击应用右上角最小化"-"按钮
      await agent.aiTap('文件管理器窗口右上角的最小化按钮', { deepThink: true });
      
      // 预期结果1: 应用窗口最小化到任务栏
      await agent.aiAssert('桌面不显示文件管理器页面');

      // 步骤2: 点击任务栏文件管理器图标
      await agent.aiTap("任务栏文件管理器图标", { deepThink: true });
      
      // 预期结果2: 窗口可以还原
      await agent.aiWaitFor('文件管理器窗口完全加载');
      await agent.aiAssert('文件管理器窗口已还原显示');
      await agent.aiAssert('文件管理器窗口内容正常显示');

    }, { timeout: 600000, tags: ["1671601", "level1",'x11','window_rules','2d_wm'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.showDesktop(); 
      // 关闭文件管理器窗口
      await agent.aiRightClick("任务栏文件管理器图标");
      await agent.aiTap("右键菜单中的'关闭所有'选项");
      await uos.setWindowEffect("最佳视觉")
    });
  });
  