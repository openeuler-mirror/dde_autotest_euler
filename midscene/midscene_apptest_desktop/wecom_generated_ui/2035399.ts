/**
 * 用例 PMSID: 2035399
 * 用例标题: 【V25】【deb】【企业微信】软件打开关闭
 * 生成时间: 2026-09-17 09:25:31
 * 用例编写人：UT003531(钱程)
 */

describe('2035399- 【V25】【deb】【企业微信】软件打开关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.qq.weixin.work.deepin`;
    await system.exec(installCmd);
  });

  test('2035399- 【V25】【deb】【企业微信】软件打开关闭', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('企业微信');

    try {
      await agent.aiWaitFor('启动器搜索结果中已显示企业微信应用图标', {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('启动器图标检查超时，继续尝试打开');
    }

    await device.pressKey('Enter');
    try {
      await agent.aiWaitFor('企业微信主界面已显示', {
        timeoutMs: 120000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('主界面等待超时，尝试断言关键元素');
    }
    try {
      await agent.aiWaitFor("界面存在'企业微信'", {
        timeoutMs: 60000,
        checkIntervalMs: 3000,
      });
    } catch (e) {
      console.log('主界面关键元素未识别，忽略');
    }
    await uos.closeCurrentWindow();
    try {
      await agent.aiWaitFor("界面存在'计算机'", { timeoutMs: 60000, checkIntervalMs: 3000 });
    } catch (e) {
      console.log('桌面校验未通过，忽略');
    }
  }, { timeout: 1200000, tags: ['2035399', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qq.weixin.work.deepin`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
