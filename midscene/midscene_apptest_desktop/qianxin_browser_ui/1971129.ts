
/**
 * 用例 PMSID: 1971129
 * 用例标题: 【V25】【奇安信可信浏览器】新建标签页
 * 用例编写人:UT000181(刘亚菲)
 * 生成时间: 2026-01-21 19:41:29
 */

describe('1971129-【V25】【奇安信可信浏览器】新建标签页', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S bash -c "apt update ; apt install -y com.qianxin.browser-stable"`;
    await system.exec(installCmd);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1971129-【V25】【奇安信可信浏览器】新建标签页', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await agent.aiAssert("奇安信可信浏览器已打开");
    await uos.maximizeWindow();
    try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }
    await device.pressKey("Ctrl","T");
    await agent.aiWaitFor("新建标签页出现");
    await agent.aiAssert("新建标签页成功");
  }, { timeout: 1200000, tags: ['1971129', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    await agent.aiTap('确定', { deepThink: true });
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
   
  });
});
