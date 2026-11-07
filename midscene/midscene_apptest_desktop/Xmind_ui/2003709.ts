
/**
 * 用例 PMSID: 2003709
 * 用例标题:  【V25】【XMind思维导图】【deb】主题插入标签
 * 生成时间: 2026-01-30 14:22:28
 * 用例编写人：UT006010(袁佳富)
 */

describe('2003709- 【V25】【XMind思维导图】【deb】主题插入标签', () => {
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

  test('2003709- 【V25】【XMind思维导图】【deb】主题插入标签', async ({ device, agent, uos }) => {
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
    await agent.aiTap("分支主题3");
    await agent.aiAssert("分支主题3已被选中");
    //3.打开插入下拉菜单
    await agent.aiTap("顶部导航栏中的插入按钮（注意不是点击‘插入’文本，而是点击文本上方的按钮）");
    await agent.aiAssert("插入下拉菜单框已打开");
    //4.插入标签
    await agent.aiTap("下拉菜单中的标签选项");
    await agent.aiAssert("分支主题3下方存在标签输入框");
    //5.输入标签内容及查看
    await device.typeText("标签1,标签2,标签3");
    await agent.aiTap("点击中心主题");
    await agent.aiAssert("分支主题3显示标签1、标签2、标签3共3个标签");
  }, { timeout: 600000, tags: ['2003709', 'level3'] });

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
