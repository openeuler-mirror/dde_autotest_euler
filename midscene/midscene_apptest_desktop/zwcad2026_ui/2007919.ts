/**
 * 用例 PMSID: 2007919
 * 用例标题: 【V25】【中望CAD 2026】软件下载安装
 * 生成时间: 2026-06-01 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2007919-【V25】【中望CAD 2026】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化卸载中望CAD 2026软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.zwsoft.zwcad2026`;
    await system.exec(uninstallCmd);
  });

  test('2007919-【V25】【中望CAD 2026】软件下载安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });
    await agent.aiInput('中望CAD 2026', '搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果包含中望CAD 2026应用", {
      timeoutMs: 180000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap("中望CAD 2026条目右侧第一个安装按钮");
    try {
      await agent.aiWaitFor('出现"安装成功"网页', {
        timeoutMs: 600000, // 等待 600 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await device.pressKey("alt","F4");
      console.log('成功处理安装网页');
    } catch (e) {
      console.log('未检测到安装网页');
    }
    await agent.aiWaitFor('中望CAD 2026条目右侧打开按钮已显示', {
      timeoutMs: 180000,
      checkIntervalMs: 5000,
    });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await agent.aiAssert("桌面出现中望CAD2026图标");
  }, { timeout: 1000000, tags: ['2007919', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.zwsoft.zwcad2026`;
    await system.exec(uninstallCmd);
  });
});
