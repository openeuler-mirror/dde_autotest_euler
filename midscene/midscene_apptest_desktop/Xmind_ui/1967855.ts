
/**
 * 用例 PMSID: 1967855
 * 用例标题: 【V25】【XMind思维导图】Xmind软件下载安装
 * 用例编写人:UT006010(袁佳富)
 * 生成时间: 2025-12-31 15:32:18
 */

describe('1967855-【V25】【XMind-思维导图】Xmind软件下载安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const checkInstallCmd = `apt policy cnet.xmind.vana`;
    const checkResult = await system.exec(checkInstallCmd);
    // 检查输出中是否包含"已安装："字样且后面不是"(无)"
    // 如果已安装，输出会是：已安装：25.01.01061-202501070800
    // 如果未安装，输出会是：已安装：(无)
    if (checkResult.stdout && !checkResult.stdout.includes('已安装：(无)')) {
      console.log('检测到 XMind 已安装，执行卸载');
      const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt remove -y net.xmind.vana"`;
      await system.exec(installCmd);
      console.log('XMind 已卸载');
    } else {
      console.log('XMind 未安装，跳过卸载步骤');
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1967855-【V25】【XMind-思维导图】Xmind软件下载安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示");
    await agent.aiTap('应用商店顶部搜索框', { deepThink: true });
    await device.typeText('Xmind-思维导图', true);
    await agent.aiAssert("进入搜索结果界面");
    await agent.aiTap('包格式右侧如意玲珑按钮');
    await agent.aiTap('搜索结果中Xmind-思维导图');
    await agent.aiTap('安装');
    await agent.aiAssert("正在下载");
    await agent.aiWaitFor("界面出现打开字样",{timeoutMs:120000});
  }, { timeout: 600000, tags: ['1967855', 'level2'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y net.xmind.vana`;
    await system.exec(uninstallCmd);
  });
});
