/**
 * 用例 PMSID: 1997803
 * 用例标题: 【V25】【360安全浏览器】添加阅读清单
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-04-23 15:40:28
 */

describe('1997803-【V25】【360安全浏览器】添加阅读清单', () => {
  beforeAll(async ({ device, uos, agent,env,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.360.browser-stable`;
    await system.exec(installCmd);
   // 步骤1: 打开浏览器应用并最大化窗口
    await uos.openApp("360安全浏览器", {maximizeWindow: true});
    await agent.aiAssert("360安全浏览器成功打开");
    // 步骤2：打开百度页面
    await agent.aiTap("地址栏");
    await device.typeText('baidu.com');
    await device.pressKey('Enter');
    await agent.aiWaitFor("界面出现'百度一下'");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1997803-【V25】【360安全浏览器】添加阅读清单', async ({ device, agent, uos }) => {

    // 打开书签和清单页面
    await agent.aiTap("360安全浏览器右侧图标三", { deepThink: true });
    await agent.aiTap("收藏夹和清单");
    await agent.aiTap("阅读清单")
    await agent.aiTap("向阅读清单中添加标签页")
    //  打开阅读清单验证
    await agent.aiTap("360安全浏览器右侧图标三", { deepThink: true });
    await agent.aiTap("收藏夹和清单")
    await agent.aiTap("阅读清单")
    await agent.aiTap("显示阅读清单")
    await agent.aiWaitFor("baidu");
  }, { timeout: 1000000, tags: ['1997803', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("360安全浏览器右侧图标三", { deepThink: true });
    await agent.aiTap("收藏夹和清单");
    await agent.aiTap("阅读清单")
    await agent.aiTap("显示阅读清单")
    await agent.aiRightClick("百度一下，你就知道")
    await agent.aiTap("删除")
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.360.browser-stable`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});