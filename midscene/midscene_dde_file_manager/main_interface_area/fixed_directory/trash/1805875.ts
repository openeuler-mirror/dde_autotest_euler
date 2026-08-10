
/**
 * 用例 PMSID: 1805875
 * 用例标题: 全部还原-原路径不存在时功能正常
 * 生成时间: 2025-12-30 17:37:10
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");


describe('1805875-全部还原-原路径不存在时功能正常', () => {
  beforeAll(async ({ device, uos, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec('killall dde-file-manager', 500);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805875-全部还原-原路径不存在时功能正常', async ({ device, agent, uos, system }) => {
    await system.exec('mkdir ~/Desktop/h_tst', 500);
    await system.exec('mkdir ~/Desktop/h_tst/180587B & touch ~/Desktop/h_tst/c.txt', 500);
    await agent.aiDoubleClick('h_tst');
    await agent.aiRightClick('180587B');
    await agent.aiTap('删除选项');
    await agent.aiRightClick('c.txt');
    await agent.aiTap('删除选项');
    await uos.closeCurrentWindow();
    await agent.aiTap('桌面左侧h_tst文件夹');
    await device.pressKey('Shift', 'Delete');
    await agent.aiTap('删除');

    await uos.openApp("文件管理器");
    await agent.aiTap('文管窗口左侧边栏桌面');
    await agent.aiAssert("不存在文件夹h_tst");
    await agent.aiTap('文管窗口左侧边栏回收站');
    await agent.aiAssert("回收站窗口内存在文件夹180587B、文件c.txt,不存在文件夹h_tst");
    await agent.aiRightClick('文管窗口中心空白处');
    await agent.aiTap('全部还原');
    await uos.closeCurrentWindow();
    await agent.aiDoubleClick('h_tst');
    await agent.aiAssert("打开文管窗口内存在文件夹180587B、文件c.txt");
  }, { timeout: 600000, tags: ['1805875', 'level3', 'trash', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system , env}) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Desktop/h_tst', 500);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec('killall dde-file-manager', 500);
  });
});
