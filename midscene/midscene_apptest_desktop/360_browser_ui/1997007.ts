
/**
 * 用例 PMSID: 1997007
 * 用例标题: 【V25】【360安全浏览器】软件启动
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-04-21 15:40:28
 */

describe('1997007-【V25】【360安全浏览器】软件启动', () => {
  beforeAll(async ({ device, uos, agent,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.360.browser-stable`;
    await system.exec(installCmd);
    
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1997007-【V25】【360安全浏览器】软件启动', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器界面搜索框', { deepThink: true });
    await device.typeText('360安全浏览器',true);
    await agent.aiWaitFor("360安全浏览器界面已显示");
    await uos.maximizeWindow();
    await agent.aiAssert("360安全浏览器已打开");
try {
      // 等待弹窗出现（超时10秒，可根据实际调整）
      await agent.aiWaitFor("用户确认弹窗已显示", { timeout: 10000 });
      await agent.aiTap('用户确认弹窗的确定按钮', { deepThink: true });
      
      // 等待弹窗消失（确保操作生效）
      await agent.aiWaitForNot("用户确认弹窗已显示", { timeout: 5000 });
    } catch (e) {
      console.warn('用户确认弹窗未出现或处理失败，可能是首次启动已自动跳过，继续测试...', e);
    }
  }, { timeout: 1000000, tags: ['1997007', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.360.browser-stable`;
    await system.exec(uninstallCmd);
    
    
  });
});
