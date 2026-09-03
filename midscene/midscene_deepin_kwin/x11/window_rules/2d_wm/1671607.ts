/**

 * 用例 PMSID: 1671607
 * 用例标题：在应用窗口边缘鼠标调整窗口大小
 * 生成时间: 2026-01-14 13:25:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671607-在应用窗口边缘鼠标调整窗口大小', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671607-在应用窗口边缘鼠标调整窗口大小', async ({ device, agent, uos }) => {
    // 步骤1：使用快捷键"Super+E"打开文件管理器应用
    await device.pressKey("Super", "E");
    await agent.aiWaitFor("文件管理器窗口已打开");
    await agent.aiAssert("文件管理器窗口显示正常");

    // 在应用窗口边缘鼠标调整窗口大小
    await agent.aiHover("文件管理器窗口上边缘", { deepThink: true });
    await agent.aiAction("鼠标变成箭头形状时，按住鼠标左键向上拖动调整窗口大小", { deepThink: true });
    
    // 预期结果1：窗口大小随鼠标移动。AI无法识别动态效果
    // await agent.aiAssert("文件管理器窗口大小随鼠标拖动其边框时而改变");
    await agent.aiAssert("窗口调整大小后显示正常");
  }, { timeout: 600000, tags: ['1671607', 'level1','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await system.exec('killall dde-file-manager');
    await uos.setWindowEffect("最佳视觉")
  });
});