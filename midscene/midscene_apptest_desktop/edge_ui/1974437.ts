/**
 * 用例 PMSID: 1974437
 * 用例标题: 【V25】【Microsoft Edge_玲珑】多窗口运行下关闭应用
 * 用例编写人:UT006345（田博文）
 * 生成时间: 2026-01-30 17:38:03
 */

describe('1974437-【V25】【Microsoft Edge_玲珑】多窗口运行下关闭应用', () => {
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

  test('1974437-【V25】【Microsoft Edge_玲珑】多窗口运行下关闭应用', async ({ device, agent, uos }) => {
   await uos.openLauncher();
    await agent.aiWaitFor("启动器界面已显示");
    await uos.searchInLauncher("Microsoft Edge");
    await agent.aiWaitFor("启动器搜索结果中出现Microsoft Edge应用图标");
    await device.pressKey("Enter");
    const result = await agent.aiBoolean("您的隐私弹窗",{timeout:10000});
    if(result){
      await agent.aiTap("全部拒绝按钮");
    }
    else{console.log('未检测到隐私弹窗，继续执行测试');}
    const __syncRes = await agent.aiBoolean('出现"登录同步数据"引导弹窗', { timeout: 8000 });
    if (__syncRes) {
      await agent.aiTap('"登录同步数据"引导弹窗右上角的关闭按钮(×)', { deepThink: true });
    }
    await uos.maximizeWindow();
    await device.pressKey("Ctrl","T");
    await agent.aiWaitFor("新建标签页出现");
    await agent.aiAssert("新建标签页成功");
    await agent.aiTap("浏览器窗口标题栏右上角的关闭按钮(×)", { deepThink: true });
    const __confirmRes = await agent.aiBoolean('出现"关闭所有标签页"确认弹窗', { timeout: 8000 });
    if (__confirmRes) {
      await agent.aiTap('确认弹窗中的"关闭"按钮');
    }
    await agent.aiWaitFor("浏览器应用界面关闭");
    await agent.aiAssert("浏览器应用界面关闭");
  }, { timeout: 600000, tags: ['1974437', 'level3'] });

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
