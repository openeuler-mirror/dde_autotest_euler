/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1806487
 * 用例标题:  Bug192087转：连续长按或多次按下ctrl+shift+?快捷键后系统正常
 * 生成时间: 2026-02-27 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1806487-Bug192087转：连续长按或多次按下ctrl+shift+?快捷键后系统正常', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');

      });

  test('1806487-Bug192087转：连续长按或多次按下ctrl+shift+?快捷键后系统正常', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');

    // 步骤 2: 文管界面长按ctrl+shift+?
    console.log('步骤 2: 文管界面长按ctrl+shift+?');
    await device.keyDown("ctrl+shift")
    await device.pressKey("slash")
    await agent.aiAssert('显示快捷键预览界面')
    await device.keyUp("ctrl+shift")

    // 步骤 3: 文管界面多次按ctrl+shift+?
    console.log('步骤 3: 文管界面多次按ctrl+shift+?');
    await device.keyDown("ctrl+shift")
    await device.pressKey("slash")
    await agent.aiAssert('显示快捷键预览界面')
    await device.keyUp("ctrl+shift")


  }, { timeout: 600000, tags: ["1806487", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});