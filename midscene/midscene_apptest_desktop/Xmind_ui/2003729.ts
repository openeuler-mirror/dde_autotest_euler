
/**
 * 用例 PMSID: 2003729
 * 用例标题: 【V25】【XMind思维导图】【deb】修改思维导图背景颜色
 * 生成时间: 2026-01-28 17:24:35
 * 用例编写人：UT006010(袁佳富)
 */


describe('2003729-【V25】【XMind思维导图】【deb】修改思维导图背景颜色', () => {
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
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('2003729-【V25】【XMind思维导图】【deb】修改思维导图背景颜色', async ({ device, agent, uos }) => {
    //1.打开Xmind应用
    await uos.openApp("XMind");
    const __eulaRes = await agent.aiBoolean('应用中出现"最终用户许可协议"或"软件许可协议"弹窗', { timeout: 15000 });
    if (__eulaRes) {
      await agent.aiTap('许可协议弹窗中的"同意"或"接受"或"我同意"按钮');
    }
    await agent.aiWaitFor("XMind思维导图应用界面已显示");
    await agent.aiAssert("XMind思维导图应用已打开");
    //2.新增思维导图
    await agent.aiTap("点击左侧导航栏中的最近按钮");
    await agent.aiTap("界面中的新建导图按钮（注意不是点击‘新建导图’文本，而是点击文本上方的‘+’按钮）");
    await agent.aiDoubleClick("基本模块处的思维导图模板(注意不是双击‘思维导图’文本而是双击文本上方的图片)");
    await agent.aiWaitFor("编辑思维导图界面已显示");
    //动态导入清理弹窗方法并调用
    const caseDir = process.env.TESTCASE_DIR;
    const { closeUpPopup } = await import(`${caseDir}midscene_apptest_desktop/Xmind_ui/xmindHelper.ts`);
    await closeUpPopup({ uos, agent });
    await agent.aiAssert("编辑思维导图界面已打开");
    //3.打开背景颜色选中框
    await agent.aiWaitFor("右侧导航栏已显示",{timeoutMs:120000});
    await agent.aiTap("右侧菜单栏中的画布菜单")
    await agent.aiTap("右侧导航栏背景颜色选项右侧白色按钮");
    await agent.aiWaitFor("XMind思维导图应用编辑界面背景颜色选择菜单已打开");
    await agent.aiAssert("背景颜色选择菜单已打开");
    //4.切换背景颜色
    await agent.aiTap("背景颜色选择菜单内的红色选项（颜色菜单中从上往下数的最后一排，左往右数的第二个选项",{deepThink:true});
    await agent.aiAssert("思维导图背景颜色为红色");
  }, { timeout: 600000, tags: ['2003729', 'level3'] });

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
  });
});
