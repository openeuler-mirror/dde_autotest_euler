/**

 * 用例 PMSID: 1672409
 * 用例标题：切换工作区
 * 生成时间: 2026-04-24 14:49:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672409-切换工作区', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  
  test('1672409-切换工作区', async ({ device, agent, uos }) => {
  // // 保证只有一个工作区
    await uos.setWindowEffect("最佳视觉")
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

    
    // 步骤1：按快捷键【super+←】预期：切换到当前工作区的前一个工作区，当前工作区是第1个时，切换到最后一个工作区
    await device.pressKey('Ctrl','Alt','1');
    await device.pressKey('Ctrl','Alt','Left');
    await device.pressKey('Super', 'S');
    await agent.aiAssert("多任务视图中屏幕顶部20%高度区域内,蓝色框框选在第4个工作区",{ deepThink: true });
    await device.pressKey("Esc");

    // 步骤2：按快捷键【super+→】 预期：切换到当前工作区的后一个工作区，当前工作区是最后一个时，切换到第一个工作区
    await device.pressKey('Ctrl','Alt','4');
    await device.pressKey('Ctrl','Alt','Right');
    await device.pressKey('Super', 'S');
    await agent.aiAssert("多任务视图中屏幕顶部20%高度区域内,在第1个工作区",{ deepThink: true });
    await device.pressKey("Esc");


    // 步骤3：按快捷键【super+ 数字键 ( 1 ~ 4 )】 预期：切换到指定顺序的工作区（无对应顺序工作区时无响应）
    await device.pressKey('Ctrl','Alt','1');
    for (let i = 1; i <= 3; i++) {
      await device.pressKey(`Ctrl+Alt+${i}`);
      await device.pressKey('Super', 'S');
      await agent.aiAssert(`多任务视图中屏幕顶部20%高度区域内，在第 ${i}工作区`);
      await device.pressKey('Esc');
    }
  }, { timeout: 300000, tags: ['1672409', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Ctrl','Alt','1');
    await device.pressKey("Esc");
    await uos.showDesktop();
  });
});