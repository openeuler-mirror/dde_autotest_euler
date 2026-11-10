/**
 * 用例 PMSID: 2034099
 * 用例标题: 【V25】【玲珑】【TextSeek文本搜索工具】搜索功能按钮
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034099- 【V25】【玲珑】【TextSeek文本搜索工具】搜索功能按钮', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install net.textseek`;
    await system.exec(installCmd);
  });

  test('2034099- 【V25】【玲珑】【TextSeek文本搜索工具】搜索功能按钮', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('TextSeek');

    await agent.aiWaitFor('启动器搜索结果中已显示TextSeek应用图标', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await device.pressKey('Enter');
    await agent.aiWaitFor('TextSeek主界面已显示', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });
    await agent.aiAssert("界面存在'搜索'按钮");

    await agent.aiTap("搜索按钮");
    await agent.aiWaitFor("弹出'选择要搜索的文件夹'对话框", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("取消按钮");
    await agent.aiWaitFor("弹出'TextSeek'消息", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("确定按钮");
    await agent.aiWaitFor('对话框消失', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2034099', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const killCmd = `pkill -f 'net.textseek'`;
    await system.exec(killCmd);
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall net.textseek`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
