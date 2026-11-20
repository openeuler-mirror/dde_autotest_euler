/**
 * 用例 PMSID: 2054703
 * 用例标题: 【V25】【中望3D 2026】软件卸载
 * 生成时间: 2026-10-30 19:30:00
 * 用例编写人：UT003531(钱程)
 */

describe('2054703-【V25】【中望3D 2026】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.zwsoft.zw3d2026`;
    await system.exec(installCmd);
    // 主动刷新应用商店"已安装应用"索引，并等待索引就绪，避免应用管理搜索不到刚安装的应用
    await system.exec("gdbus call --system --dest com.home.appstore.daemon --object-path /appstore --method com.home.appstore.daemon.interface.HandleDpkgTriggers >/dev/null 2>&1 || true");
    await new Promise((r) => setTimeout(r, 15000));
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
  });

  test('2054703-【V25】【中望3D 2026】软件卸载', async ({ device, agent, uos, system, env }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    try {
      await agent.aiWaitFor('出现"服务协议"或"隐私政策"或"用户协议"确认弹窗', {
        timeoutMs: 20000,
        checkIntervalMs: 3000,
      });
      await agent.aiTap('弹窗中的"同意"或"确认"或"我已阅读并同意"按钮');
      console.log('已关闭服务协议弹窗');
    } catch (e) {
      console.log('无服务协议弹窗');
    }
    await agent.aiTap('应用商店中"应用管理"入口');
    await agent.aiInput('中望3D 2026', '应用管理页面的搜索框');
    await agent.aiTap("应用管理页面的搜索按钮");
    await agent.aiWaitFor('搜索结果显示已安装的中望3D 2026', {
      timeoutMs: 120000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap('中望3D 2026条目右侧的"卸载"按钮');
    try {
      await agent.aiWaitFor('出现确认卸载的提示对话框', {
        timeoutMs: 30000,
        checkIntervalMs: 3000,
      });
      await agent.aiTap('确认对话框中的"卸载"或"确定"按钮');
    } catch (e) {
      console.log('未出现确认卸载对话框');
    }
    await agent.aiWaitFor('中望3D 2026条目右侧变为"安装"或"已卸载"按钮，表示卸载完成', {
      timeoutMs: 900000,
      checkIntervalMs: 5000,
    });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    const checkCmd = `dpkg -s com.zwsoft.zw3d2026 2>&1 | head -3`;
    const result = await system.exec(checkCmd);
    console.log('卸载校验: ' + JSON.stringify(result));
    await agent.aiAssert("桌面已不存在中望3D 2026图标");
  }, { timeout: 1800000, tags: ['2054703', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件（恢复安装，供后续用例使用）');
    const reinstallCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.zwsoft.zw3d2026`;
    await system.exec(reinstallCmd);
    await uos.showDesktop();
  });
});
