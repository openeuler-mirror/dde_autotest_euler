/**
 * 用例 PMSID: 1832995
 * 用例标题:【控制中心】【个性化】桌面右键菜单项，可打开个性化-壁纸设置界面
 * 生成时间: 2025-12-23 09:39:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1832995-【控制中心】【个性化】桌面右键菜单项，可打开个性化-壁纸设置界面', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1832995-【控制中心】【个性化】桌面右键菜单项，可打开个性化-壁纸设置界面', async ({ device, agent, uos }) => {
      // 步骤 1: 桌面空白区域右键
      await agent.aiRightClick("桌面空白处");
      await agent.aiAction("右键菜单中包含设置壁纸");

      // 步骤 2: 点击设置壁纸
      await agent.aiTap("设置壁纸", { deepThink: true });
      await agent.aiAssert("导航栏显示：个性化 / 壁纸");
    
      // 步骤 3: 桌面空白区域右键病点击设置壁纸
      await uos.showDesktop();
      await agent.aiRightClick("桌面空白处");
      await agent.aiTap("设置壁纸", { deepThink: true });
      await agent.aiAssert("导航栏显示：个性化 / 壁纸");

    }, { timeout: 1200000, tags: ["1832995", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });