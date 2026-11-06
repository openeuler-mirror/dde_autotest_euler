
/**
 * 用例 PMSID: 1964627
 * 用例标题: 【V25】【龙芯浏览器_玲珑】软件卸载
 * 用例编写人:ut006345
 * 生成时间: 2025-12-23 16:38:03
 */

describe('1964627-【V25】【龙芯浏览器_玲珑】软件卸载', () => {
  beforeAll(async ({ device, uos, agent ,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install cn.loongnix.lbrowser`;
    await system.exec(installCmd);
    await uos.openLauncher();
    console.log('已打开启动器');
    await uos.searchInLauncher("龙芯浏览器");
    await agent.aiWaitFor("启动器界面出现龙芯浏览器应用",{timeoutMs:120000});
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1964627-【V25】【龙芯浏览器_玲珑】软件卸载', async ({ device, agent, uos }) => {
     await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('搜索框', { deepThink: true });
    await device.typeText('龙芯浏览器');
    await agent.aiAssert("启动器出现龙芯浏览器应用");
    await agent.aiRightClick("启动器中的龙芯浏览器应用");
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("菜单中的卸载选项", { deepThink: true });
    await agent.aiWaitFor("出现卸载确认弹窗");
    await agent.aiTap("确定");
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiAssert("启动器已打开");
    await agent.aiTap('搜索框', { deepThink: true });
    await device.typeText('龙芯浏览器', true);
    await agent.aiWaitFor("无搜索结果");
  }, { timeout: 1200000, tags: ['1964627', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
    await uos.closeCurrentWindow();
  });
});
