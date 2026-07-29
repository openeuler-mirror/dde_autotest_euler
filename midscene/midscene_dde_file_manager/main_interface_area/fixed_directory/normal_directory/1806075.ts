
/**
 * 用例 PMSID: 1806075
 * 用例标题: 单击侧边栏网络邻居入口，操作windwos网络
 * 生成时间: 2025-12-29 10:22:57
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806075-单击侧边栏网络邻居入口，操作windwos网络', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806075-单击侧边栏网络邻居入口，操作windwos网络', async ({ device, agent, uos }) => {
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiWaitFor("左侧边栏的网络邻居元素已显示");
    await agent.aiTap("点击左侧边栏的网络邻居");
    await agent.aiAssert("当前页面为网络邻居");
  }, { timeout: 600000, tags: ['1806075', 'level3', 'normal_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
      //关闭所有文管窗口
      await uos.closeCurrentWindow();
      await system.cleanupFileManager();
      await device.pressKey('Esc');
      await system.exec('killall dde-file-manager', 500);
  });
});
