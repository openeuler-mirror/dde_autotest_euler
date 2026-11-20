/**
 * 用例 PMSID: 2054539
 * 用例标题: 【V25】【浩辰CAD建筑 2024】软件下载安装
 * 生成时间: 2026-10-30 19:30:00
 * 用例编写人：UT003531(钱程)
 */

describe('2054539-【V25】【浩辰CAD建筑 2024】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化卸载浩辰CAD建筑 2024软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y gstararch2024`;
    await system.exec(uninstallCmd);
  });

  test('2054539-【V25】【浩辰CAD建筑 2024】软件下载安装', async ({ device, agent, uos }) => {
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
    await agent.aiInput('浩辰CAD建筑 2024', '应用商店顶部搜索框');
    await agent.aiTap("应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果包含浩辰CAD建筑 2024应用", {
      timeoutMs: 180000,
      checkIntervalMs: 3000,
    });
    await agent.aiTap("浩辰CAD建筑 2024条目右侧的安装按钮");
    await agent.aiWaitFor('浩辰CAD建筑 2024条目右侧出现"打开"按钮，表示安装完成', {
      timeoutMs: 1500000,
      checkIntervalMs: 5000,
    });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await agent.aiAssert("桌面出现浩辰CAD建筑 2024图标");
  }, { timeout: 1800000, tags: ['2054539', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件（保持安装，供后续用例使用）');
    await uos.showDesktop();
  });
});
