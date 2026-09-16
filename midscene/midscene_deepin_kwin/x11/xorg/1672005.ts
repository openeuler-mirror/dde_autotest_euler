/**

 * 用例 PMSID: 1672005
 * 用例标题: 多任务视图内属性展示
 * 生成时间: 2026-05-14 19:16:35
 * 用例编写人: UT006165（李日华）
 */

describe('1672005-多任务视图内属性展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672005-多任务视图内属性展示', async ({ device, agent, uos }) => {
    // 前置操作：最佳视觉的情况下，super+s进入多任务视图
    await device.pressKey('Super', 'S');
    await agent.aiWaitFor('多任务视图已显示');

    // 连续输入5次快捷键alt+-，输入一次alt++，使工作区的数量为2
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
      await agent.aiWaitFor('界面状态已稳定');
    }
     // 快捷键minus不好使，先使用点击方式创建俩工作区
    await device.pressKey('Alt', 'equal');
    await agent.aiWaitFor('界面状态已稳定');
    await device.pressKey('Esc');
    await device.pressKey('Ctrl', 'Alt','1');


    // 用命令开启最佳视觉
    await uos.setWindowEffect("最佳视觉");

    // 步骤：输入快捷键super+s进入多任务视图
    await device.pressKey('Super', 'S');
    await agent.aiAssert('多任务视图已显示');
    // 查看上方视图上方20%显示区域，有工作区缩略图
    await agent.aiAssert('多任务视图上方为工作区缩略图');
  }, { timeout: 600000, tags: ['1672005', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 快捷键退出多任务视图
     await device.pressKey('Esc');
  });
});
