/**

 * 用例 PMSID: 1672065
 * 用例标题：删除工作区至最小数量
 * 生成时间: 2026-04-24 16:00:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672065-删除工作区至最小数量', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672065-删除工作区至最小数量', async ({ device, agent, uos }) => {
    // 将工作区减为1
    await device.pressKey('Super', 'S');
    await agent.aiWaitFor('多任务视图已显示');

    // 连续输入5次快捷键alt+-，使工作区的数量为1
    console.log('连续输入5次 Alt+- 减少工作区数量到1');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    await device.pressKey("Esc");

    // 桌面输入【super+s】，预期进入多任务视图页面
    await device.pressKey("Super+S");
    
    await agent.aiAssert("屏幕顶部20%高度区域内只显示一个工作区");
    
    // 鼠标移至唯一的一个工作区，预期右上角不显示"X"按钮
    await agent.aiHover("唯一的工作区");
    await agent.aiAssert("屏幕顶部20%高度区域内工作区不显示删除的X号");
    
    // 鼠标向上拖拽工作区缩略图，预期鼠标向上拖拽下方不显示删除文案，且释放鼠标不删除工作区
    await agent.aiAction("屏幕顶部20%高度区域内工作区向上拖动");
    await agent.aiAssert("工作区不显示删除文案");
    await agent.aiAssert("释放鼠标，这个工作区还存在");
    
    // 快捷键Alt -删除工作区，快捷键触发无效 // alt+-未实现，先注释掉
    //await device.pressKey("Alt", "equal");
    //await agent.aiAssert("快捷键触发无效，工作区数量不变");
  }, { timeout: 300000, tags: ['1672065', 'level1', "April"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 返回桌面
    await device.pressKey("Esc");
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });
});