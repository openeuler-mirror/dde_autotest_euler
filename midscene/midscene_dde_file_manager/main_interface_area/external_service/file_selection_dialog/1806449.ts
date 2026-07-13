
/**
 * 用例 PMSID: 1806449
 * 用例标题: 文管选择窗-复制名称-文件名包含特殊字符
 * 生成时间: 2026-01-06 17:41:16
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806449-文管选择窗-复制名称-文件名包含特殊字符', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806449-文管选择窗-复制名称-文件名包含特殊字符', async ({ device, agent, uos, system }) => {
    await system.exec(`touch ~/Desktop/hu_test123-@-#-_%_^321.txt`, 500);
    await agent.aiRightClick('计算机');
    await agent.aiTap('发送到');
    await agent.aiTap('创建链接');
    await agent.aiTap('文管窗口左侧桌面');
    await agent.aiTap('文管窗口右侧带有hu_test名称的txt文件');
    await agent.aiAssert('文管窗口下方文件名显示为hu_test123-@-#-_%_^321');

  }, { timeout: 600000, tags: ['1806449', 'level4', 'file_selection_dialog', 'huhongjie'] });

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
