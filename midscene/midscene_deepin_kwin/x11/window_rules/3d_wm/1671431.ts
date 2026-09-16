/**

 * 用例 PMSID: 1671431
 * 用例标题: 窗口级菜单—更改大小
 * 生成时间: 2025-12-11 14:03:35
 * 用例编写人: UT006165（李日华）
 */

describe('1671431-窗口级菜单—更改大小', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      await uos.setWindowEffect("最佳视觉");
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1671431-窗口级菜单—更改大小', async ({ device, agent, uos }) => {
      // 前置条件: 打开文件管理器窗口，窗口特效为最佳视觉模式
      await device.pressKey("Super", "E");
      await agent.aiWaitFor("文件管理器窗口已打开");
      await agent.aiAssert("文件管理器窗口显示正常");

      // 步骤1: 键入alt+空格，调出窗口右键菜单
      await device.pressKey("Alt", "Space");
      await agent.aiWaitFor('窗口右键菜单已显示');
      
      // 预期结果1: 调出窗口右键菜单
      await agent.aiAssert('窗口右键菜单已显示');

      // 步骤2: 点击"更改大小"选项，移动鼠标
      await agent.aiTap('窗口菜单中的"更改大小"选项', { deepThink: true });
      await agent.aiAssert('窗口右键菜单已关闭');
      // await agent.aiTap('鼠标左键点击桌面右侧空白处');
      await agent.aiTap('鼠标左键点击桌面右下角空白处');
      
      // 预期结果2: 可以调节窗口的大小
      await agent.aiAssert('文件管理器窗口显示正常');

    }, { timeout: 600000, tags: ["1671431", "level2",'x11','window_rules','3d_wm'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 确保文件管理器窗口关闭
      await uos.showDesktop();
      await agent.aiRightClick("任务栏文件管理器图标");
      await agent.aiTap("右键菜单中的'关闭所有'选项");
    });
  });