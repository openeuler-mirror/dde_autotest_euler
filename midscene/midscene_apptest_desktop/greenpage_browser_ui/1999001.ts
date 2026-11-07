/**
 * 用例 PMSID: 1999001
 * 用例标题: 【V25】【绿页浏览器_玲珑】软件安装
 * 用例编写人:UT003531(钱程)
 * 生成时间: 2026-04-28
 */

describe('1999001-【V25】【绿页浏览器_玲珑】软件安装', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall cn.greenpaper.reader`;
    await system.exec(uninstallCmd);
  });

  test('1999001-【V25】【绿页浏览器_玲珑】软件安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示");
    await agent.aiTap('应用商店顶部搜索框', { deepThink: true });
    await device.typeText('绿页浏览器', true);
    await agent.aiWaitFor("进入搜索结果界面");
    await agent.aiTap('包格式右侧deb按钮', { deepThink: true });
    await agent.aiTap('搜索结果中绿页浏览器', { deepThink: true });
    await agent.aiTap('安装');
    await agent.aiAssert("正在下载");
    await agent.aiWaitFor("界面出现打开字样", { timeoutMs: 240000 });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await agent.aiAssert("桌面出现绿页浏览器图标");
  }, { timeout: 1200000, tags: ['1999001', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall cn.greenpaper.reader`;
    await system.exec(uninstallCmd);
  });
});