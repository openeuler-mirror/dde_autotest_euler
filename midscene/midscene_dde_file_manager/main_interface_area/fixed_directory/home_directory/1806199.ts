
// @ts-nocheck
require("dotenv/config");
/**
 * 用例 PMSID: 1806199
 * 用例标题: 主目录图标 - 从文管桌面路径进入主目录_
 * 生成时间: 2025-12-25 14:11:56
 * 用例编写人：UT000374 (胡宏杰)
 */

describe('1806199-主目录图标 - 从文管桌面路径进入主目录_', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806199-主目录图标 - 从文管桌面路径进入主目录_', async ({ device, agent, uos }) => {
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的桌面目录选项");
    await agent.aiDoubleClick("桌面目录内的主目录图标");
    await agent.aiAssert("文管路径显示为主目录路径");

  }, { timeout: 600000, tags: ['1806199', 'level3', 'home_directory', 'huhongjie'] });

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
