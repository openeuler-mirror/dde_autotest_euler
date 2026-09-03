/**

 * 用例 PMSID: 1672057
 * 用例标题：添加工作区最大数量
 * 生成时间: 2026-04-24 16:47:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672057-添加工作区最大数量', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672057-添加工作区最大数量', async ({ device, agent, uos }) => {
    // 将工作区减为1
    await uos.setWindowEffect("最佳视觉")
    await device.pressKey('Super', 'S');
    await agent.aiWaitFor('多任务视图已显示');

    // // 连续输入5次快捷键alt+-，使工作区的数量为1
    console.log('连续输入5次 Alt+- 减少工作区数量到1');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt', 'minus');
    }
    await device.pressKey("Esc");

    // 桌面输入【super+s】，预期进入多任务视图页面
    await device.pressKey("Super+S");
    await agent.aiWaitFor("进入多任务视图页面");
    
    await agent.aiTap("右上角添加工作区按钮加号");
    await agent.aiTap("右上角添加工作区按钮加号");
    await agent.aiTap("右上角添加工作区按钮加号");
    await agent.aiTap("右上角添加工作区按钮加号");
    await agent.aiTap("右上角添加工作区按钮加号");
    
    // 添加工作区的顺序依次往后，工作区数量等于6时"加号"按钮消失
    await agent.aiAssert("工作区数量等于6");
    await agent.aiAssert("加号按钮消失");
    
    // 快捷键输入"Alt+ +"快捷键，预期：页面无响应，不会添加工作区，实现后再取消注释即可
    await device.pressKey("Alt", "equal");
    await agent.aiAssert("屏幕顶部20%高度区域内显示6个工作区缩略图");
  }, { timeout: 300000, tags: ['1672057', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 返回桌面,并回到第一个工作区
    await device.pressKey("Esc");
    await device.pressKey("Ctrl", "Alt", "1");
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });
});