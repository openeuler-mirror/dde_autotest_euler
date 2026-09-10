/**

 * 用例 PMSID: 1671671
 * 用例标题：多实例应用—启动器打开终端10次
 * 用例优先级：level3
 * 生成时间: 2026-01-13 14:58:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671671-多实例应用—启动器打开终端10次', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671671-多实例应用—启动器打开终端10次', async ({ device, agent, uos }) => {
    // 步骤1：在启动器里打开终端10次
    for (let i = 0; i < 10; i++) {
      console.log(`通过启动器打开终端第 ${i + 1} 次`);
      await uos.openLauncher();
      await uos.searchInLauncher("终端");
      await device.pressKey("Enter");
      await agent.aiWaitFor("终端窗口已打开");
      
      // 预期结果1：最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖
      if (i > 0) {
        await agent.aiAssert("最新打开的终端窗口和前一个终端窗口错开显示，不会完全覆盖,仅露出一点边框也是正常的",{ deepThink: true })
      } else {
        await agent.aiAssert("终端窗口显示在桌面");
      }
    }
  }, { timeout: 600000, tags: ['1671671', 'level3','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); 
    // 关闭终端窗口
    await agent.aiRightClick("任务栏终端图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    await uos.setWindowEffect("最佳视觉")
  });
});