
/**
 * 用例 PMSID: 1806127
 * 用例标题: Bug181151转：网络邻居页面顶部工具栏检查
 * 生成时间: 2025-12-29 10:20:40
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806127-Bug181151转：网络邻居页面顶部工具栏检查', () => {
  beforeAll(async ({ device, uos, agent , system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806127-Bug181151转：网络邻居页面顶部工具栏检查', async ({ device, agent, uos, aiScroll }) => {
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiWaitFor("左侧边栏的网络邻居元素已显示");
    await agent.aiTap("点击左侧边栏的网络邻居");
    await agent.aiAssert("当前页面为网络邻居");

    await agent.aiAssert("顶部工具栏右边显示图标视图按钮", { deepThink: true });
    await agent.aiAssert("顶部工具栏右边显示列表视图按钮", { deepThink: true });
    await agent.aiHover('顶部工具栏右边显示树形视图按钮', { deepThink: true });

  }, { timeout: 600000, tags: ['1806127', 'level2', 'normal_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文管窗口右上角还原");
      //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager', 500);
  });
});
