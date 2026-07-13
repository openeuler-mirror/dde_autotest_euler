
/**
 * 用例 PMSID: 1806457
 * 用例标题: Bug211857转：关闭文件选择对话框后进程在60秒后正常销毁
 * 生成时间: 2026-01-06 17:36:17
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806457-Bug211857转：关闭文件选择对话框后进程在60秒后正常销毁', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806457-Bug211857转：关闭文件选择对话框后进程在60秒后正常销毁', async ({ device, agent, uos }) => {
    await uos.openApp("看图");

    await agent.aiTap("打开图片");
    await agent.aiAssert("文管选择窗已显示");
    await agent.aiTap("文管窗口右上角X按钮");
    await agent.aiAssert("文管选择窗已关闭");
    console.log('关闭成功，等待61s');
    // 等待61秒
    await new Promise(resolve => setTimeout(resolve, 61000));

    console.log('等待完成');
    await agent.aiTap("打开图片");
    await agent.aiAssert("文管选择窗已唤起");

  }, { timeout: 600000, tags: ['1806457', 'level2', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
  });
});
