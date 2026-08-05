// @ts-nocheck

/**
 * 用例 PMSID: 1810623
 * 用例标题: 【Bug转用例场景】连续长按或多次按下ctrl+shift+?快捷键后系统正常
 * 生成时间：2026-01-23 11:20:00
 * 用例编写人：UT000686(李双双)
 */

describe('1810623-连续长按或多次按下ctrl+shift+?快捷键后系统正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810623-连续长按或多次按下ctrl+shift+?快捷键后系统正常', async ({ device, agent, uos, system}) => {
    // 前置条件
    // 步骤1：启动器-文件管理器窗口最大化
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    // await agent.aiWaitFor("文件管理器窗口已最大化");

    // 步骤2：点击快捷键"CTRL","shift","Slash",断言文件管理器显示正常
    await device.pressKey("ctrl","shift","Slash");
    await agent.aiAssert("文件管理器页面显示快捷键弹框");

    // 步骤3：点击快捷键"CTRL","shift","Slash"三次，断言文件管理器显示正常
    for (let i = 0; i < 3; i++) {
      await device.pressKey("ctrl","shift","Slash");
    }
    await agent.aiAssert("文件管理器显示正常");

  }, { timeout: 600000, tags: ['1810623', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
   await system.exec('killall dde-file-manager', 500);
  });
});