
/**
 * 用例 PMSID: 2003705
 * 用例标题: 【V25】【XMind思维导图】【deb】主题插入网页链接
 * 用例编写人：UT006010(袁佳富)
 * 生成时间: 2026-01-30 15:18:19
 */

describe('2003705-【V25】【XMind思维导图】【deb】主题插入网页链接', () => {
  beforeAll(async ({ device, uos, agent ,system ,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 简单关闭浏览器进程
    console.log('关闭浏览器进程...');
    await system.exec('pkill -9 -f "/usr/share/browser/browser"');
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

  test('2003705-【V25】【XMind思维导图】【deb】主题插入网页链接', async ({ device, agent, uos }) => {
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
    //3.打开插入下拉菜单栏
    await agent.aiTap("顶部导航栏中的插入按钮（注意不是点击‘插入’文本，而是点击文本上方的按钮）");
    await agent.aiAssert("插入下拉菜单框已打开");
    //4.打开链接选项子菜单
    await agent.aiTap("下拉菜单框中的链接");
    await agent.aiWaitFor("链接选项子菜单已显示");
    await agent.aiAssert("链接选项子菜单已打开");
    //5.打开插入网页链接弹窗
    await agent.aiTap("链接子菜单中的网页选项");
    await agent.aiAssert("插入网页弹窗已弹出");
    await agent.aiWaitFor("弹窗输入框已显示");
    //6.输入网址并插入
    await device.typeText("www.baidu.com");
    await agent.aiTap("点击插入按钮");
    await agent.aiAssert("分支主题3右侧显示网页链接小图标");
    //7.打开插入网页
    await agent.aiTap("分支主题3右侧的网页链接小图标");
    const result =await agent.aiBoolean('出现"外部链接"弹窗',{timeout:10000});
    if(result){
      await agent.aiTap("弹窗中的'继续'按钮");
      console.log("成功处理弹窗");
    }
    else{console.log('继续执行测试');}
    await agent.aiWaitFor("百度网页界面已显示");
    await agent.aiAssert("百度网页界面已打开");
  }, { timeout: 600000, tags: ['2003705', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    await uos.closeCurrentWindow();
    await agent.aiWaitFor("出现是否保存文件弹框");
    await agent.aiTap("不保存");
    await uos.showDesktop();
  });
  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    // 动态导入清理函数
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanupXmind } = await import(`${caseDir}midscene_apptest_desktop/Xmind_ui/xmindHelper.ts`);
    await cleanupXmind({ system, env });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
  });
});
