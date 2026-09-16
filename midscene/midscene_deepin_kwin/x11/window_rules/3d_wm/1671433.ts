/**

 * 用例 PMSID: 1671433
 * 用例标题: 窗口级菜单—移动
 * 生成时间: 2025-12-11 09:07:35
 * 用例编写人: UT006165（李日华）
 */

describe('1671433-窗口级菜单—移动', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      await uos.setWindowEffect("最佳视觉");
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1671433-窗口级菜单—移动', async ({ device, agent, uos }) => {
      // 前置条件: 打开文件管理器窗口，窗口特效为最佳视觉模式
      await uos.openApp("文件管理器");
      await agent.aiWaitFor('文件管理器窗口已打开');
      await agent.aiAssert('文件管理器窗口显示正常');

      // 步骤1: 键入alt+空格，调出窗口右键菜单之后，点击移动选项
      await device.pressKey("Alt", "Space");
      await agent.aiWaitFor('窗口右键菜单已显示');
      await agent.aiTap('窗口菜单中的"移动"选项', { deepThink: true });
      
      // 预期结果1: 文件管理器窗口被选中
      await agent.aiAssert('文件管理器窗口被选中');

      // 步骤2: 移动鼠标到屏幕任意位置之后，单击鼠标左键
      await agent.aiAction('将鼠标移动到屏幕右侧后点击鼠标左键');
      
      // 预期结果2: 文件管理器窗口被移动到新位置
      await agent.aiAssert('文件管理器窗口被移动到屏幕右侧或偏右位置');
      await agent.aiAssert('文件管理器窗口显示正常');

    }, { timeout: 600000, tags: ["1671433", "level1",'x11','window_rules','3d_wm'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 确保文件管理器窗口关闭
      await device.pressKey("Alt", "F4");
    });
  });