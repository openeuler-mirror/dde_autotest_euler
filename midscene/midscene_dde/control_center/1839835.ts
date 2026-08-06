/**
 * 用例 PMSID: 1839835
 * 用例标题: 【控制中心】【个性化】个性化-通用三级界面，新增滚动条设置项
 * 生成时间: 2025-12-12 14:05:26
 * 用例编写人:ut003072
 */

describe('1839835-【控制中心】【个性化】个性化-通用三级界面，新增滚动条设置项', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1839835-【控制中心】【个性化】个性化-通用三级界面，新增滚动条设置项', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击个性化
      await agent.aiTap("个性化", { deepThink: true });
    
      // 步骤 3: 点击窗口效果
      await agent.aiTap("窗口效果");
      await agent.aiAssert("导航栏显示：个性化 / 窗口效果");

      //检查: 滚动条显示
      await agent.aiAssert("有滚动条设置项");

      // 步骤 4: 还原窗口
      await device.pressKey("Super", "Down")
  }, { timeout: 1200000, tags: ['1839835', 'level1', 'smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });