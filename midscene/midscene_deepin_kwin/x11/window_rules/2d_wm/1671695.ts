
/**

 * 用例 PMSID: 1671695
 * 用例标题: 桌面工作区切换—工作区数量为4,键入“Ctrl+Alt+5/Ctrl+Alt+0”无响应
 * 生成时间: 2026-05-14 17:23:57
 * 用例编写人: UT006165（李日华）
 */

describe('1671695-桌面工作区切换—工作区数量为4,键入“Ctrl+Alt+5/Ctrl+Alt+0”无响应', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect('最佳视觉');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671695-桌面工作区切换—工作区数量为4,键入“Ctrl+Alt+5/Ctrl+Alt+0”无响应', async ({ device, agent, uos }) => {
    // 前置操作：最佳视觉的情况下，super+s进入多任务视图
    await device.pressKey('Super', 'S');
    // 连续输入5次快捷键alt+-，再连续输入三次alt++，使工作区的数量为4
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    for (let i = 0; i < 3; i++) {
      await device.pressKey('Alt', 'equal');
    }
    // 用命令开启最佳性能
    await uos.setWindowEffect('最佳性能');

    // 步骤1：输入快捷键"Ctrl+Alt+5"
    await device.pressKey('Ctrl', 'Alt', '5');
    await agent.aiAssert('桌面依旧显示桌面');

    // 步骤2：输入快捷键"Ctrl+Alt+0"（主键盘）
    await device.pressKey('Ctrl', 'Alt', '0');
    await agent.aiAssert('桌面依旧显示桌面');

    // 步骤3：输入快捷键"Ctrl+Alt+6"
    await device.pressKey('Ctrl', 'Alt', '6');
    await agent.aiAssert('桌面依旧显示桌面');
  }, { timeout: 600000, tags: ['1671695', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 返回到第一个工作区
    await uos.setWindowEffect("最佳视觉")
    await device.pressKey('Ctrl', 'Alt', '1');
  });
});

