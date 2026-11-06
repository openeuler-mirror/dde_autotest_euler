/**
 * 用例 PMSID: 2023619
 * 用例标题: 【V25】【亿图脑图Mindmaster思维导图（企业版）】软件打开/关闭
 * 生成时间: 2026-08-03 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2023619-【V25】【亿图脑图Mindmaster思维导图（企业版）】软件打开/关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装亿图脑图Mindmaster思维导图（企业版）软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y cn.edrawsoft.mindmaster`;
    await system.exec(installCmd);
  });

  test('2023619-【V25】【亿图脑图Mindmaster思维导图（企业版）】软件打开/关闭', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('亿图脑图');
    await agent.aiWaitFor('出现"亿图脑图"图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await agent.aiTap('"亿图脑图"图标');
    await agent.aiWaitFor('界面出现亿图脑图Mindmaster主界面');
    await agent.aiAssert("界面存在'本地文件'");
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2023619', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
      const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.edrawsoft.mindmaster`;
      await system.exec(uninstallCmd);
  });
});
