/**
 * 用例 PMSID: 1971137
 * 用例标题: 【V25】【奇安信可信浏览器】通过书签打开网址
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2025-01-21 13:52:25
 */

describe('1971137-【V25】【奇安信可信浏览器】通过书签打开网址', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install -y com.qianxin.browser-stable"`;
    await system.exec(installCmd);
    await uos.openLauncher();
    console.log('已打开启动器');
    await uos.searchInLauncher("奇安信可信浏览器");
    await agent.aiWaitFor("启动器界面出现奇安信可信浏览器应用",{timeoutMs:120000});
    await agent.aiAssert("启动器界面已显示奇安信可信浏览器");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1971137-【V25】【奇安信可信浏览器】通过书签打开网址', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await uos.maximizeWindow();
    await agent.aiAssert("奇安信可信浏览器已打开");
    
/*    try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }*/
    await agent.aiTap("浏览器顶部网址输入框", { deepThink: true });
    await device.typeText("www.baidu.com",true);
    await agent.aiWaitFor("百度界面已显示");
    await agent.aiTap("浏览器顶部搜索框最右侧的'﹀'左边的'☆'", { deepThink: true });
    await agent.aiWaitFor("弹窗出现'书签栏'");
    await agent.aiAssert("弹窗已出现");
    await agent.aiTap("完成");
    await device.pressKey("Ctrl","T");
    await agent.aiWaitFor("新建标签页出现");
    await agent.aiAssert("新建标签页顶部输入栏下方出现【百度一下，你就···】字样");
    await agent.aiTap("页面顶部输入栏下方【百度一下，你就···】字样");
    await agent.aiWaitFor("百度页面打开");
    await agent.aiAssert("百度界面已打开");
  }, { timeout: 1000000, tags: ['1971137', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("浏览器顶部网址输入栏最右侧被蓝色填充的'☆'");
    await agent.aiWaitFor("修改书签弹窗出现");
    await agent.aiAssert("修改书签弹窗已出现");
    await agent.aiTap('移除');
    await uos.closeCurrentWindow();
    await agent.aiTap('确定', { deepThink: true });
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
   
  });
});
