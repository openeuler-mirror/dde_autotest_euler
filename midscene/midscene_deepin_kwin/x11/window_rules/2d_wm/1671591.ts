
/**

 * 用例 PMSID: 1671591
 * 用例标题: 键入“Alt+tab”，松开Tab键，鼠标点击空白处还原
 * 生成时间: 2026-05-14 16:45:05
 * 用例编写人: UT006165（李日华）
 */

describe('1671591-键入“Alt+tab”,松开Tab键,鼠标点击空白处还原', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671591-键入“Alt+tab”,松开Tab键,鼠标点击空白处还原', async ({ device, agent, uos }) => {
    // 前置操作：打开三个浏览器，两个终端，三个文管应用
    await uos.openApp('浏览器');
    await uos.openApp('浏览器');
    await uos.openApp('浏览器');
  
    console.log('快捷键 ctrl+alt+t 打开两个终端');
    await device.pressKey('Ctrl', 'Alt', 'T');
    await device.pressKey('Ctrl', 'Alt', 'T');

    await device.pressKey('Super', 'E');
    await device.pressKey('Super', 'E');
    await device.pressKey('Super', 'E');

    // 步骤1：键入“Alt+tab”，松开Tab键，Alt键不松，保持在切换器页面
    await device.keyDown('Alt');
    await device.pressKey('Tab');
    await device.keyUp('Tab'); // 松开 Tab
    // Alt 保持按下
    // await agent.aiWaitFor('窗口切换器页面已显示');
    await agent.aiAssert('窗口切换器页面保持显示');


    // 步骤2：鼠标点击任务切换器以外区域，退出切换器回到桌面，桌面窗口还原到唤起切换器之前的状态，不发生变动
    await agent.aiTap('点击任务切换器以外区域', { deepThink: true });
    await agent.aiAssert('桌面窗口回到之前的状态，所有打开的窗口都被显示出来,窗口可以是重叠排列的');

    // 释放 Alt 键
    await device.keyUp('Alt');

    // 步骤3：键入“Alt+Shift+Tab”组合键，松开Tab键，Alt+Shift键不松，保持在切换器页面
    console.log('步骤3:按下 Alt+Shift+Tab,保持 Alt+Shift 不松');
    await device.keyDown('Alt');
    await device.keyDown('Shift');
    await device.pressKey('Tab');
    await device.keyUp('Tab'); // 松开 Tab
    // Alt 和 Shift 保持按下
    await agent.aiAssert('窗口切换器页面保持显示');
 

    // 步骤4：鼠标点击任务切换器以外区域，退出切换器回到桌面，桌面窗口还原到唤起切换器之前的状态，不发生变动
    await agent.aiTap('点击任务切换器以外区域', { deepThink: true });
    await agent.aiAssert('桌面窗口回到之前的状态，所有打开的窗口都被显示出来,窗口可以是重叠排列的');
 
    // 释放按键
    await device.keyUp('Alt');
    await device.keyUp('Shift');
  }, { timeout: 600000, tags: ['1671591', 'level1','x11','window_rules','2d_wm'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("任务栏终端图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await agent.aiRightClick("任务栏文件管理图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await agent.aiRightClick("任务栏浏览器图标");
    await agent.aiTap("右键菜单中的'强制退出'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});
