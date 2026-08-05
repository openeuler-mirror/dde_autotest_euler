// @ts-nocheck

/**
 * 用例 PMSID: 1810657
 * 用例标题: 字体调节
 * 生成时间：2026-01-21 14:52
 * 用例编写人：UT000686(李双双)
 */

describe('1810657-字体调节', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810657-字体调节', async ({ device, agent, uos, system }) => {
    // 前置条件：清理文件管理器&控制中心
    await system.exec('killall dde-file-manager', 500);
    // 前置条件：启动器-搜索文件管理器，窗口最大化
    await uos.openApp('文件管理器', 3000, 20000, true);

    // 步骤2：接口字号设置为"11"，断言文件管理器的页面显示正常，一个字号相差0.75（字号变大变小AI无法识别）
    await system.exec("dbus-send --print-reply --type=method_call --session --dest=org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1.Set string:'fontSize' string:'8.25'", 500);
    await agent.aiAssert("文件管理器页面显示正常");

    // 步骤3：字号设置"16"（字号变大变小AI无法识别）
    await system.exec("dbus-send --print-reply --type=method_call --session --dest=org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1.Set string:'fontSize' string:'12'", 500);
    await agent.aiAssert("文件管理器页面显示正常");

  }, { timeout: 600000, tags: ['1810657', 'level4', 'interaction-scenario', 'interaction&upgrade', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    // 步骤4：恢复设置，字号设置"14"
    await system.exec("dbus-send --print-reply --type=method_call --session --dest=org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1.Reset", 500);
  });
});