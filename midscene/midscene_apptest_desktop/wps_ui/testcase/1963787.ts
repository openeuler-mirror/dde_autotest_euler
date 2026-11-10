
/**
 * 用例 PMSID: 1963787
 * 用例标题: 【V25】【WPS演示】新建WPS演示文稿文件并打开
 * 生成时间: 2025-12-17 17:16:52
 * 用例编写人：UT003531(钱程)
 */

describe('1963787-【V25】【WPS演示】新建WPS演示文稿文件并打开', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    await agent.aiRightClick('桌面空白处', { deepThink:true });
    await agent.aiTap("新建文档");
    await agent.aiTap("WPS演示文稿");
    await agent.aiTap("桌面左上角空白处");
  });

  test('1963787-【V25】【WPS演示】新建WPS演示文稿文件并打开', async ({ device, agent, uos }) => {
    await agent.aiDoubleClick("'WPS演示文稿.dps'文件图标");
    await agent.aiAssert("界面存在'开始'");
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1963787', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("'WPS演示文稿.dps'文件图标");
    await agent.aiTap('删除');
    await agent.aiAssert("界面不存在'WPS演示文稿.dps'");
    await uos.showDesktop();
    await agent.aiTap("桌面右上角空白处", { deepThink:true });
  });
});
