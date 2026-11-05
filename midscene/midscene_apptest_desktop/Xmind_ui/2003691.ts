
/**
 * 用例 PMSID: 2003691
 * 用例标题:  【V25】【XMind思维导图】【deb】修改分支连接线终点格式
 * 生成时间: 2026-02-09 20:46:26
 * 用例编写人：UT006010(袁佳富)
 */

describe('2003691- 【V25】【XMind思维导图】【deb】修改分支连接线终点格式', () => {
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

  test('2003691- 【V25】【XMind思维导图】【deb】修改分支连接线终点格式', async ({ device, agent, uos }) => {
    //1.打开xmind应用并新建思维导图
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
    //2.打开样式菜单
    await agent.aiWaitFor("右侧导航菜单区域已显示");
    await agent.aiTap("右侧导航菜单中的样式菜单项");
    await agent.aiAssert("样式菜单已打开");
    //3.打开终点连接线终点样式菜单
    await agent.aiTap("右侧菜单中的终点下拉选择菜单");
    await agent.aiWaitFor("终点连接线终点样式菜单已打开");
    await agent.aiAssert("终点连接线终点样式菜单已打开（这是一个线条 / 箭头样式选择下拉菜单，整体为白色圆角弹窗设计，里面是黑色图标列表，用于选择不同的线条终点样式）");
    //4.修改线条终点样式
    await agent.aiTap("菜单中的圆点终点样式选项",{deepThink:true});
    await agent.aiAssert("编辑界面中心主题与分支主题之间的连接线有一端为圆点样式",{deepThink:true});
  }, { timeout: 600000, tags: ['2003691', 'level3'] });

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
