/**

 * 用例 PMSID: 1671625
 * 用例标题: 窗口级菜单—更改大小
 * 生成时间: 2025-12-22 09:14:30
 * 用例编写人: UT006165（李日华）
 */

describe('1671625-窗口级菜单—更改大小', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671625-窗口级菜单—更改大小', async ({ device, agent, uos }) => {
    // 步骤1：打开文件管理器窗口
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器窗口已打开");

    // 步骤1: 键入alt+空格，调出窗口右键菜单
    await device.pressKey("Alt", "Space");
    await agent.aiWaitFor('窗口右键菜单已显示');
    await agent.aiAssert('窗口右键菜单已显示');

    // 步骤1: 点击"更改大小"选项，移动鼠标
    await agent.aiTap('窗口菜单中的"更改大小"选项', { deepThink: true });
    await agent.aiAssert('窗口右键菜单已关闭');
    //await agent.aiTap('鼠标左键点击桌面右侧空白处');
    await agent.aiTap('鼠标左键点击桌面右下角空白处');
      
    // 预期结果1: 可以调节窗口的大小
    await agent.aiAssert('文件管理器窗口显示正常');
  }, { timeout: 600000, tags: ['1671625', 'level1','x11','window_rules','2d_wm'] });

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
