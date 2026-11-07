/**
 * 用例 PMSID: 1964117
 * 用例标题: 【V25】【Microsoft Edge浏览器_玲珑】软件卸载
 * 用例编写人:UT006345（田博文）
 * 生成时间: 2026-01-30 17:38:03
 */

describe('1964117-【V25】【Microsoft Edge浏览器_玲珑】软件卸载', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    await system.exec('pkill -9 -f softedge; pkill -9 -f msedge; ll-cli kill com.browser.softedge.stable 2>/dev/null; sleep 2; true');
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install com.browser.softedge.stable`;
    await system.exec(installCmd);
    // 全新安装后 AM（ApplicationManager）索引 linglong 应用是异步的，可能存在较长时间延迟。
    // 循环 ReloadApplications 并检查 AM 应用列表，直到 microsoft-edge 出现，最长约 200 秒。
    let edgeIndexed = false;
    for (let i = 0; i < 40; i++) {
      await system.exec('busctl --user call org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 ReloadApplications 2>/dev/null; sleep 4');
      const checkResult = await system.exec('busctl --user get-property org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 List 2>/dev/null | grep -q microsoft_2dedge');
      if (checkResult.exitCode === 0) {
        edgeIndexed = true;
        console.log(`Edge 已出现在启动器应用列表（第 ${i + 1} 次检查）`);
        break;
      }
    }
    console.log('edgeIndexed =', edgeIndexed);
    await uos.openLauncher();
    console.log('已打开启动器');
    await uos.searchInLauncher("Microsoft Edge");
    await agent.aiWaitFor("启动器搜索结果中出现Microsoft Edge应用图标",{timeoutMs:120000});
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1964117-【V25】【Microsoft Edge浏览器_玲珑】软件卸载', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await agent.aiWaitFor("启动器界面已显示");
    await uos.searchInLauncher("Microsoft Edge");
    await agent.aiWaitFor("启动器搜索结果中出现Microsoft Edge应用图标");
    await agent.aiRightClick("启动器搜索结果中的Microsoft Edge应用图标", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("菜单中的卸载选项", { deepThink: true });
    await agent.aiWaitFor("出现卸载确认弹窗");
    await agent.aiTap("确定");
    await agent.aiWaitFor("卸载确认弹窗已关闭");
    await uos.openLauncher();
    await agent.aiWaitFor("启动器界面已显示");
    await uos.searchInLauncher("Microsoft Edge");
    await agent.aiWaitFor("启动器搜索完成");
    await agent.aiAssert("无搜索结果");
  }, { timeout: 600000, tags: ['1964117', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

 afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
