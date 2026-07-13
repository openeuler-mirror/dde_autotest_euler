
/**
 * 用例 PMSID: 1806393
 * 用例标题: 文管选择窗-选中多个文件
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806393-文管选择窗-选中多个文件', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806393-文管选择窗-选中多个文件', async ({ device, agent, uos, system }) => {
    await system.exec(`touch ~/Documents/1806393.txt & mkdir ~/Documents/1806393`, 500);
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+o');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await device.keyDown("Ctrl");
    await agent.aiTap('1806393.txt上方文件图标', { deepThink: true });
    await agent.aiTap('1806393上方文件夹图标');
    await agent.aiAssert('文管窗口内文件1806393.txt、文件夹1806393都被选中');
    await device.keyUp("Ctrl");
    await device.releaseAllKeys();

  }, { timeout: 600000, tags: ['1806393', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Documents/1806393* `, 500);
    await device.releaseAllKeys();
    //关闭所有窗口
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
  });
});
