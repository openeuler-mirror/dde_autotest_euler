
/**
 * 用例 PMSID: 1873473
 * 用例标题: 侧边栏支持毛玻璃效果
 * 生成时间: 2025-12-30 10:20:21
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1873473-侧边栏支持毛玻璃效果', () => {
  beforeAll(async ({ device, uos, agent , system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1873473-侧边栏支持毛玻璃效果', async ({ device, agent, uos }) => {
    await uos.openApp("控制中心");
    await agent.aiTap("个性化选项");
    await agent.aiTap("hazy color主题选项");
    await agent.aiAssert("docker栏为深蓝色");
    await uos.closeCurrentWindow();
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiAssert("左侧栏为淡蓝色");

  }, { timeout: 600000, tags: ['1873473', 'level3', 'normal_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文管窗口右上角还原");
    await uos.openApp("控制中心");
    await agent.aiTap("个性化选项");
    await agent.aiTap("origin");
      //关闭所有文管窗口
      await uos.closeCurrentWindow();
      await system.cleanupFileManager();
      await device.pressKey('Esc');
      await system.exec('killall dde-file-manager', 500);
  });
});
