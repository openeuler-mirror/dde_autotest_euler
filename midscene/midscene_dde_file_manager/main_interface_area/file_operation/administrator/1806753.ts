// @ts-nocheck
require("dotenv/config");
/**
 * 用例 PMSID: 1806753
 * 用例标题: 管理员-右键文件夹检查菜单选项展示
 * 生成时间: 2025-12-24 16:06:06
 * 用例编写人：UT000374 (胡宏杰)
 */

describe('1806753-管理员-右键文件夹检查菜单选项展示', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806753-管理员-右键文件夹检查菜单选项展示', async ({ device, agent, uos, system }) => {
       await system.exec('mkdir ~/Desktop/asd', 500);
       await agent.aiRightClick('桌面空白处');
       await agent.aiAssert('打开右键菜单不存在以管理员身份打开选项');
       await agent.aiTap('asd');
       await agent.aiDoubleClick('asd');
       await agent.aiTap('文管窗口左侧边栏桌面');
       await agent.aiTap('文管窗口右上角最大化按钮');
       await agent.aiRightClick('asd文件夹');
       await agent.aiAssert('打开右键菜单存在以管理员身份打开选项');
       await agent.aiTap('计算机');
  }, { timeout: 600000, tags: ['1806753', 'level3', 'administrator', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('文管窗口右上角还原按钮');
    await system.exec('rm -rf ~/Desktop/asd', 500);
    //关闭所有文管窗口
    await device.pressKey('Esc');
    await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
    await system.cleanupFileManager();
  });
});
