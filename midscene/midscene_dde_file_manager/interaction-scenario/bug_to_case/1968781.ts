// @ts-nocheck

/**
 * 用例 PMSID: 1968781
 * 用例标题: 打乱快捷键摁下顺序仍可正常使用快捷键功能
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1968781-打乱快捷键摁下顺序仍可正常使用快捷键功能', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1968781-打乱快捷键摁下顺序仍可正常使用快捷键功能', async ({ device, agent, uos, system}) => {
    console.log('=== 开始测试：1968781 ===');

    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);

    console.log('步骤1：使用ctrl+shift+/查看可使用的快捷键');
    await device.keyDown("ctrl","shift","/");
    await agent.aiAssert("文件管理器页面显示快捷键弹框");
    await device.keyUp("ctrl","shift","/");
    console.log('弹出弹窗显示可使用的快捷键');
    await device.pressKey('Esc');

    console.log('步骤2：切换顺序，使用shift+ctrl+/摁下对应快捷键');
    await device.keyDown("shift","ctrl","/");
    await agent.aiAssert("文件管理器页面显示快捷键弹框");
    await device.keyUp("shift","ctrl","/");
    console.log('shift+ctrl+/顺序快捷键功能正常');  
    await device.pressKey('Esc');

    await uos.closeCurrentWindow();

    console.log('✅ 1968781用例测试完成');
  }, { timeout: 600000, tags: ['1968781', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});