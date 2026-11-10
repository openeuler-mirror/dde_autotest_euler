/**
 * 用例 PMSID: 2023711
 * 用例标题: 【V25】【书生阅读器】打开工具菜单
 * 生成时间: 2026-08-03 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2023711-【V25】【书生阅读器】打开工具菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装书生阅读器软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y sursen-reader`;
    await system.exec(installCmd);
  });

  test('2023711-【V25】【书生阅读器】打开工具菜单', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('书生阅读器');
    await agent.aiWaitFor('出现"书生阅读器"图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await agent.aiTap('"书生阅读器"图标');
    await agent.aiWaitFor('界面出现书生阅读器主界面');
    await agent.aiAssert("界面存在'书生阅读器'");
    await agent.aiWaitFor('工具菜单可见');
    await agent.aiTap('工具菜单');

    await agent.aiAssert("界面存在'缩放工具'按钮");
    await agent.aiTap('屏幕中间空白处');
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2023711', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
      const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y sursen-reader`;
      await system.exec(uninstallCmd);
  });
});
