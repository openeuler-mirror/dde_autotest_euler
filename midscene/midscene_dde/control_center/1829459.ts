/**
 * 用例 PMSID: 1829459
 * 用例标题: 【控制中心】【个性化】【主题】vintage主题设置后即时生效范围和效果
 * 生成时间: 2026-05-08 12:00:00
 * 用例编写人:UT001707（陈慧）
 */

describe('1829459-【控制中心】【个性化】【主题】vintage主题设置后即时生效范围和效果', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1829459-【控制中心】【个性化】【主题】vintage主题设置后即时生效范围和效果', async ({ device, agent, uos }) => {
    //步骤1：进入控制中心-个性化中
    await uos.openApp("控制中心", 2000, 20000, true);
    await agent.aiTap("左侧：个性化")
    
    //检查1：显示主题、外观,主题生效范围(桌面壁纸、锁屏壁纸、应用图标、鼠标样式、系统字体和字号、活动用色、任务栏透明度、窗口透明度)
    await agent.aiAssert("个性化下有：主题、外观、桌面和任务栏、窗口效果、壁纸、屏幕保护")
    
    //步骤2：点击主题封面图: vintage
    await agent.aiTap("vintage", { deepThink: true });
    
    //检查2：vintage主题即时生效
    await agent.aiAssert("vintage主题封面图为选中态,显示选中边框")
    
    //检查3：相关界面和设置项更新
    await agent.aiAssert("桌面壁纸已更新为vintage主题样式")
    await agent.aiAssert("任务栏背景色为浅色")
    await agent.aiAssert("鼠标样式已更新为vintage主题样式")
    await agent.aiAssert("活动色已更新为vintage主题配色")

  }, { timeout: 600000, tags: ['1829459', 'level2'] });

  afterEach(async ({ device, env, agent, uos }) => {
    console.log('3. afterEach: 每个测试后的清理');
    //切回默认主题nirvana
    await agent.aiTap("nirvana主题封面图", { deepThink: true });
    await agent.aiAssert("nirvana主题封面图为选中态")
    // 关闭控制中心窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
  });
});