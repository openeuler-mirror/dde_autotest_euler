
/**
 * 用例 PMSID: 1806455
 * 用例标题: 文管选择窗-复制名称-文件名复制
 * 生成时间: 2026-01-06 17:19:13
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806455-文管选择窗-复制名称-文件名复制', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806455-文管选择窗-复制名称-文件名复制', async ({ device, agent, uos, system }) => {
    await system.exec(`touch ~/Desktop/hu_test.txt & touch ~/Desktop/hu_test1.mp4`, 500);
    await agent.aiRightClick('计算机');
    await agent.aiTap('发送到');
    await agent.aiTap('创建链接');
    await agent.aiTap('文管窗口左侧桌面');
    await agent.aiTap('文管窗口内hu_test.txt');
    await agent.aiAssert('文管窗口下方文件名显示为hu_test');
    await agent.aiTap('文管窗口内hu_test1.mp4');
    await agent.aiAssert('文管窗口下方文件名显示为hu_test1');
    await uos.closeCurrentWindow();

    await uos.openApp("浏览器");
    await device.pressKey('Ctrl+S');
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap('文管窗口左侧桌面');
    await agent.aiTap('文管窗口内hu_test.txt');
    await agent.aiAssert('文管窗口下方文件名显示为hu_test.htm');
    await agent.aiTap('文管窗口内hu_test1.mp4');
    await agent.aiAssert('文管窗口下方文件名显示为hu_test1.htm');

  }, { timeout: 600000, tags: ['1806455', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Desktop/hu_test*`, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
  });
});
