
/**
 * 用例 PMSID: 1829461
 * 用例标题: 【控制中心】【个性化】【主题】深色模式下，主题设置项界面展示
 * 生成时间: 2026-04-03 09:49:35
 * 用例编写人:UT001707（陈慧）
 */

describe('1829461-【控制中心】【个性化】【主题】深色模式下，主题设置项界面展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1829461-【控制中心】【个性化】【主题】深色模式下，主题设置项界面展示', async ({ device, agent, uos }) => {
    //步骤1：进入控制中心-个性化中
    await uos.openApp("控制中心");
    await agent.aiTap("左侧：个性化")
    await agent.aiTap("最大化/还原")
    
    //检查1：显示主题、外观
    await agent.aiAssert("个性化下有：主题、外观、桌面和任务栏、窗口效果、壁纸、屏幕保护")
    
    //步骤2：设置外观为深色
    await agent.aiTap("浅色")
    await agent.aiTap("深色")
    //检查2：展示深色效果，默认显示6个主图，包括主题示例图和名称，默认窗口下固定展示2行，每行3个主题
    await agent.aiAssert("主题下有:bloom,flow,hazy color,nirvana,organic glass,origin ")
    //检查3：默认主题：nirvana，其示例图片边框为选中，外观为深色
    await agent.aiAssert("默认主题:origin,其示例图片边框为选中,外观为深色")
    

  }, { timeout: 600000, tags: ['1829461', 'level2'] });

  afterEach(async ({ device, env, agent, uos }) => {
    console.log('3. afterEach: 每个测试后的清理');
    //切回浅色模式
    await agent.aiTap("深色")
    await agent.aiTap("浅色")
    await agent.aiAssert("浅色")
    // 关闭控制中心窗口
    
    await uos.closeCurrentWindow();
  });


  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
  });
});
