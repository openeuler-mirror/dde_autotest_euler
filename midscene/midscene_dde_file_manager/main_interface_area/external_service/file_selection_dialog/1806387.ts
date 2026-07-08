
/**
 * 用例 PMSID: 1806387
 * 用例标题: 文管选择窗-保存文件功能检查
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806387-文管选择窗-保存文件功能检查', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806387-文管选择窗-保存文件功能检查', async ({ device, agent, uos, system }) => {
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf ', 500);
    await uos.openApp("文本编辑器");
    await device.typeText('Test:Hello World');
    await device.pressKey('Ctrl+s');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏桌面');
    await agent.aiTap('文管窗口下方文件名右侧输入框');
    await device.pressKey('Ctrl+a');
    await device.typeText('1806387');
    await agent.aiTap('保存');
    await uos.closeCurrentWindow();
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
    await agent.aiAssert('桌面多出一个1806387文件'); 

  }, { timeout: 600000, tags: ['1806387', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Desktop/1806387*`, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf ', 500);
  });
});
