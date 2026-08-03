
/**
 * 用例 PMSID: 1806131
 * 用例标题: 剪切-剪切深层目录
 * 生成时间: 2025-12-26 17:16:57
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");



describe('1806131-剪切-剪切深层目录', () => {
  beforeAll(async ({ device, uos, agent , system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806131-剪切-剪切深层目录', async ({ device, agent, uos, system }) => {
    await system.exec('mkdir -p ~/Documents/180613a/180613b/180613c/180613d/e/f/g/h/i/j/k/l/m/n', 500);
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文管窗口左侧文档");
    await agent.aiDoubleClick("180613a");
    await agent.aiDoubleClick("180613b");
    await agent.aiDoubleClick("180613c");
    await agent.aiRightClick("180613d");
    await agent.aiTap("右键菜单中的剪切选项");
    await agent.aiTap("文管窗口左侧桌面目录");
    // await agent.aiTap("进入目标粘贴目录");
    await agent.aiRightClick("桌面目录空白区域");
    await agent.aiTap("右键菜单中的粘贴选项");
    // await agent.aiAssert("目标目录存在被粘贴的文件或文件夹");
    await agent.aiAssert("文件管理器界面正常显示");
    await agent.aiAssert("桌面存在180613d目录");

  }, { timeout: 600000, tags: ['1806131', 'level3', 'normal_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Documents/180613a & rm -rf ~/Desktop/180613d', 500);
      //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager', 500);
  });
});
