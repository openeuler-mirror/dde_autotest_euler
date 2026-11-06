/**
 * 用例 PMSID: 1974423
 * 用例标题: 【V25】【Microsoft Edge_玲珑】软件启动
 * 用例编写人:UT006345（田博文）
 * 生成时间: 2026-01-30 17:38:03
 */

describe('1974423-【V25】【Microsoft Edge_玲珑】软件启动', () => {
 beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install com.browser.softedge.stable`;
    await system.exec(installCmd);
    for (let i = 0; i < 40; i++) {
      await system.exec('busctl --user call org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 ReloadApplications 2>/dev/null; sleep 4');
      const checkResult = await system.exec('busctl --user get-property org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 List 2>/dev/null | grep -q microsoft_2dedge');
      if (checkResult.exitCode === 0) {
        console.log(`Edge 已出现在启动器应用列表（第 ${i + 1} 次检查）`);
        break;
      }
    }
    await uos.openLauncher();
    console.log('已打开启动器');
    await uos.searchInLauncher("Microsoft Edge");
    await agent.aiWaitFor("启动器界面出现Microsoft Edge应用",{timeoutMs:120000});
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1974423-【V25】【Microsoft Edge_玲珑】软件启动', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await agent.aiWaitFor("启动器界面已显示");
    await uos.searchInLauncher("Microsoft Edge");
    await agent.aiWaitFor("启动器搜索结果中出现Microsoft Edge应用图标");
    await device.pressKey("Enter");
    await uos.maximizeWindow();
    await agent.aiAssert("Microsoft Edge已打开");
  }, { timeout: 1200000, tags: ['1974423', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall com.browser.softedge.stable`;
    await system.exec(uninstallCmd);
    
    
  });
});
