/**
 * 用例 PMSID: 1990707
 * 用例标题: 【V25】【奇安信可信浏览器】导入书签
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-03-30 16:38:03
 */

describe('1990707-【V25】【奇安信可信浏览器】导入书签', () => {
  beforeAll(async ({ device, uos, agent ,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
     const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.qianxin.browser-stable`;
     await system.exec(installCmd);
     await agent.aiWaitFor('桌面出现奇安信可信浏览器图标', {
       timeoutMs: 3000000, // 等待 3000 秒
       checkIntervalMs: 5000, // 每 5 秒检查一次
     });
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1990707-【V25】【奇安信可信浏览器】导入书签', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await agent.aiAssert("奇安信可信浏览器已打开");
    await uos.maximizeWindow();
    await agent.aiTap("书签栏的点此导入", { deepThink: true });
    await agent.aiWaitFor("导入书签");
    await agent.aiTap("导入")
    await agent.aiWaitFor("导入成功")
    await agent.aiTap("确定")
    await agent.aiWaitFor("基本设置")
    await agent.aiTap("设置标签页右侧的X", { deepThink: true });
    await agent.aiWaitFor("书签栏显示从Firefox导入")
    await agent.aiRightClick("从Firefox导入", { deepThink: true });
    await agent.aiWaitFor("删除菜单已显示");
    await agent.aiTap("删除", { deepThink: true });
    await agent.aiWaitFor("书签栏显示点此导入");
    

   
  }, { timeout: 1000000, tags: ['1990707', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
