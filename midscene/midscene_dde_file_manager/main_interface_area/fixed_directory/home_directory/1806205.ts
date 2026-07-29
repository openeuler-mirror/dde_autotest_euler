// @ts-nocheck
require("dotenv/config");
/**
 * 用例 PMSID: 1806205
 * 用例标题: 主目录图标 - 桌面默认显示主目录图标_
 * 生成时间: 2025-12-25 10:16:41
 * 用例编写人：UT000374 (胡宏杰)
 */

describe('1806205-主目录图标 - 桌面默认显示主目录图标_', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806205-主目录图标 - 桌面默认显示主目录图标_', async ({ device, agent, uos, system }) => {
    await agent.aiAssert("桌面存在主目录图标");
    const result = await system.exec('ls -a /usr/share/applications | grep dde-home.desktop');
      if (result.success) {
        console.log('输出:', result.stdout);
      } else {
        console.error('错误:', result.stderr);
      }

// 带超时的命令
    const timeoutResult = await system.exec('sleep 10', 5000);
// 5 秒后超时
    await uos.openLauncher();
    await agent.aiWaitFor("屏幕左下方启动器弹窗界面已显示");
    await agent.aiTap("搜索");
    await device.typeText('主目录',true);
    await agent.aiAssert("屏幕左下方启动器弹窗窗口中提示无搜索结果");
    
  }, { timeout: 600000, tags: ['1806205', 'level3', 'home_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Esc'); 
  });
});
