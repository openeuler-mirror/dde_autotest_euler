// @ts-nocheck

/**
 * 用例 PMSID: 1810605
 * 用例标题: Bug207839转：标记文件时从多窗口切回文管窗口，不出现输入法弹窗等其他多余窗口
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810605-标记文件时从多窗口切回文管窗口不出现输入法弹窗等其他多余窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('touch ~/Desktop/1810605_test.txt');
  });

  test('1810605-标记文件时从多窗口切回文管窗口不出现输入法弹窗等其他多余窗口', async ({ device, agent, uos, system}) => {
    console.log('=== 开始测试：1810605 ===');

    console.log('步骤1：启动几个应用窗口如浏览器、终端、文管');
    await uos.openApp('浏览器');
    await agent.aiWaitFor('浏览器窗口已打开');
    console.log('浏览器窗口已打开');

    await uos.openApp('文本编辑器');
    await agent.aiWaitFor('文本编辑器窗口已打开');
    console.log('文本编辑器窗口已打开');  

    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap('文件管理器侧边栏的桌面图标');
    console.log('文管窗口已打开');

    console.log('步骤2：文管任意目录选中一个文件（选中即可，非编辑态）');
    await agent.aiTap('1810605_test.txt');
    await agent.aiAssert('存在蓝色文字选中框，文件被正常选中');
    console.log('文件被正常选中，出现选中底色');

    console.log('步骤3：使用快捷键"alt+tab"切换窗口');
    for (let i = 0; i < 5; i++) {
      await device.pressKey('Alt+Tab');
      await system.exec('sleep 0.5');
    }

    await device.pressKey('Alt+Tab');
    await agent.aiAssert('每次切换到文管窗口时，文管窗口正常展示，不出现输入法弹窗等多余窗口');
    console.log('切换到文管窗口，文管窗口正常展示，不出现输入法弹窗等多余窗口');

    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall browser', 500);
    await system.exec('killall deepin-editor', 500);

    console.log('✅ 1810605用例测试完成');
  }, { timeout: 600000, tags: ['1810605', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -f ~/Desktop/1810605*');
    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall browser', 500);
    await system.exec(' killall deepin-editor', 500);
    await uos.showDesktop();
  });
});