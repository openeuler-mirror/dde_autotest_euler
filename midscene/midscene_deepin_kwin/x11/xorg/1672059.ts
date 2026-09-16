/**

 * 用例 PMSID: 1672059
 * 用例标题: 添加工作区壁纸规则
 * 生成时间: 2026-05-14 20:28:56
 * 用例编写人: UT006165（李日华）
 */

describe('1672059-添加工作区壁纸规则', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672059-添加工作区壁纸规则', async ({ device, agent, uos }) => {
    // 前置条件：最佳视觉的情况下，super+s进入多任务视图
    await device.pressKey('Super', 'S');
    // await agent.aiWaitFor('多任务视图已显示');

    // 连续输入5次快捷键alt+-，使工作区的数量为1
    console.log('连续输入5次 Alt+- 减少工作区数量到1');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }

    // 步骤1：进入多任务视图（已经进入，确认）
    await agent.aiAssert('成功进入多任务视图');

    // 步骤2：输入alt++，添加一个工作区
    await device.pressKey('Alt', 'equal');
    await agent.aiWaitFor('界面状态已稳定');
    await agent.aiAssert('上方区域工作区缩略图是两个');

    // 步骤3：连续添加直到6个工作区，显示6个工作区
    console.log('步骤3:连续添加直到6个工作区');
    // 当前应该有2个工作区（初始1个+刚添加1个），需要再添加4个
    for (let i = 0; i < 4; i++) {
      await device.pressKey('Alt', 'equal');
      await agent.aiWaitFor('界面状态已稳定');
    }
    await agent.aiAssert('显示6个工作区');

    // 步骤4：查看这六个工作区壁纸，新添加工作区壁纸与之前添加工作区壁纸不相同
    await agent.aiAssert('新添加工作区壁纸与之前添加工作区壁纸不相同');
  }, { timeout: 600000, tags: ['1672059', 'level2', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Esc')
    await device.pressKey("Ctrl", "Alt", "1");
  });
});
