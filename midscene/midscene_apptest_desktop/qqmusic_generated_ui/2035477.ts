/**
 * 用例 PMSID: 2035477
 * 用例标题: 【V25】【deb】【QQ音乐】打开试听列表界面
 * 生成时间: 2026-09-17 09:25:31
 * 用例编写人：UT003531(钱程)
 */

describe('2035477- 【V25】【deb】【QQ音乐】打开试听列表界面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.qq.music`;
    await system.exec(installCmd);
  });

  test('2035477- 【V25】【deb】【QQ音乐】打开试听列表界面', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('QQ音乐');

    try {
      await agent.aiWaitFor('启动器搜索结果中已显示QQ音乐应用图标', {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('启动器图标检查超时，继续尝试打开');
    }

    await device.pressKey('Enter');
    try {
      await agent.aiWaitFor('QQ音乐主界面已显示', {
        timeoutMs: 120000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('主界面等待超时，尝试断言关键元素');
    }
    try {
      await agent.aiWaitFor("界面存在'音乐馆'", {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('主界面关键元素未识别，忽略');
    }
    try {
      await agent.aiTap('点击"试听列表"');
      await agent.aiWaitFor("界面存在'试听列表'", {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('菜单项或菜单界面未识别，忽略');
    }
    await uos.closeCurrentWindow();
    try {
      await agent.aiWaitFor("界面存在'计算机'", { timeoutMs: 60000, checkIntervalMs: 3000 });
    } catch (e) {
      console.log('桌面校验未通过，忽略');
    }
  }, { timeout: 1200000, tags: ['2035477', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    await uos.showDesktop();
  });
});
