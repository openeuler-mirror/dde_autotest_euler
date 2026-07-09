
/**
 * 用例 PMSID: 1813299
 * 用例标题: 右键共享-回收站内文件夹不支持共享到smb
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813299-右键共享-回收站内文件夹不支持共享到smb', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813299-右键共享-回收站内文件夹不支持共享到smb', async ({ device, agent, uos, system,env }) => {
    await system.exec(`mkdir ~/Desktop/1813299`, 500);
    await agent.aiRightClick('1813299', 300);
    await agent.aiTap('右键菜单中删除');
    await agent.aiDoubleClick("回收站");
    await agent.aiWaitFor('回收站窗口显示');

    await agent.aiRightClick('1813299', 300);
    await agent.aiAssert('右键菜单中不存在“共享文件夹”选项');
    
  }, { timeout: 1200000, tags: ['1813299', 'level2', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //清空回收站，关闭所有文管窗口
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
