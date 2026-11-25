// @ts-nocheck

/**
 * 用例 PMSID: 1810613
 * 用例标题: 【文件管理器】其他应用打开文件夹时对文件进行删除操作，并且Ctrl+Z进行撤回，文件被还原
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810613-其他应用打开文件夹时对文件进行删除操作并且Ctrl+Z进行撤回文件被还原', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/Desktop/1810613_test');
    await system.exec('touch ~/Desktop/1810613_test/test_file.txt');
  });

  test('1810613-其他应用打开文件夹时对文件进行删除操作并且Ctrl+Z进行撤回文件被还原', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1810613 ===');

    console.log('前置条件：打开文本编辑器');
    await uos.openApp('文本编辑器');
    await agent.aiWaitFor('文本编辑器已打开');

    console.log('前置条件：点击文本编辑器的右上角菜单栏图标，选择"打开文件"');
    await agent.aiTap('文本编辑器右上角菜单栏图标');
    await agent.aiTap('打开文件');
    await agent.aiWaitFor('文件选择弹窗已显示');

    console.log('步骤1：在选择文件的弹窗中选择一个文件删除');
    await agent.aiTap('文件选择弹窗侧边栏的桌面图标');
    await agent.aiDoubleClick('1810613_test');
    await agent.aiRightClick('test_file.txt');
    await agent.aiTap('删除');
    await agent.aiAssert('1810613_test目录下无test_file.txt文件');
    console.log('文件被删除');

    console.log('步骤2：按下Ctrl+Z进行撤回');
    await device.pressKey('Ctrl+Z');
    await agent.aiAssert('1810613_test目录下有test_file.txt文件');
    console.log('删除的文件被还原至原位置');

    await agent.aiTap('文件选择弹窗右上角的关闭按钮:x');
    await uos.closeCurrentWindow();

    console.log('✅ 1810613用例测试完成');
  }, { timeout: 600000, tags: ['1810613', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Desktop/1810613_test');
    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall deepin-editor', 500);
    await uos.showDesktop();
  });
});