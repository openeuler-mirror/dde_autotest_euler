
/**
 * 用例 PMSID: 1967863
 * 用例标题: 【V25】【XMind思维导图】软件卸载
 * 用例编写人: UT006010(袁佳富)
 * 生成时间: 2025-12-31 15:51:38
 */

describe('1967863-【V25】【XMind思维导图】软件卸载', () => {
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
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1967863-【V25】【XMind思维导图】软件卸载', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('搜索框', { deepThink: true });
    await device.typeText('Xmind');
    await agent.aiAssert("启动器出现Xmind");
    await agent.aiRightClick("启动器中的Xmind");
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("菜单中的卸载选项", { deepThink: true });
    await agent.aiWaitFor("出现卸载确认弹窗");
    await agent.aiTap("确定");

    //确认卸载成功
    await device.pressKey("Super","M");
    await agent.aiWaitFor('右上角弹框显示“Xmind卸载成功”')   
    await uos.openLauncher();
    await uos.searchInLauncher('Xmind');
    await agent.aiWaitFor('无搜索结果', {
        timeoutMs: 180000, // 等待3分钟
        checkIntervalMs: 5000, // 每5秒检查一次
    });
    await agent.aiAssert("启动器搜索结果提示无搜索结果");
    await uos.showDesktop();  

  }, { timeout: 600000, tags: ['1967863', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

 afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
