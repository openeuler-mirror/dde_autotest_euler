
/**
 * 用例 PMSID: 1806185
 * 用例标题: 主目录图标 - 改变图标主题
 * 生成时间: 2025-12-26 14:01:45
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");


describe('1806185-主目录图标 - 改变图标主题', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806185-主目录图标 - 改变图标主题', async ({ device, agent, uos }) => {
    await uos.openApp('控制中心');
    await agent.aiWaitFor("打开窗口左侧边栏显示个性化");
    await agent.aiTap("个性化");
    
    await agent.aiTap("bloom主题选项");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/bloom/places/64/user-home.svg 文件样式一样");

    await agent.aiTap("flow主题选项");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/flow/places/64/user-home.svg 文件样式一样");

    await agent.aiTap("hazy color主题选项");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/hazy-color/places/64/user-home.svg 文件样式一样");

    await agent.aiTap("nirvana主题选项");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/nirvana/places/64/user-home.svg 文件样式一样");

    await agent.aiTap("organic glass主题选项");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/organic-glass/places/64/user-home.svg 文件样式一样");

    await agent.aiTap("主题右侧 > 选项");
    await agent.aiTap("square");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/square/places/64/user-home.svg 文件样式一样");

    await agent.aiTap("vintage");
    await agent.aiAssert("桌面主目录图标与/usr/share/icons/vintage/places/64/user-home.svg 文件颜色一样");


  }, { timeout: 600000, tags: ['1806185', 'level3', 'home_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("主题右侧 < 选项");
    await agent.aiTap("origin");

    await uos.closeCurrentWindow();
  });
});
