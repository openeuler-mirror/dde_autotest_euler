
/**
 * 用例 PMSID: 1965325
 * 用例标题: 【V25】【龙芯浏览器】多窗口运行下关闭应用
 * 用例编写人:ut006345
 * 生成时间: 2025-12-30 14:54:59
 */

describe('1965325-【V25】【龙芯浏览器】多窗口运行下关闭应用', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install -y cn.loongnix.lbrowser"`;
    await system.exec(installCmd);
    await uos.openLauncher();
    console.log('已打开启动器');
    await uos.searchInLauncher("龙芯浏览器");
    await agent.aiWaitFor("启动器界面出现龙芯浏览器应用",{timeoutMs:120000});
    await agent.aiAssert("启动器界面已显示龙芯浏览器应用");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1965325-【V25】【龙芯浏览器】多窗口运行下关闭应用', async ({ device, agent, uos }) => {
   await uos.openLauncher();
      console.log('已打开启动器');
      await agent.aiWaitFor("启动器界面已显示");
      await agent.aiTap('启动器中搜索框', { deepThink: true });
      await device.typeText('龙芯浏览器',true);
      await agent.aiWaitFor("龙芯浏览器界面已显示");
      await uos.maximizeWindow();
      try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }
      await agent.aiAssert("龙芯浏览器已打开");
      await device.pressKey("Ctrl","T");
      await agent.aiWaitFor("新建标签页出现");
      await uos.closeCurrentWindow();
      await agent.aiTap('确定');

      await agent.aiAssert("应用窗口已关闭");
  }, { timeout: 1200000, tags: ['1965325', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.loongnix.lbrowser`;
    await system.exec(uninstallCmd);
   
  });
});
