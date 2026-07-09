
/**
 * 用例 PMSID: 1813303
 * 用例标题: 右键共享-选中多个文件夹不支持右键共享到smb
 * 生成时间: 2026-03-02 10:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813303-右键共享-选中多个文件夹不支持右键共享到smb', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813303-右键共享-选中多个文件夹不支持右键共享到smb', async ({ device, agent, uos, system,env }) => {
    await system.exec(`mkdir ~/Desktop/1813303 & mkdir ~/Desktop/181330q & mkdir ~/Desktop/181330w & mkdir ~/Desktop/181330e`, 500);

    await device.keyDown("Ctrl");
    await agent.aiTap('1813303');
    await agent.aiTap('181330q');
    await agent.aiTap('181330w');
    await agent.aiRightClick('181330e', 300);
    await agent.aiAssert('右键菜单中不存在“共享文件夹”选项');
    await device.keyUp("Ctrl");
    await device.releaseAllKeys();
    
  }, { timeout: 1200000, tags: ['1813303', 'level3', 'smb', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await system.exec(`rm -rf ~/Desktop/181330* `, 500);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
