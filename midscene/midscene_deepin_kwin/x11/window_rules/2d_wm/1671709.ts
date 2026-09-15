
/**

 * 用例 PMSID: 1671709
 * 用例标题: 工作区数量为4，键入“Ctrl+Alt+shift+5/0,无响应
 * 生成时间: 2026-06-18 15:33:39
 * 用例编写人: UT006165（李日华）
 *  */

describe('1671709-工作区数量为4,键入“Ctrl+Alt+shift+5/0,无响应', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671709-工作区数量为4,键入“Ctrl+Alt+shift+5/0,无响应', async ({ device, agent, uos }) => {
    // 前置操作：设置工作区数量为4，进入多任务视图
    await device.pressKey('Super', 'S');
    // 连续输入5次快捷键alt+-，使工作区的数量为1
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    
    // 添加工作区到4个，并回到第一个工作区
    await device.pressKey('Alt', 'equal');
    await device.pressKey('Alt', 'equal');
    await device.pressKey('Alt', 'equal');
    await device.pressKey("Esc");
    await device.pressKey('Ctrl','Alt','1');
    await uos.setWindowEffect("最佳性能")


    // 步骤1：键入Ctrl+Alt+Shift+5，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '5');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤2：键入Ctrl+Alt+Shift+0，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '0');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤3：键入Ctrl+Alt+Shift+6，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '6');
    await agent.aiAssert("处于正常的系统桌面");
  }, { timeout: 600000, tags: ['1671709', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.setWindowEffect("最佳视觉")

  });
});
