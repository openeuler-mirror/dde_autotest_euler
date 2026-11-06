
/**
 * 用例 PMSID: 1965315
 * 用例标题: 【V25】【龙芯浏览器】在新标签页添加网址的快捷打开方式
 * 用例编写人:ut006345
 * 生成时间: 2025-12-30 13:09:48
 */

describe('1965315-【V25】【龙芯浏览器】在新标签页添加网址的快捷打开方式', () => {
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

  test('1965315-【V25】【龙芯浏览器】在新标签页添加网址的快捷打开方式', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('龙芯浏览器',true);
    await agent.aiWaitFor("龙芯浏览器界面已显示");
    await agent.aiAssert("龙芯浏览器已打开");
    await uos.maximizeWindow();
    try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }
    await device.pressKey("Ctrl","T");
    await agent.aiWaitFor("新建标签页出现");
    await agent.aiTap("添加快捷方式");
    await agent.aiWaitFor("出现添加快捷方式弹框");
    await agent.aiTap("名称输入框", { deepThink: true });
    await device.typeText("4399");
    await agent.aiTap("网址下方的输入框", { deepThink: true });
    await device.typeText("www.4399.com");
    await agent.aiTap("完成");
    await agent.aiAssert("快捷方式栏出现4399");
  }, { timeout: 1200000, tags: ['1965315', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    await agent.aiTap('确定', { deepThink: true });
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.loongnix.lbrowser`;
    await system.exec(uninstallCmd);
   
  });
});
