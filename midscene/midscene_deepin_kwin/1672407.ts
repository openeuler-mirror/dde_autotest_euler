/**

 * 用例 PMSID: 1672407
 * 用例标题：退出工作区
 * 生成时间: 2026-04-24 15:08:00
 * 用例编写人: UT006165（李日华）
 */

describe('1672407-退出工作区', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1672407-退出工作区', async ({ device, agent, uos }) => {
    // 前置操作：在桌面输入快捷键Super+S，预期：进入多任务视图
    await device.pressKey("Esc");
    await device.pressKey("Super+S");
    await agent.aiWaitFor("多任务视图中屏幕顶部20%高度区域内有工作区缩略图,下方部分可能会有窗口展示");
    
    // 前置操作：键盘按【Esc】，预期：此时可以退出工作区，显示了桌面
    await device.pressKey("Esc");
    await agent.aiAssert("正常显示桌面");
    
    // 前置操作：在桌面输入快捷键Super+S，预期：进入多任务视图
    await device.pressKey("Super+S");
    await agent.aiWaitFor("多任务视图中屏幕顶部20%高度区域内有工作区缩略图,下方部分可能会有窗口展示");
    
    // 步骤：双击上方工作区缩略图，预期：进入到该工作区中
    await agent.aiDoubleClick("第一个工作区缩略图");
    await agent.aiAssert("进入工作区，即系统桌面中");
  }, { timeout: 300000, tags: ['1672407', 'level1', 'x11','xorg'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 返回桌面
    await uos.showDesktop();
  });
});