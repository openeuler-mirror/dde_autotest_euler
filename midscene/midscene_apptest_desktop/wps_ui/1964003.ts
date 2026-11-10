
/**
 * 用例 PMSID: 1964003
 * 用例标题: 【V25】【永中Office专业版】软件卸载
 * 生成时间: 2026-01-30 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1964003-【V25】【WPS专业版】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装WPS软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y cn.wps.wps-office-pro`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现WPS图标', {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
  });
    try {
      await agent.aiWaitFor('出现WPS自启动对话框', {
        timeoutMs: 300000, // 等待 300 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await agent.aiTap('弹窗的禁止按钮');
      console.log('成功处理自启动弹窗');
    } catch (e) {
      console.log('未检测到自启动弹窗');
    }
  });

  test('1964003-【V25】【WPS专业版】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('WPS','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现WPS应用", {
      timeoutMs: 3000000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("'WPS Office'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'WPS Office'条目右侧显示已卸载", {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有WPS图标");
    await uos.openLauncher();
    await agent.aiInput('WPS','搜索框');
    await agent.aiAssert("不存在WPS应用图标");        
  }, { timeout: 600000, tags: ['1964003', 'level1'] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.wps.wps-office-pro`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
