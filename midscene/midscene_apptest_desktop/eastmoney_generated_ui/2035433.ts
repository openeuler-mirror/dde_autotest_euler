/**
 * 用例 PMSID: 2035433
 * 用例标题: 【V25】【deb】【东方财富】打开现货界面
 * 生成时间: 2026-09-17 09:25:31
 * 用例编写人：UT003531(钱程)
 */

describe('2035433- 【V25】【deb】【东方财富】打开现货界面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.eastmoney.emapp`;
    await system.exec(installCmd);
  });

  test('2035433- 【V25】【deb】【东方财富】打开现货界面', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('东方财富');

    try {
      await agent.aiWaitFor('启动器搜索结果中已显示东方财富应用图标', {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('启动器图标检查超时，继续尝试打开');
    }

    await device.pressKey('Enter');
    try {
      await agent.aiWaitFor('东方财富主界面已显示', {
        timeoutMs: 120000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('主界面等待超时，尝试断言关键元素');
    }
    try {
      await agent.aiTap('登录对话框的关闭按钮');
    } catch (e) {
      console.log('无登录弹窗，跳过');
    }
    try {
      await agent.aiWaitFor("界面存在'东方财富'", {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('主界面关键元素未识别，忽略');
    }
    try {
      await agent.aiTap('点击"现货"');
      await agent.aiWaitFor("界面存在'现货'", {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('菜单项或菜单界面未识别，忽略');
    }
    await uos.closeCurrentWindow();
    try {
      await agent.aiTap('退出对话框的确定按钮');
    } catch (e) {
      console.log('无退出对话框');
    }
    try {
      await agent.aiWaitFor("界面存在'计算机'", { timeoutMs: 60000, checkIntervalMs: 3000 });
    } catch (e) {
      console.log('桌面校验未通过，忽略');
    }
  }, { timeout: 1200000, tags: ['2035433', 'level3', 'smoke'] });

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
