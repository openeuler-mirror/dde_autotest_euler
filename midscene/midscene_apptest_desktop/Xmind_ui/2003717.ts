
/**
 * 用例 PMSID: 2003717
 * 用例标题: 【V25】【XMind思维导图】【deb】新建主题概要
 * 生成时间: 2026-01-30 09:57:19
 * 用例编写人：UT006010(袁佳富)
 */

describe('2003717-【V25】【XMind思维导图】【deb】新建主题概要', () => {
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

  test('2003717-【V25】【XMind思维导图】【deb】新建主题概要', async ({ device, agent, uos }) => {
    //1.打开Xmind应用并新建思维导图
    await uos.openApp("XMind");
    const __eulaRes = await agent.aiBoolean('应用中出现"最终用户许可协议"或"软件许可协议"弹窗', { timeout: 15000 });
    if (__eulaRes) {
      await agent.aiTap('许可协议弹窗中的"同意"或"接受"或"我同意"按钮');
    }
    await agent.aiWaitFor("XMind思维导图应用界面已显示");
    await agent.aiAssert("XMind思维导图应用已打开");
    await agent.aiTap("点击左侧导航栏中的最近按钮");
    await agent.aiTap("界面中的新建导图按钮（注意不是点击‘新建导图’文本，而是点击文本上方的‘+’按钮）");
    await agent.aiDoubleClick("基本模块处的思维导图模板(注意不是双击‘思维导图’文本而是双击文本上方的图片)");
    await agent.aiWaitFor("打开编辑思维导图界面");
    //动态导入清理弹窗方法并调用
    const caseDir = process.env.TESTCASE_DIR;
    const { closeUpPopup } = await import(`${caseDir}midscene_apptest_desktop/Xmind_ui/xmindHelper.ts`);
    await closeUpPopup({ uos, agent });
    await agent.aiAssert("编辑思维导图界面已打开");
    //2.选中分支主题
    await agent.aiWaitFor("分支主题1所在界面元素已出现");
    await agent.aiTap("分支主题1");
    await agent.aiAssert("分支主题1已被选中");
    //3.新增概要
    await agent.aiWaitFor("顶部导航栏所在界面已显示");
    await agent.aiTap("顶部导航栏中的'}□'按钮",{deepThink:true});
    await agent.aiAssert("分子主题1右侧新增概要");
    //4.输入概要并查看
    await agent.aiDoubleClick("分支主题1右侧的概要字样");
    await agent.device.typeText("这是一个概要");
    await agent.aiTap("点击中心主题");
    await agent.aiAssert("分子主题1右侧概要显示这是一个概要");
  }, { timeout: 600000, tags: ['2003717', 'level3'] });

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
