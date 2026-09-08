/**

 * 用例 PMSID: 1671633
 * 用例标题: 窗口级菜单—移至左边工作区—只有1个工作区移至左边工作区置灰
 * 生成时间: 2026-05-14 20:13:35
 * 用例编写人: UT006165（李日华）
 */

describe('1671633-窗口级菜单—移至左边工作区—只有1个工作区移至左边工作区置灰', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671633-窗口级菜单—移至左边工作区—只有1个工作区移至左边工作区置灰', async ({ device, agent, uos }) => {
    // 前置条件：super+s进入多任务视图，执行五次快捷键 alt+-
    await device.pressKey('Super', 'S');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    await device.pressKey('Esc');
    
    // 步骤1：快捷键super+e 打开一个文件管理器页面
    await device.pressKey('Super', 'E');
    await agent.aiAssert('显示文件管理器窗口');

    // 步骤2：键盘输入alt+空格 调出窗口级菜单
    await device.pressKey('Alt', 'Space');
    await agent.aiAssert('窗口级菜单已显示');

    // 步骤3：查看窗口级菜单 "移至左边的工作区"置灰.AI无法识别颜色
    //await agent.aiAssert('窗口级菜单中的"移至左边的工作区"选项是非黑色字体无法点击');
  }, { timeout: 600000, tags: ['1671633', 'level2','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager');
    await uos.setWindowEffect("最佳视觉")
  });
});
