/**
 * 用例 PMSID: 1974427
 * 用例标题: 【V25】【Microsoft Edge_玲珑】添加网址的快捷打开方式
 * 用例编写人:UT006345（田博文）
 * 生成时间: 2026-01-30 17:38:03
 */

describe('1974427-【V25】【Microsoft Edge_玲珑】添加网址的快捷打开方式', () => {
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

  test('1974427-【V25】【Microsoft Edge_玲珑】添加网址的快捷打开方式', async ({ device, agent, uos }) => {
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
    await uos.maximizeWindow();
    await agent.aiAssert("Microsoft Edge浏览器已打开");
    await agent.aiTap("添加快捷方式");
    const __syncRes = await agent.aiBoolean('出现标题为"在任何设备上查看你的收藏夹、密码和其他信息"的登录同步引导弹窗', { timeout: 5000 });
    if (__syncRes) {
      await agent.aiTap('登录同步引导弹窗右上角的关闭按钮(×)', { deepThink: true });
      await agent.aiWaitFor('登录同步引导弹窗已关闭');
      await agent.aiTap("添加快捷方式");
    }
    await agent.aiWaitFor("出现添加网站弹框");
    await agent.aiTap("名称下方的输入框", { deepThink: true });
    await device.typeText("UOS官网");
    await agent.aiTap("网址下方的输入框", { deepThink: true });
    await device.typeText("www.chinauos.com");
    await agent.aiTap("添加");
    await agent.aiAssert("快捷方式栏出现'UOS官网'字样");
  }, { timeout: 600000, tags: ['1974427', 'level3'] });

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
