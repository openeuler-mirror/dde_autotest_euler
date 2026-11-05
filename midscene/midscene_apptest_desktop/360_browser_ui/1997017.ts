1997013/**
 * 用例 PMSID: 1997017
 * 用例标题: 【V25】【360安全浏览器】添加收藏夹
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-04-23 13:52:25
 */

describe('1997017-【V25】【360安全浏览器】添加收藏夹', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install -y com.360.browser-stable"`;
    await system.exec(installCmd);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1997017-【V25】【360安全浏览器】添加收藏夹', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('360安全浏览器',true);
    await agent.aiWaitFor("360安全浏览器界面已显示");
    await uos.maximizeWindow();
    await agent.aiAssert("360安全浏览器已打开");
    await agent.aiTap("浏览器顶部网址输入框", { deepThink: true });
    await device.typeText("www.baidu.com",true);
    await agent.aiWaitFor("百度界面已显示");
    await agent.aiTap("浏览器顶部网址输入栏右侧的'☆'");
    await agent.aiWaitFor("已添加收藏夹弹窗出现");
    await agent.aiAssert("弹窗已出现");
    await agent.aiTap("完成");
/*    await agent.aiRightClick("浏览器收藏栏中“百度一下，你就知道”");
    await agent.aiTap("删除");
    await agent.aiWaitFor("您的收藏夹是空的，请从其他浏览器导入");*/
    
  }, { timeout: 1000000, tags: ['1997017', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("浏览器顶部网址输入栏右侧被蓝色填充的'☆'");
    await agent.aiWaitFor("修改收藏夹弹窗出现");
    await agent.aiTap('移除');
    await uos.closeCurrentWindow();
    await agent.aiTap('确定', { deepThink: true });
    // const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.360.browser-stable`;
    // await system.exec(uninstallCmd);
   
  });
});
