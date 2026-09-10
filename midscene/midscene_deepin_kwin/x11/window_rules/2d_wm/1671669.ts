/**

 * 用例 PMSID: 1671669
 * 用例标题：多实例应用—快捷键"Ctrl+Alt+T"打开终端10次
 * 用例优先级：level3
 * 生成时间: 2026-01-13 10:47:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671669-多实例应用—快捷键"Ctrl+Alt+T"打开终端10次', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671669-多实例应用—快捷键"Ctrl+Alt+T"打开终端10次', async ({ device, agent, uos }) => {
    // 循环10次打开终端
    for (let i = 0; i < 10; i++) {
      console.log(`打开终端第 ${i + 1} 次`);
      
      // 步骤1：输入快捷键"Ctrl+Alt+T"
      await device.pressKey("Ctrl", "Alt", "T");
      
      // 预期结果1：终端窗口显示在桌面
      await agent.aiWaitFor("终端窗口显示在桌面");
      
      // 预期结果2：最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖
      if (i > 0) {
        await agent.aiAssert("最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖");
      }
    }
  }, { timeout: 600000, tags: ['1671669', 'level3','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); 
    await system.exec('killall deepin-terminal'); 
    await uos.setWindowEffect("最佳视觉")
  });
});