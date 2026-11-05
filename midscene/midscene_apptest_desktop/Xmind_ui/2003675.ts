
/**
 * 用例 PMSID: 2003675
 * 用例标题: 【V25】【XMind思维导图】【deb】查看应用信息
 * 生成时间: 2026-02-12 10:12:13
 * 用例编写人：UT006010(袁佳富)
 */

describe('2003675-【V25】【XMind思维导图】【deb】查看应用信息', () => {
  beforeAll(async ({ device, uos, agent ,system ,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const checkInstallCmd = `dpkg -l net.xmind.vana 2>/dev/null | grep '^ii'`;
    const checkResult = await system.exec(checkInstallCmd);
    if (checkResult.exitCode !== 0) {
      const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install net.xmind.vana"`;
      await system.exec(installCmd);
      console.log('XMind 安装完成');
    } else {
      console.log('XMind 已安装，跳过下载步骤');
    }

    await uos.closeCurrentWindow();
    const refreshCmd = `busctl --user call org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 ReloadApplications; sleep 5`;
    await system.exec(refreshCmd);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2003675-【V25】【XMind思维导图】【deb】查看应用信息', async ({ device, agent, uos }) => {
    //1.打开xmind应用
    await uos.openApp("XMind");
    const __eulaRes = await agent.aiBoolean('应用中出现"最终用户许可协议"或"软件许可协议"弹窗', { timeout: 15000 });
    if (__eulaRes) {
      await agent.aiTap('许可协议弹窗中的"同意"或"接受"或"我同意"按钮');
    }
    await agent.aiWaitFor("XMind思维导图应用界面已显示");
    await agent.aiAssert("XMind思维导图应用已打开");
    //2.打开应用菜单
    await agent.aiTap("应用界面左上角的应用菜单按钮“···”",{deepThink:true});
    await agent.aiWaitFor("打开应用菜单");
    await agent.aiAssert("应用菜单已打开");
    //3.打开帮助选项子菜单
    await agent.aiTap("帮助菜单项");
    await agent.aiWaitFor("帮助子菜单已打开");
    await agent.aiAssert("帮助子菜单中已打开");
    //4.打开xmind应用信息弹窗
    await agent.aiTap("帮助子菜单中的“关于xmind”选项");
    await agent.aiWaitFor("打开关于xmind应用信息弹窗");
    await agent.aiAssert("xmind应用信息弹窗已打开");
  }, { timeout: 600000, tags: ['2003675', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    // 动态导入清理函数
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanupXmind } = await import(`${caseDir}midscene_apptest_desktop/Xmind_ui/xmindHelper.ts`);
    await cleanupXmind({ system, env });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
  });
});
