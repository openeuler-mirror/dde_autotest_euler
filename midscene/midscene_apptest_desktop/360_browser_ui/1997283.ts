
/**
 * 用例 PMSID: 1997283
 * 用例标题: 【V25】【360安全浏览器】浏览器管理插件程序
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-04-21 15:40:28
 */

describe('1997283-【V25】【360安全浏览器】浏览器管理插件程序', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.360.browser-stable`;
    await system.exec(installCmd);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1997283-【V25】【360安全浏览器】浏览器管理插件程序', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('360安全浏览器',true);
    await agent.aiWaitFor("360安全浏览器界面已显示");
    await agent.aiAssert("360安全浏览器已打开");
    await uos.maximizeWindow();
    try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }
    await agent.aiTap("浏览器右侧图标三", { deepThink: true });
    await agent.aiTap("插件与扩展")
    await agent.aiTap("管理插件程序")
    await agent.aiWaitFor("Kingsoft WPS Plugin")
   
  }, { timeout: 1000000, tags: ['1997283', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
  
    await uos.closeCurrentWindow();
    // await agent.aiTap('确定', { deepThink: true });
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.360.browser-stable`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
