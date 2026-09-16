
/**

 * 用例 PMSID: 1672067
 * 用例标题: 删除工作区
 * 生成时间: 2026-06-18 15:37:13
 * 用例编写人: UT006165（李日华）
 */

describe('1672067-删除工作区', () => {
  beforeAll(async ({ device, uos, agent }) => {
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672067-删除工作区', async ({ device, agent, uos }) => {
    // 前置操作：设置工作区数量为4，进入多任务视图
    await device.pressKey('Super', 'S');
    await agent.aiWaitFor('多任务视图已显示');

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

    // 步骤1：多任务视图先使用快捷键删除一个工作区
    await device.pressKey('Super', 'S');
    await device.pressKey('Alt', 'minus');
    // 拖拽功能不好用，先注释掉
    // await agent.aiAction("鼠标拖拽工作区缩略图向上移动", { deepThink: true });
    // await agent.aiAssert("透明度降到50%，⼯作区底层出现虚线框区域并显示文案“向上拖拽删除”");
    // 步骤2：超过虚线后释放鼠标
    // await agent.aiAction("超过虚线后释放鼠标");
    // await agent.aiAssert("删除拖拽的⼯作区");

    // 步骤3：使用快捷键切换到工作区3
    await device.pressKey('Super', '3');
    await agent.aiAssert("当前工作区切换至3工作区");
    // 步骤4：鼠标移入3号工作区缩略图，点击工作区右上角“X”按钮
    await agent.aiAction("鼠标移入3号工作区缩略图,点击工作区右上角“X”按钮");
    await agent.aiAssert("工作区数量为2个,选择框在第二个工作区，且变为当前工作区，");

    // 步骤5：使用快捷键切换到工作区1，然后按Alt+-删除
    await agent.aiTap("点击第一个工作区缩略图")
    await device.pressKey('Alt', 'minus');
    await agent.aiAssert("顶部有一个被选中的工作区缩略图");
  }, { timeout: 600000, tags: ['1672067', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
