
/**
 * 用例 PMSID: 1967655
 * 用例标题: 【V25】【XMind思维导图】启动Xmind思维导图软件
 * 用例编写人: UT006010(袁佳富)
 * 生成时间: 2025-12-31 10:02:02
 */

describe('1967655-【V25】【XMind思维导图】启动Xmind思维导图软件', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const checkInstallCmd = `apt policy net.xmind.vana`;
    const checkResult = await system.exec(checkInstallCmd);
    // 检查输出中是否包含"已安装："字样且后面不是"(无)"
    // 如果已安装，输出会是：已安装：25.01.01061-202501070800
    // 如果未安装，输出会是：已安装：(无)
    if (checkResult.stdout && checkResult.stdout.includes('已安装：(无)')) {
      console.log('检测到 XMind 未安装，执行安装');
      const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install -y net.xmind.vana"`;
      await system.exec(installCmd);
      console.log('XMind 已安装');
    } else {
      console.log('XMind 已安装，跳过安装步骤');
    }
    const refreshCmd = `busctl --user call org.desktopspec.ApplicationManager1 /org/desktopspec/ApplicationManager1 org.desktopspec.ApplicationManager1 ReloadApplications; sleep 5`;
    await system.exec(refreshCmd);
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1967655-【V25】【XMind思维导图】启动Xmind思维导图软件', async ({ device, agent, uos }) => {
    await uos.openApp("XMind");
    const __eulaRes = await agent.aiBoolean('应用中出现"最终用户许可协议"或"软件许可协议"弹窗', { timeout: 15000 });
    if (__eulaRes) {
      await agent.aiTap('许可协议弹窗中的"同意"或"接受"或"我同意"按钮');
    }
    await agent.aiWaitFor("XMind思维导图应用界面已显示");
    await agent.aiAssert("XMind思维导图应用已打开");
  }, { timeout: 600000, tags: ['1967655', 'level2'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    const unInstallCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt remove -y net.xmind.vana"`;
    await system.exec(unInstallCmd);
    await uos.closeCurrentWindow();
  });
});
