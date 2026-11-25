// @ts-nocheck

/**
 * 用例 PMSID: 1810625
 * 用例标题: 【Bug转用例场景】选中多个文件删除时，会删除所有
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810625-选中多个文件删除时会删除所有', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/Desktop/1810625_test');
    await system.exec('touch ~/Desktop/1810625_test/file1.txt');
    await system.exec('touch ~/Desktop/1810625_test/file2.txt');
    await system.exec('touch ~/Desktop/1810625_test/file3.txt');
  });

  test('1810625-选中多个文件删除时会删除所有', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1810625 ===');

    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('文件管理器侧边栏的桌面图标');
    await agent.aiDoubleClick('1810625_test');

    console.log('步骤1：在桌面或文管选中多个文件');
    await device.keyDown('Ctrl');
    await agent.aiTap('file1.txt');
    await agent.aiTap('file2.txt');
    await device.keyUp('Ctrl');
    await agent.aiAssert('file1.txt, file2.txt存在背景色，选中成功');
    console.log('file1.txt, file2.txt存在背景色，选中成功');

    console.log('步骤2：点击delete快捷键');
    await device.pressKey('Delete');
    await agent.aiAssert('目录下无file1.txt, file2.txt两个文件，file3文件还存在');
    console.log('目录下无file1.txt, file2.txt两个文件，file3文件还存在。');

    await uos.closeCurrentWindow();

    console.log('✅ 1810625用例测试完成');
  }, { timeout: 600000, tags: ['1810625', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf ~/Desktop/1810625_test');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});