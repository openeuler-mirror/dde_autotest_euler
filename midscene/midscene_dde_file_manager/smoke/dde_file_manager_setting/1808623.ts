/**
 * 用例 PMSID: 1808623
 * 用例标题: 【文件管理器】文管设置，工作区视图-计算机视图显示项目-计算机工作区隐藏我的目录
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */


describe('1808623-文管设置，工作区视图-计算机视图显示项目-计算机工作区隐藏我的目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808623-文管设置，工作区视图-计算机视图显示项目-计算机工作区隐藏我的目录', async ({ device, agent, uos }) => {
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiTap("点击设置");
    await agent.aiTap("计算机显示项目");
    await agent.aiAssert("计算机工作区隐藏我的目录未勾选");
    await agent.aiTap("计算机工作区隐藏我的目录");
    await agent.aiTap("点击当前对话框关闭按钮X");
    await agent.aiAssert("文件管理器右侧内没有展示桌面、视频、音乐、图片、文档、下载目录");
    await uos.closeCurrentWindow();
  }, { timeout: 1200000, tags: ["1808623", 'level2', 'smoke', 'xuqi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiTap("点击设置");
    await agent.aiTap("计算机显示项目");
    await agent.aiTap("计算机工作区隐藏我的目录");
    await uos.closeCurrentWindow();
  });
});