
/**

 * 用例 PMSID: 1671711
 * 用例标题: 工作区数量为1，键入“Ctrl+Alt+shift+0~5，无响应
 * 生成时间: 2026-06-18 15:37:06
 * 用例编写人: UT006165（李日华）
 *  */

describe('1671711-工作区数量为1,键入“Ctrl+Alt+shift+0~5,无响应', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671711-工作区数量为1,键入“Ctrl+Alt+shift+0~5,无响应', async ({ device, agent, uos }) => {
    // 保证只有一个工作区
    await uos.setWindowEffect("最佳视觉")
    await device.pressKey('Super', 'S');
    await agent.aiWaitFor('多任务视图已显示');

    // 连续输入5次快捷键alt+-，使工作区的数量为1
    await device.pressKey('Alt', 'minus');
    await device.pressKey('Alt', 'minus');
    await device.pressKey('Alt', 'minus');
    await device.pressKey('Alt', 'minus');
    await device.pressKey('Alt', 'minus');
    await device.pressKey("Esc");
    await uos.setWindowEffect("最佳性能")

    // 步骤1：键入Ctrl+Alt+Shift+0，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '0');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤2：键入Ctrl+Alt+Shift+1，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '1');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤3：键入Ctrl+Alt+Shift+2，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '2');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤4：键入Ctrl+Alt+Shift+3，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '3');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤5：键入Ctrl+Alt+Shift+4，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '4');
    await agent.aiAssert("处于正常的系统桌面");
    // 步骤6：键入Ctrl+Alt+Shift+5，无响应
    await device.pressKey('Ctrl', 'Alt', 'Shift', '5');
    await agent.aiAssert("处于正常的系统桌面");
  }, { timeout: 600000, tags: ['1671711', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
